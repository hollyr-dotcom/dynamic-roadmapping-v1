const API_URL = "http://localhost:3001/api/chat";

interface NarrativeRequest {
  useCase: string;
  structuredData: Record<string, unknown>;
  fallbackText: string;
}

interface NarrativeResponse {
  text: string;
  fromAI: boolean;
}

export async function generateNarrative(req: NarrativeRequest): Promise<NarrativeResponse> {
  const systemPrompts: Record<string, string> = {
    uc1: `Add ONE sentence of strategic commentary. The user already sees the ranked list. Do not repeat item names or numbers. Just the takeaway. Max 20 words. Speak as a teammate — say "you should" not "the PM should".`,

    uc2: `Add ONE sentence about what to do about these mismatches. Do not repeat the findings. Max 20 words. Speak as a teammate — say "you should" not "the PM should".`,

    uc3: `Add ONE sentence about whether this trade is worth it. Do not repeat the items or numbers. Max 20 words. Speak as a teammate — say "you should" not "the PM should".`,

    uc4: `Add ONE sentence summarizing the overall direction of these changes. Do not repeat the individual items. Max 20 words. Speak as a teammate — say "you should" not "the PM should".`,

    uc5: `Add ONE sentence about what to prioritize first. Do not repeat the items. Max 20 words. Speak as a teammate — say "you should" not "the PM should".`,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompts[req.useCase] || systemPrompts.uc1 },
          { role: "user", content: JSON.stringify(req.structuredData) },
        ],
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) throw new Error("Empty response");

    return { text, fromAI: true };
  } catch {
    return { text: req.fallbackText, fromAI: false };
  }
}

/* ─── Intent classifier ─── */

export interface ClassifiedIntent {
  intent: string;
  itemName?: string;
  itemName2?: string;
  audience?: string;
  action?: string;
}

export async function classifyIntent(
  userText: string,
  roadmapItems: { title: string; priority: string }[],
  backlogItems: { title: string; priority: string }[],
): Promise<ClassifiedIntent | null> {
  const systemPrompt = `You are an intent classifier for a product management AI assistant.

Classify the user's question into exactly ONE intent.

INTENTS:
- "rank" — rank/prioritize items by evidence (e.g., "what should I prioritize", "rank my backlog", "strongest signal")
- "mismatch" — find where plan doesn't match demand (e.g., "where am I wrong", "out of sync", "what am I missing")
- "add-to-q2" — user wants to ADD one specific item and needs to know what to CUT to make room (e.g., "leadership wants me to add X", "fast-track X", "what do I trade off for X", "customer threatened churn over X")
- "swap" — user explicitly names TWO items: one to cut AND one to add (e.g., "cut X for Y", "swap X with Y", "replace X with Y")
- "cut" — user wants to find the safest item to cut, no specific add (e.g., "we need to cut one item", "which has least impact")
- "deep-dive" — explore one specific item in depth (e.g., "tell me about X", "why do customers want X")
- "promote" — increase a specific item's priority (e.g., "promote X", "prioritize X", "move X up")
- "demote" — decrease a specific item's priority (e.g., "demote X", "deprioritize X")
- "summarize" — write a change summary for an audience (e.g., "summarize for leadership", "what changed", "tell CS")
- "drift" — what shifted since last review (e.g., "has anything drifted", "what needs attention")
- "no-evidence" — items with weak/no evidence (e.g., "items with no evidence", "weak signal")
- "theme" — group items by shared theme (e.g., "group by theme", "what patterns")
- "dependencies" — what blocks what (e.g., "dependencies", "what blocks what")

AVAILABLE ITEMS:
${roadmapItems.map(i => `- ${i.title} (${i.priority}, roadmap)`).join('\n')}
${backlogItems.map(i => `- ${i.title} (${i.priority}, backlog)`).join('\n')}

Return ONLY a JSON object with these fields:
- "intent": one of the intents above (required)
- "itemName": the FULL title of the item from the lists above, if the user mentions one (optional)
- "itemName2": ONLY for "swap" intent — the FULL title of the second item (optional)
- "audience": for "summarize" only — "leadership", "engineering", or "cs" (optional)

CRITICAL RULES:
1. "add-to-q2" vs "swap": If the user mentions ONE item to add/fast-track/trade-off for, use "add-to-q2". Use "swap" ONLY if user names BOTH a cut item AND an add item.
2. "itemName" must be an actual item title from the lists above. Never set itemName to verbs (fast-track, prioritize), phrases (current projects, Q2 items), or anything not in the lists.
3. "itemName2" must ONLY be set for "swap" intent when user explicitly names two different items. Never infer a second item.
4. When in doubt between "add-to-q2" and "swap", prefer "add-to-q2".
5. Match partial item names to the closest full title from the lists.

EXAMPLES (showing the variety of phrasings for each intent):

rank:
- "What should I prioritize for Q2?" → {"intent":"rank"}
- "Rank my backlog by customer evidence" → {"intent":"rank"}
- "Which items have the strongest customer signal?" → {"intent":"rank"}
- "What does the evidence say I should bet on?" → {"intent":"rank"}
- "Help me figure out what to work on next" → {"intent":"rank"}
- "What are the highest-value items?" → {"intent":"rank"}

mismatch:
- "Where is my roadmap out of sync?" → {"intent":"mismatch"}
- "Am I missing something?" → {"intent":"mismatch"}
- "Show me where my plan is off" → {"intent":"mismatch"}
- "Are my priorities backed by evidence?" → {"intent":"mismatch"}
- "What doesn't match customer demand?" → {"intent":"mismatch"}

add-to-q2:
- "Leadership wants me to add fraud detection to Q2" → {"intent":"add-to-q2","itemName":"Fraud detection model v2 — anomaly scoring for high-value transfers"}
- "A customer threatened churn over recurring investment. What if I fast-track it?" → {"intent":"add-to-q2","itemName":"Recurring investment plans with dollar-cost averaging automation"}
- "We need to fit Open Banking into Q2. What do I trade off?" → {"intent":"add-to-q2","itemName":"Open Banking API integration for third-party account aggregation"}
- "My VP asked me to prioritize multi-currency. What gives?" → {"intent":"add-to-q2","itemName":"Multi-currency wallet with instant FX conversion"}
- "What happens if I fast-track fraud detection?" → {"intent":"add-to-q2","itemName":"Fraud detection model v2 — anomaly scoring for high-value transfers"}

swap:
- "Cut budgeting for Open Banking" → {"intent":"swap","itemName":"Smart budgeting engine with predictive spending forecasts","itemName2":"Open Banking API integration for third-party account aggregation"}
- "Swap automated savings for fraud detection" → {"intent":"swap","itemName":"Automated savings rules based on spending pattern analysis","itemName2":"Fraud detection model v2 — anomaly scoring for high-value transfers"}
- "Replace push notifications with recurring investment" → {"intent":"swap","itemName":"Push notification engine for price alerts and goal milestones","itemName2":"Recurring investment plans with dollar-cost averaging automation"}

cut:
- "We need to cut one Q2 item" → {"intent":"cut"}
- "Which item has the least customer impact?" → {"intent":"cut"}
- "What's the safest thing to drop?" → {"intent":"cut"}

summarize:
- "Summarize changes for leadership" → {"intent":"summarize","audience":"leadership"}
- "Write an update for engineering" → {"intent":"summarize","audience":"engineering"}
- "What should CS tell customers?" → {"intent":"summarize","audience":"cs"}
- "Tell my boss what changed" → {"intent":"summarize","audience":"leadership"}
- "What happened on the roadmap this month?" → {"intent":"summarize","audience":"leadership"}

drift:
- "Has anything drifted?" → {"intent":"drift"}
- "What needs my attention?" → {"intent":"drift"}
- "Anything I should know about?" → {"intent":"drift"}
- "What changed since I last looked?" → {"intent":"drift"}

promote/demote:
- "Promote Natural language search" → {"intent":"promote","itemName":"Natural language search across transactions and accounts"}
- "Prioritize fraud detection" → {"intent":"promote","itemName":"Fraud detection model v2 — anomaly scoring for high-value transfers"}
- "Demote push notifications" → {"intent":"demote","itemName":"Push notification engine for price alerts and goal milestones"}
- "Move savings rules down" → {"intent":"demote","itemName":"Automated savings rules based on spending pattern analysis"}

deep-dive:
- "Tell me about multi-currency wallet" → {"intent":"deep-dive","itemName":"Multi-currency wallet with instant FX conversion"}
- "Why do customers keep asking about categorisation?" → {"intent":"deep-dive","itemName":"Real-time transaction categorisation using ML classification"}
- "What's the deal with Open Banking?" → {"intent":"deep-dive","itemName":"Open Banking API integration for third-party account aggregation"}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userText },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 150,
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content) as ClassifiedIntent;
    if (!parsed.intent) return null;

    return parsed;
  } catch {
    return null;
  }
}
