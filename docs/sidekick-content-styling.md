# Sidekick Content Styling Guide — For Content Designers

## Voice & Tone

Sidekick is a **smart colleague who already read the data**. Not a report generator, not a chatbot, not an assistant.

| Do | Don't |
|---|---|
| "Move Automated savings down. Demand is declining." | "You may want to consider deprioritizing Automated savings." |
| "3 gaps found. Biggest: Push notifications." | "I've identified several areas where your roadmap may not be aligned." |
| "$660K of your Q2 has no customer feedback yet." | "There are some items that lack qualitative validation." |
| "Tell engineering — this changes sprint capacity." | "You may want to let your team know." |

### Rules

1. **Answer in the first sentence.** What should the PM do? Say it immediately.
2. **No hedging.** Never use "consider", "may", "could", "might". Use directives: "Move down", "Add to roadmap", "Schedule interviews."
3. **Say "you" not "the PM".** Sidekick is talking TO the PM, not about them.
4. **Never restate what the card shows.** If the card says "$250K, 71 customers", the text should say WHY that matters, not repeat the numbers.
5. **Sound opinionated.** "This is a stale priority" not "This may be a stale priority."

---

## Typography — Miro DS Body Specs

All text in the Sidekick panel uses the Miro Design System body foundation:

| Property | Value |
|---|---|
| **Font family** | Open Sans (`font-family-body`) |
| **Base size** | 14px |
| **Line height** | 150% (21px) |
| **Letter spacing** | 0px |

### Full Hierarchy

| Element | Size | Weight | Color | Line-height | Notes |
|---|---|---|---|---|---|
| **Header** `## Title` | 16px | 700 | #222428 | 130% | One per response |
| **Section label** `─── Label ───` | 11px | 700 | #9096A4 | — | Uppercase, 0.8px tracking. Max 2-3 per response |
| **Body paragraph** | 14px | 400 | #222428 | 150% | 1-2 sentences. The opinion lives here |
| **Numbered item name** | 14px | 500 | #222428 | 150% | Number in #9096A4, tabular-nums |
| **Data line** (indented) | 13px | 400 | #6f7489 | 150% | Left padding 28px. Dot separators (·) |
| **Bullet item** | 14px | 400 | #222428 | 150% | Bullet dot in #9096A4 |
| **Empty line** | — | — | — | — | 10px vertical gap |

### Name + Data Pattern

Every item in a list uses two lines. Name first, data below.

```
1. AI portfolio advisor with personalized risk-adjusted recommendations
   $425K · 134 accounts · ↑ growing · Mar 28
```

- **Line 1 (name):** 14px, weight 500, #222428. NO bold unless it's the ONE key item.
- **Line 2 (data):** 13px, weight 400, #6f7489, indented 28px. Middle dot (·) separators.
- **Spacing:** blank line between items.

**Never cram name + data on one line.** This is the most common mistake.

| Wrong | Right |
|---|---|
| `**Item** — $425K, 134 customers, ↑ growing` | `Item name` (line 1) + `$425K · 134 accounts · ↑ growing` (line 2) |

---

## Inline Formatting

### Bold — **text**

- **Weight:** 700
- **Use:** The ONE item the PM needs to act on. Max 1-2 bold items per response.
- **Multi-word bold:** adds a source chip (grey pill with table icon) for item references.
- **Short bold (≤2 words):** no source chip. Used for labels like **Start:** or **Shipped:**
- **In ranked lists:** item names are NOT bold. Only bold the key finding.

### Italic — *text*

- **Color:** #6f7489
- **Use:** Priority labels (*now*, *next*, *later*), status notes (*not on roadmap*), soft callouts.

### Trend Colors

Trends always use color tokens — never plain text.

| Token | Renders as | Color | Weight |
|---|---|---|---|
| `{{green:↑ growing}}` | ↑ growing | #38A169 | 600 |
| `{{red:↓ declining}}` | ↓ declining | #E53E3E | 600 |
| `{{red:not on roadmap}}` | not on roadmap | #E53E3E | 600 |
| `{{green:clean — no dependencies}}` | clean — no dependencies | #38A169 | 600 |
| (no token) `→ stable` | → stable | #6f7489 (default) | 400 |

**Rule:** If a trend is positive, it must be green. If negative, red. Stable is default grey. Never show trend direction without color.

### Source Chips

Inline grey pills that appear after bold item references, indicating where the data comes from.

- **Style:** grey pill (#F1F2F5), 12px, 600 weight, #6f7489 text
- **Content:** table icon + "Roadmap table"
- **Use:** appears after multi-word bold references (item names with 3+ words)

---

## Sources Section

Every AI response ends with a collapsible "Sources (N)" section.

```
Sources (4) ˅
  📊 Roadmap table
  📊 Backlog table
  💡 Insights evidence
  💬 Customer quotes
```

- **Default state:** collapsed (just the "Sources (4) ˅" line)
- **Expanded:** shows each source with icon + name
- **Font:** 13px, 600 weight for header, 400 for items
- **Color:** #6f7489 header, #222428 items
- **Position:** after cards, before pills

---

## Response Patterns by Use Case

### UC1: Ranking (~150 words max)

```
## Your Q2 priorities by evidence

[Summary stat line — mentions · customers · ARR · item count]

[Answer — 1 sentence: how aligned is the plan?]

─── Top 3 by evidence ─────────────
1. [Item name]
   [data line with color trends]

2. [Item name]
   [data line]

3. [Item name]
   [data line]

[One key finding]

Sources (4) ˅
```

Top 3 only. More behind pills.

### UC2: Mismatch (~100 words max)

```
## Plan vs demand

[Answer — N gaps. Biggest: Item.]

• [Item name — type label]
  [Root cause on data line]

• [Item name — type label]
  [Root cause]

[+N more if >2]

Sources (4) ˅
```

Top 2 findings. Rest behind pill.

### UC3: Trade-off (~60 words max)

```
## Making room for [Item]

[Recommendation — what to cut + why]

[N other options available]

Sources (4) ˅
```

One recommendation. Alternatives behind pill.

### UC4: Summarize (varies by audience)

```
## Q2 Roadmap Update (Mar 11 – Apr 10)

[Count + context]

─── What shifted and why ──────────
1. [Item — {{green:moved up}} / {{red:moved down}}]
   [data line with reason]

2. [Item — status]
   [data line]

[Net impact + risk — leadership only]

Sources (4) ˅
```

Grouped format when >5 changes. Each sub-item on its own indented line.

### UC5: Drift (~120 words max)

```
## What shifted

[Answer — N shifted. X need attention.]

1. [Before/after narrative]

2. [Narrative]

3. [Narrative]

[+N more if >3]

Sources (4) ˅
```

Top 3 items. Full list behind pill.

### Confirmations (~50 words max)

```
## Change applied

[What changed — from X to Y]
[Who to notify — specific instruction]

─── Impact ────────────────────────
• [What unblocks/affects]

Sources (4) ˅
```

---

## Information Density Rules

### Show immediately
- The answer (1 sentence)
- Top 3 ranked items (not 5, not all)
- Top 2 findings (not all)
- One recommended action (not 3 alternatives)
- Net impact (1 line)

### Put behind pills
- Full ranked list
- All mismatches
- Alternative cut options
- Theme deep dives
- Validation gaps detail

### Never show
- Evidence scores (show the ranking, not the number)
- Technical labels ("over-invested" → "getting more priority than demand supports")
- Duplicate information (if the card shows it, text shouldn't)

---

## Numbers Must Match What's Visible

Any number in the text must match what the PM can see on screen.

| Correct | Wrong |
|---|---|
| "Your top 3" (3 items shown) | "4 of your top 5" (only 3 shown) |
| "2 gaps found" (2 visible) | "4 gaps found" (only 2 visible) |
| "+3 more — ask to see all" (when hiding) | Silently hiding items |

**When hiding items behind pills:** always say how many are hidden.

---

## Formatting Consistency Rules

These rules apply to **every builder, every response**. Not just the first one.

### 1. Two-line items (name + data)
Every item in every list — rankings, findings, drift narratives, summaries — splits name and data onto separate lines. No exceptions.

### 2. Color trends everywhere
Every mention of growing/declining demand uses `{{green:}}` or `{{red:}}` tokens. Never plain text trends.

### 3. Dot separators in data lines
Data lines use middle dot (·) between values: `$425K · 134 accounts · ↑ growing · Mar 28`. Never commas.

### 4. Bold only for the key item
In ranked lists: item names are NOT bold. Only bold the ONE item the PM needs to act on (usually in the answer sentence or key finding).

### 5. Section labels are UPPERCASE
`─── TOP 3 BY EVIDENCE ─────────────` not `─── Top 3 by evidence ─────────────` (the renderer handles this — but content should be written in title case, it renders as uppercase).

### 6. Max items shown
- Rankings: 3
- Findings: 2
- Drift items: 3
- Alternatives: 0 inline (count only, behind pill)
- Always say "+N more" when hiding

---

## Section Label Naming

| Good | Bad |
|---|---|
| Top 3 by evidence | Evidence ranking |
| What stands out | Disagreements |
| Needs validation | No customer quotes |
| What shifted and why | Changes |
| What to do | Recommendations |
| Items to review | Drift detection results |
| Action items | Engineering changes |
| Talking points | Customer-facing changes |
| All options by risk | Cut candidates |

---

## Pill Label Writing

Pills are chip buttons (→ arrow + text) that appear above the prompt bar.

| Good | Bad |
|---|---|
| "3 items need validation" | "Show items with weak evidence" |
| "Explore Savings & budgeting theme" | "Deep dive into theme" |
| "What should I reprioritize?" | "Reprioritize based on ranking" |
| "Move Automated savings down" | "Demote item" |

### Rules
1. **Start with a verb or number** — "Explore", "Move", "3 items"
2. **Be specific** — include the item name or count
3. **Max 35 characters** — truncates with ellipsis beyond that
4. **Never contradict the response** — if you said "pull back", don't offer "Promote"
5. **Show after streaming completes** — never during text generation
6. **Max 3 pills** — forward actions first, "back to overview" last if space
7. **Dismiss on click or X** — pills disappear after any interaction
