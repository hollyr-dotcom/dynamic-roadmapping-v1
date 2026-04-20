# Sidekick Design Spec — For Designers

## What is Sidekick?

An AI assistant embedded in the roadmap table that helps PMs make evidence-backed decisions. It reads from two data tables (Roadmap + Backlog), cross-references customer evidence (mentions, ARR, customer quotes, demand trends), and surfaces insights the PM would otherwise spend hours finding manually.

---

## 5 Use Cases

| UC | Trigger | What it does | PM moment |
|---|---|---|---|
| **UC1: Prioritize** | "Am I betting on the right things?" | Ranks items by composite evidence score, surfaces gaps between plan and data | Monday morning roadmap check |
| **UC2: Mismatch** | "Where is my roadmap out of sync?" | Finds over-invested, under-invested, and missing items | Quarterly alignment review |
| **UC3: Trade-off** | "What if I add fraud detection to Q2?" | Recommends what to cut, shows net impact, applies the swap | VP Slack: "We need X in Q2" |
| **UC4: Summarize** | "Summarize changes for leadership" | Generates audience-specific update (leadership/eng/CS) with date range | Weekly Slack update, monthly review |
| **UC5: Drift** | "Has anything drifted?" | Compares current evidence vs 4 weeks ago, flags what shifted | Haven't looked at roadmap in weeks |

---

## Response Framework

Every response follows this structure:

```
[Answer — one sentence, what to do]
[Top finding — the most important thing to act on]
[Depth — behind pills, not inline]
```

### Progressive Disclosure

| Level | What shows | When |
|---|---|---|
| **Immediate** | Answer + top 3 items + one key finding | Always |
| **One click** | Validation gaps, alternative options, theme deep dives | Via pill chips |
| **On request** | Full ranked list, all mismatches, detailed evidence | Via typed question |

The PM should never feel overwhelmed. If they want more, they ask.

---

## Intent Classification

Every user input is classified into one of 4 roots:

| Root | When | Example intents |
|---|---|---|
| **Architect** | Planning, structuring, high-level | rank, theme, summarize |
| **Debug** | Finding what's wrong | mismatch, drift |
| **Refine** | Optimizing what exists | promote, demote |
| **Expand** | Adding new scope | add-to-q2, swap, deep-dive |

The root drives pill behavior — pills never contradict the answer (e.g., a declining theme won't show a "Promote" pill).

---

## Visual Components

### 1. Suggestion Cards (Entry Point)

The "For you" cards that appear before any conversation.

- **Font:** Apris (serif), 20px, 400 weight, 0.02em letter-spacing
- **Last card:** italic
- **Card:** #FAFAFC background, 1px #F4F4F1 border, 12px radius, 20px padding
- **Arrow:** right-aligned, #191812
- **Layout:** vertically centered in the panel, max-width 80% text

### 2. Change Card (Before → After)

Shows whenever Sidekick suggests moving something.

- **Header:** "Proposed changes", 13px, 700 weight
- **Each row:** Item name (600 weight) + from (strikethrough, #6f7489) → to (green #38A169, 600 weight)
- **Reason:** 12px, #6f7489, optional
- **Card:** white background, 1px #E9EAEF border, 12px radius

### 3. Theme Card

Shows items grouped by theme with trend indicators.

- **Header:** Theme name (bold) + combined ARR (right-aligned, grey)
- **Each row:** Item name + priority badge + trend label (colored) + ARR + account count
- **Badges:** Priority = grey #F1F2F5 pill, "Not on roadmap" = red #FFF5F5 pill
- **Trend colors:** Growing = #38A169, Declining = #E53E3E, Stable = #6f7489

### 4. Chip Pills

Appear above the prompt bar after response completes.

- **Size:** 37px height, max 260px width
- **Style:** white bg, 1px #E7E7E5 border, 16px radius, elevation-100 shadow
- **Content:** → arrow (#656B81) + label (13px, 400 weight, #222428)
- **Hover:** darker border (#D0D0CE), deeper shadow
- **Dismiss:** X icon, positioned absolute top-right of pill container
- **Behavior:** appear only after text streaming completes, dismissed on click or X

### 5. Loading Indicator

Collapsible step list during analysis.

- **Header:** logo-spinner.png (20px) + current step text (#656B81) + chevron
- **Steps:** left border (1.5px #E9EAEF) + "Sidekick" label (600 weight) + step text
- **Completed steps:** circle checkmark icon (16px, #AEB2C0 stroke)
- **In-progress:** logo-spinner.png (16px)
- **After completion:** collapses to single line, expandable on click

### 6. Prompt Bar

- **Outer container (floating):** 436px wide, 64px tall, 24px radius, white, elevation-300 shadow
- **Inner input:** #F4F4F1, 16px radius, 48px height
- **Icons:** Mic (16px SVG) + AI icon (26px, /icon-voice-llm.png)
- **Send state:** when text present, AI icon swaps to dark square (32px, 12px radius) with white IconArrowUp

### 7. Link Icon

Inline reference indicator on bold item names.

- **Background:** #E8EEFF (light blue), #CADAFF on hover
- **Icon:** IconLink, #3859FF
- **Size:** small, 4px radius, 2px padding
- **Dropdown:** 4 options (Add to board, Copy, View details, Related evidence)

---

## Interaction Flow

```
[Floating bar or Sidekick panel]
        ↓ user types/clicks
[Loading indicator — collapsible steps]
        ↓ steps complete
[Response text streams word-by-word]
        ↓ streaming completes
[Change cards appear (if applicable)]
        ↓ 
[Chip pills appear above prompt bar]
        ↓ user clicks pill OR types new question
[Next response cycle]
```

### Apply Actions

When user clicks "Apply this change" or "Apply this swap":
1. State updates immediately (live proxy keeps builders in sync)
2. View switches to **kanban** (now/next/later columns)
3. Changed cards highlight for 10 seconds
4. Confirmation response shows: what changed, ARR impact, who to notify

---

## Layout Zones

```
┌────────────────────────────┐
│  Panel Header              │
├────────────────────────────┤
│                            │
│  Scrollable message area   │  ← Text, cards, loading
│  (flex: 1, overflow-y)     │     indicator all here.
│                            │     Content never bleeds
│                            │     below this zone.
│                            │
├────────────────────────────┤
│  Chip pills + X dismiss    │  ← Fixed bottom zone.
│  Prompt bar (input)        │     Always visible.
└────────────────────────────┘
```

---

## Color Tokens

| Token | Value | Usage |
|---|---|---|
| Text primary | #222428 | Body text, headers, item names |
| Text secondary | #6f7489 | Data lines, labels, bullet dots |
| Text tertiary | #9096A4 | Section labels, numbered list numbers |
| Text muted | #AEB2C0 | Loading steps, recency dates |
| Growing | #38A169 | Trend up, promoted priority |
| Declining | #E53E3E | Trend down, not on roadmap badge |
| Link blue | #3859FF | Link icon, reference indicators |
| Link bg | #E8EEFF | Link icon background |
| Surface | #FFFFFF | Cards, pill chips |
| Surface alt | #F4F4F1 | Input bar, user bubbles |
| Surface card | #FAFAFC | Suggestion cards |
| Border | #E9EAEF | Card borders, dividers |
| Border light | #E7E7E5 | Pill chip borders |
| Border subtle | #F1F2F5 | Table row dividers |
