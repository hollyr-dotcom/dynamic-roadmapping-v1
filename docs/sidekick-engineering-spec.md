# Sidekick Engineering Spec — For Engineers

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  App.tsx (state owner)                              │
│  ├── roadmapItems (useState)                        │
│  ├── backlogData (useState)                         │
│  ├── handleApplyReprioritize()                      │
│  ├── handleApplySwap()                              │
│  └── Passes live state + callbacks as props         │
├─────────────────────────────────────────────────────┤
│  AiPanelSolutionReview.tsx (~3500 lines)            │
│  ├── Live State Proxy (syncLiveState)               │
│  ├── Intent Classifier (OpenAI + regex fallback)    │
│  ├── 15 Builder Functions                           │
│  ├── Pill Guardrail System (buildGuardedPills)      │
│  ├── Text Renderer (renderTextWithLinks)            │
│  └── PanelBody (conversation thread UI)             │
├─────────────────────────────────────────────────────┤
│  openai.ts                                          │
│  ├── classifyIntent() → OpenAI GPT-4o-mini          │
│  ├── generateNarrative() → AI commentary            │
│  └── Proxy server: localhost:3001/api/chat          │
├─────────────────────────────────────────────────────┤
│  @spaces/shared (sampleData.ts)                     │
│  ├── roadmapData, sampleData (SpaceRow[])           │
│  ├── companyARR, customerQuotes                     │
│  ├── itemDependencies, demandTrend                  │
│  └── itemHistory (ItemChange[])                     │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Input → Intent Classification

```
User types "What if I add fraud detection?"
        ↓
routeInputAsync(text)
        ↓
classifyIntent(text, roadmapTitles, backlogTitles)  ← OpenAI call, 5s timeout
        ↓ returns { intent: "add-to-q2", itemName: "Fraud detection...", dateRange: undefined }
mapIntentToBuilder(classified)
        ↓ finds item by fuzzy match
buildAddToQ2(itemId)
        ↓ returns MessageContent
addAiResponse(content, userText)
        ↓ shows loading → streaming → pills
```

### 2. Fallback Chain

```
OpenAI classifier (5s timeout)
        ↓ fails or no match
routeInputRegex(text)  ← 30+ regex patterns
        ↓ fails
Default "I didn't catch that" response with suggestions
```

### 3. Apply Actions → State Mutation

```
User clicks "Apply this change" pill
        ↓
handlePillClick() → extracts itemId + newPriority from pill key
        ↓
onApplyReprioritize(itemId, newPriority, reason)  ← callback to App.tsx
        ↓
App.tsx mutates roadmapItems/backlogData state
        ↓
setActiveTab('kanban')  ← switches to kanban view
        ↓
Live proxy auto-updates → next builder call sees new state
```

---

## Live State Sync (Proxy Pattern)

The critical innovation: builders reference `roadmapData` and `sampleData` as module-level variables, but these are Proxies that read from `_liveRoadmap` / `_liveBacklog`. Updated every render via `syncLiveState()`.

```typescript
// Module level
let _liveRoadmap: SpaceRow[] = _staticRoadmap;
let _liveBacklog: SpaceRow[] = _staticBacklog;

const roadmapData = new Proxy([] as SpaceRow[], {
  get(_target, prop) { return Reflect.get(_liveRoadmap, prop); },
  // ... has, ownKeys, getOwnPropertyDescriptor
});

// In component render
syncLiveState(liveRoadmapItems || _staticRoadmap, liveBacklogItems || _staticBacklog);
```

**Why:** All 15 builders use `roadmapData` and `sampleData` (36+ references). Changing every function signature to accept live state would be a massive refactor. The proxy pattern gives live data access with zero builder changes.

---

## Intent Classification

### ClassifiedIntent Type

```typescript
interface ClassifiedIntent {
  intent: string;       // "rank" | "mismatch" | "add-to-q2" | "swap" | "cut" | "deep-dive" | "promote" | "demote" | "summarize" | "drift" | "no-evidence" | "theme" | "dependencies"
  itemName?: string;    // Full title from item lists
  itemName2?: string;   // Only for "swap" — second item
  audience?: string;    // Only for "summarize" — "leadership" | "engineering" | "cs"
  dateRange?: string;   // Only for "summarize" — "this week" | "last month" | "since March 8"
  action?: string;
}
```

### Intent → Builder Mapping

```typescript
switch (intent) {
  case 'rank':       return buildFlow1Initial();
  case 'mismatch':   return buildUC2Mismatch();
  case 'add-to-q2':  return buildAddToQ2(item1.id);
  case 'swap':       return buildFlow3(item1.id, item2.id);
  case 'cut':        return buildAltCut();
  case 'summarize':  return buildUC4Summary(audience, dateRange);
  case 'drift':      return buildUC5Drift();
  case 'deep-dive':  return buildFlow2(item1.id);
  case 'promote':    return buildReprioritize(item1.id, 'promote');
  case 'demote':     return buildReprioritize(item1.id, 'demote');
  // ...
}
```

### Item Matching (Fuzzy)

```typescript
const findItem = (name?: string) => {
  // 1. Exact title match
  // 2. Title contains search term (8+ chars)
  // 3. Keyword overlap (2+ words match) — prevents false matches
  // Rejects: short strings (<4 chars), non-item text
};
```

---

## Builder System

### MessageContent Type

```typescript
type MessageContent = {
  text: string;                              // Markdown-like text (## headers, ─── sections, bullets, {{color:text}})
  textPromise?: Promise<string>;             // Async AI narrative (appended to text)
  cards?: React.ReactNode[];                 // ChangeCard, theme cards, impact cards
  pills?: { label: string; key: string }[];  // Suggestion chips
  loadingSteps?: string[];                   // Analysis progress steps
  intentRoot?: IntentRoot;                   // 'architect' | 'debug' | 'refine' | 'expand'
};
```

### Pill Guardrail System

```typescript
type IntentRoot = 'architect' | 'debug' | 'refine' | 'expand';

function buildGuardedPills(
  root: IntentRoot,
  candidates: { label: string; key: string }[],
  context: { allDeclining?: boolean; recommendedAction?: 'promote' | 'demote' | 'add' | 'cut' | 'swap' | null }
): { label: string; key: string }[] {
  // Rule 1: No contradictions (declining → no promote pills)
  // Rule 2: Progression (forward pills first, reset last)
  // Rule 3: Max 3 pills returned
}
```

### Pill Key Routing

Dynamic pill keys are parsed by regex in `routePillKey()`:

```
"reprioritize-promote-{itemId}"     → buildReprioritize(itemId, 'promote')
"reprioritize-demote-{itemId}"      → buildReprioritize(itemId, 'demote')
"apply-reprioritize-{itemId}-{pri}" → buildApplyConfirmation(itemId, pri)
"apply-swap-{cutId}-{addId}"        → buildApplySwap(cutId, addId)
"uc1-theme-{themeName}"             → buildUC1Theme(themeName)
"flow2-{itemId}"                    → buildFlow2(itemId)
"uc4-leadership"                    → buildUC4Summary('leadership')
```

---

## Evidence Scoring

```typescript
function evidenceScore(item: SpaceRow): number {
  const trendBonus = growing ? 1.2 : declining ? 0.7 : 1.0;
  const recencyBonus = ≤14days ? 1.15 : ≤30days ? 1.0 : 0.85;
  return (mentions * 0.3 + customers * 0.4 + estRevenue/10 * 0.3) * trendBonus * recencyBonus;
}
```

Weights: **customers (40%)** > mentions (30%) = revenue (30%). Growing demand gets 1.2x boost. Recent mentions (≤14 days) get 1.15x.

---

## Text Rendering Pipeline

```
Builder generates text string with tokens:
  "## Header"           → 16px bold heading
  "─── Label ───"       → 11px uppercase section label
  "• bullet text"       → bullet point
  "1. numbered text"    → numbered list
  "   indented text"    → 13px grey data line (3+ spaces)
  "**bold**"            → font-weight 700 (+ LinkIcon if multi-word)
  "*italic*"            → grey color
  "{{green:text}}"      → #38A169 bold
  "{{red:text}}"        → #E53E3E bold
        ↓
renderTextWithLinks() parses line-by-line
        ↓
renderInlineFormatting() handles bold/italic/color within lines
        ↓
React nodes rendered
```

---

## How to Add a New Use Case

### Step 1: Add intent to classifier

In `openai.ts`, add to the system prompt:
- New intent name in INTENTS list
- 3-5 example phrasings
- Any new fields (add to ClassifiedIntent interface)

### Step 2: Create builder function

In `AiPanelSolutionReview.tsx`:

```typescript
function buildMyNewUseCase(param: string): MessageContent {
  // Read data from roadmapData, sampleData, demandTrend, etc.
  // (These are live proxies — always current)
  
  return {
    text: `## Answer first\n\nOne key finding.\n\n─── Details ───────────────\n• Detail behind section header`,
    cards: [<ChangeCard key="x" changes={[...]} />],  // if suggesting changes
    pills: buildGuardedPills('debug', [
      { label: "Next action", key: "some-key" },
      { label: "Back to overview", key: "flow1-initial" },
    ], { recommendedAction: null }),
    loadingSteps: ["Reading data…", "Analyzing…"],
    intentRoot: 'debug',
  };
}
```

### Step 3: Wire intent → builder

In `mapIntentToBuilder()`:
```typescript
case 'my-new-intent':
  return buildMyNewUseCase(itemName || 'default');
```

### Step 4: Add regex fallback

In `routeInputRegex()`:
```typescript
if (/my pattern|another pattern/i.test(lower)) return buildMyNewUseCase('param');
```

### Step 5: Add pill routing (if needed)

In `routePillKey()`:
```typescript
case 'my-new-key': return buildMyNewUseCase('param');
```

---

## API Proxy

```
Bun server on port 3001
POST /api/chat → forwards to OpenAI with API key from .env
CORS headers for localhost dev
```

Start: `cd packages/api && bun run index.ts`

Without the proxy running, AI narratives fail silently and fall back to scripted text. All builders work without it — the AI just adds a one-sentence commentary.

---

## Key Files

| File | Lines | Purpose |
|---|---|---|
| `packages/spaces-table/src/components/sidebar/AiPanelSolutionReview.tsx` | ~3500 | Everything: builders, UI, routing, state |
| `packages/spaces-table/src/lib/openai.ts` | ~200 | Intent classifier + narrative generator |
| `packages/shared/src/sampleData.ts` | ~240 | All demo data (items, trends, history, quotes) |
| `packages/api/index.ts` | ~30 | OpenAI proxy server |
| `packages/spaces-table/src/App.tsx` | ~900 | State owner, apply handlers, floating bar |
