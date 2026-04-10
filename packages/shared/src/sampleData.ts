import type { Priority, Status } from './types.ts'

export interface SpaceRow {
  id: string
  title: string
  description?: string
  jiraKey?: string
  mentions: number
  customers: number
  estRevenue: number
  companies: string[]
  priority: Priority
  status?: Status
}

export const sampleData: SpaceRow[] = [
  { id: "1",  title: "AI portfolio advisor with personalized risk-adjusted recommendations",       description: "Use ML models to generate tailored portfolio suggestions based on user risk profile and market data.",        jiraKey: "FIN-101", mentions: 142, customers: 134, estRevenue: 425, companies: ["Figma", "Airbnb", "Stripe", "Notion"], priority: "now" },
  { id: "2",  title: "Real-time transaction categorisation using ML classification",               description: "Automatically tag every transaction with a spending category using a trained classification model.",         jiraKey: "FIN-102", mentions: 118, customers: 97,  estRevenue: 340, companies: ["Spotify", "Stripe", "Linear"], priority: "now" },
  { id: "3",  title: "Smart budgeting engine with predictive spending forecasts",                  description: "Analyse past spending to predict future expenses and surface proactive budget recommendations.",              jiraKey: "FIN-103", mentions: 105, customers: 89,  estRevenue: 235, companies: ["Dropbox", "ZenDesk", "Asana"], priority: "now" },
  { id: "4",  title: "Multi-currency wallet with instant FX conversion",                           description: "Let users hold and convert between currencies in real time at competitive exchange rates.",                  jiraKey: "FIN-104", mentions: 98,  customers: 112, estRevenue: 390, companies: ["Atlassian", "Notion", "Miro"], priority: "now" },
  { id: "5",  title: "Automated savings rules based on spending pattern analysis",                 description: "Trigger automatic transfers to savings when predefined spending thresholds or patterns are detected.",        jiraKey: "FIN-105", mentions: 64,  customers: 71,  estRevenue: 250, companies: ["Shopify", "Figma", "Linear"], priority: "now" },
  { id: "6",  title: "Natural language search across transactions and accounts",                   description: "Allow users to query their financial history in plain English, e.g. 'coffee last month'.",                   jiraKey: "FIN-106", mentions: 48,  customers: 53,  estRevenue: 190, companies: ["Apple", "Google", "Slack", "Jira"], priority: "now" },
  { id: "7",  title: "Recurring investment plans with dollar-cost averaging automation",           description: "Enable scheduled investments into chosen assets to smooth out market volatility over time.",                  jiraKey: "FIN-107", mentions: 45,  customers: 38,  estRevenue: 160, companies: ["Asana", "Linear", "Notion"], priority: "next" },
  { id: "8",  title: "Fraud detection model v2 — anomaly scoring for high-value transfers",       description: "Upgrade the fraud pipeline with real-time anomaly scores to flag suspicious large transactions.",             jiraKey: "FIN-108", mentions: 23,  customers: 19,  estRevenue: 85,  companies: ["Apple", "Google", "ZenDesk"], priority: "triage" },
  { id: "9",  title: "Social investing — follow and mirror portfolios from top performers",        description: "Let users discover and copy-trade verified high-performing investor portfolios.",                             jiraKey: "FIN-109", mentions: 21,  customers: 24,  estRevenue: 100, companies: ["Dropbox", "ZenDesk"], priority: "later" },
  { id: "10", title: "Tax-loss harvesting assistant with end-of-year optimisation",                description: "Identify opportunities to sell underperforming assets to offset capital gains before year end.",              jiraKey: "FIN-110", mentions: 16,  customers: 14,  estRevenue: 70,  companies: ["Spotify", "Stripe", "Miro", "Slack"], priority: "later" },
  { id: "11", title: "Open Banking API integration for third-party account aggregation",           description: "Connect external bank accounts via Open Banking APIs to give users a unified financial view.",                jiraKey: "FIN-111", mentions: 16,  customers: 18,  estRevenue: 80,  companies: ["ZenDesk", "Jira", "Atlassian"], priority: "triage" },
  { id: "12", title: "Financial literacy hub with interactive learning modules",                   description: "Build an in-app learning centre with bite-sized lessons on investing, saving, and credit.",                  jiraKey: "FIN-112", mentions: 12,  customers: 9,   estRevenue: 45,  companies: ["Figma", "Airbnb", "Shopify", "Linear"], priority: "later" },
  { id: "13", title: "Accessibility audit and WCAG 2.2 AA compliance across all flows",           description: "Audit and remediate all user-facing flows to meet WCAG 2.2 AA accessibility standards.",                    jiraKey: "FIN-113", mentions: 10,  customers: 11,  estRevenue: 50,  companies: ["Notion", "Asana"], priority: "later" },
  { id: "14", title: "Push notification engine for price alerts and goal milestones",              description: "Deliver timely push alerts when assets hit target prices or savings goals are reached.",                     jiraKey: "FIN-114", mentions: 10,  customers: 8,   estRevenue: 35,  companies: ["Asana", "Linear", "Google"], priority: "triage" },
  { id: "15", title: "Crypto asset support — buy, hold, and track digital currencies",            description: "Add crypto to the portfolio: purchase, custody, and price tracking for major digital assets.",               jiraKey: "FIN-115", mentions: 8,   customers: 6,   estRevenue: 25,  companies: ["Stripe"], priority: "icebox" },
  { id: "16", title: "Advisor marketplace connecting users with certified financial planners",     description: "Surface a curated marketplace where users can book sessions with vetted financial advisors.",                jiraKey: "FIN-116", mentions: 7,   customers: 9,   estRevenue: 40,  companies: ["Figma", "Miro", "Slack"], priority: "icebox" },
  { id: "17", title: "Dark mode across web and mobile apps",                                       description: "Implement a system-aware dark theme across all surfaces for improved low-light usability.",                  jiraKey: "FIN-117", mentions: 6,   customers: 5,   estRevenue: 0,   companies: ["Apple", "Google", "Notion", "Atlassian", "Jira"], priority: "icebox" },
  { id: "18", title: "Gamified savings challenges with achievement badges",                        description: "Motivate users to hit savings targets through streaks, challenges, and unlockable badge rewards.",           jiraKey: "FIN-118", mentions: 5,   customers: 7,   estRevenue: 30,  companies: ["Shopify", "Airbnb"], priority: "icebox" },
]

export const roadmapData: SpaceRow[] = [
  // New — actively in progress
  { id: "r1",  title: "AI portfolio advisor with personalized risk-adjusted recommendations",       mentions: 142, customers: 134, estRevenue: 425, companies: ["Figma", "Airbnb", "Stripe", "Notion"],   priority: "now", status: "in-progress" },
  { id: "r2",  title: "Real-time transaction categorisation using ML classification",               mentions: 118, customers: 97,  estRevenue: 340, companies: ["Spotify", "Stripe", "Linear"],            priority: "now", status: "in-progress" },
  { id: "r3",  title: "Smart budgeting engine with predictive spending forecasts",                  mentions: 105, customers: 89,  estRevenue: 235, companies: ["Dropbox", "ZenDesk", "Asana"],            priority: "now", status: "in-progress" },
  { id: "r4",  title: "Multi-currency wallet with instant FX conversion",                           mentions: 98,  customers: 112, estRevenue: 390, companies: ["Atlassian", "Notion", "Miro"],            priority: "now", status: "planning" },
  { id: "r5",  title: "Automated savings rules based on spending pattern analysis",                 mentions: 64,  customers: 71,  estRevenue: 250, companies: ["Shopify", "Figma", "Linear"],             priority: "now", status: "in-progress" },
  // Prioritized — planned, not started
  { id: "r6",  title: "Recurring investment plans with dollar-cost averaging automation",           mentions: 45,  customers: 38,  estRevenue: 160, companies: ["Asana", "Linear", "Notion"],              priority: "next", status: "planning" },
  { id: "r7",  title: "Tax-loss harvesting assistant with end-of-year optimisation",                mentions: 16,  customers: 14,  estRevenue: 70,  companies: ["Spotify", "Stripe", "Miro", "Slack"],     priority: "next", status: "planning" },
  { id: "r8",  title: "Open Banking API integration for third-party account aggregation",           mentions: 16,  customers: 18,  estRevenue: 80,  companies: ["ZenDesk", "Jira", "Atlassian"],           priority: "next", status: "planning" },
  { id: "r9",  title: "Push notification engine for price alerts and goal milestones",              mentions: 10,  customers: 8,   estRevenue: 35,  companies: ["Asana", "Linear", "Google"],              priority: "next", status: "planning" },
  // Up next — on the horizon
  { id: "r11", title: "Fraud detection model v2 — anomaly scoring for high-value transfers",       mentions: 23,  customers: 19,  estRevenue: 85,  companies: ["Apple", "Google", "ZenDesk"],             priority: "later", status: "planning" },
  // Done — shipped
  { id: "r12", title: "Dark mode across web and mobile apps",                                       mentions: 6,   customers: 5,   estRevenue: 0,   companies: ["Apple", "Google", "Notion", "Atlassian", "Jira"], priority: "now", status: "done" },
  { id: "r13", title: "Accessibility audit and WCAG 2.2 AA compliance across all flows",           mentions: 10,  customers: 11,  estRevenue: 50,  companies: ["Notion", "Asana"],                        priority: "now", status: "done" },
  { id: "r14", title: "Financial literacy hub with interactive learning modules",                   mentions: 12,  customers: 9,   estRevenue: 45,  companies: ["Figma", "Airbnb", "Shopify", "Linear"],   priority: "now", status: "done" },
]

/* ─── Mock data for Roadmap Sidekick flows ─── */

export const companyARR: Record<string, { company: string; arr: number; contacts: number }[]> = {
  r1: [
    { company: "Figma", arr: 180, contacts: 42 },
    { company: "Airbnb", arr: 120, contacts: 38 },
    { company: "Stripe", arr: 85, contacts: 31 },
    { company: "Notion", arr: 40, contacts: 23 },
  ],
  r2: [
    { company: "Spotify", arr: 160, contacts: 35 },
    { company: "Stripe", arr: 110, contacts: 28 },
    { company: "Linear", arr: 70, contacts: 34 },
  ],
  r3: [
    { company: "Dropbox", arr: 95, contacts: 30 },
    { company: "ZenDesk", arr: 80, contacts: 27 },
    { company: "Asana", arr: 60, contacts: 32 },
  ],
  r4: [
    { company: "Atlassian", arr: 150, contacts: 40 },
    { company: "Notion", arr: 140, contacts: 38 },
    { company: "Miro", arr: 100, contacts: 34 },
  ],
  r5: [
    { company: "Shopify", arr: 110, contacts: 25 },
    { company: "Figma", arr: 90, contacts: 22 },
    { company: "Linear", arr: 50, contacts: 24 },
  ],
  r6: [
    { company: "Asana", arr: 70, contacts: 14 },
    { company: "Linear", arr: 55, contacts: 12 },
    { company: "Notion", arr: 35, contacts: 12 },
  ],
  r7: [
    { company: "Spotify", arr: 30, contacts: 5 },
    { company: "Stripe", arr: 25, contacts: 4 },
    { company: "Miro", arr: 10, contacts: 3 },
    { company: "Slack", arr: 5, contacts: 2 },
  ],
  r8: [
    { company: "ZenDesk", arr: 40, contacts: 8 },
    { company: "Jira", arr: 25, contacts: 6 },
    { company: "Atlassian", arr: 15, contacts: 5 },
  ],
  r9: [
    { company: "Asana", arr: 15, contacts: 3 },
    { company: "Linear", arr: 10, contacts: 3 },
    { company: "Google", arr: 10, contacts: 2 },
  ],
  "6": [
    { company: "Apple", arr: 80, contacts: 18 },
    { company: "Google", arr: 60, contacts: 15 },
    { company: "Slack", arr: 30, contacts: 12 },
    { company: "Jira", arr: 20, contacts: 8 },
  ],
  r11: [
    { company: "ZenDesk", arr: 35, contacts: 7 },
    { company: "Jira", arr: 25, contacts: 6 },
    { company: "Atlassian", arr: 20, contacts: 5 },
  ],
  r12: [
    { company: "Figma", arr: 20, contacts: 3 },
    { company: "Airbnb", arr: 15, contacts: 3 },
    { company: "Shopify", arr: 10, contacts: 3 },
  ],
  r13: [
    { company: "Notion", arr: 30, contacts: 6 },
    { company: "Asana", arr: 20, contacts: 5 },
  ],
  r14: [
    { company: "Figma", arr: 20, contacts: 4 },
    { company: "Airbnb", arr: 15, contacts: 3 },
    { company: "Linear", arr: 10, contacts: 2 },
  ],
}

export const customerQuotes: Record<string, { company: string; quote: string; role: string }[]> = {
  r2: [
    { company: "Spotify", quote: "Our team has been requesting real-time transaction categorisation using ML classification for several quarters. Automatically tag every transaction with a spending category.", role: "Sarah Kim, VP of Product" },
    { company: "Stripe", quote: "Manual tagging is costing us 12 hours a week. We need this automated yesterday.", role: "Dave Chen, Engineering Lead" },
  ],
  r4: [
    { company: "Atlassian", quote: "We need multi-currency for our APAC expansion. Our treasury team is blocked.", role: "James Wright, CFO" },
    { company: "Notion", quote: "Customers in Europe keep asking why they can't pay in EUR. It's a churn risk.", role: "Lisa Park, Head of Growth" },
    { company: "Miro", quote: "We're losing deals to competitors who support GBP and EUR natively.", role: "Tom Bauer, Sales Director" },
  ],
  r6: [
    { company: "Asana", quote: "Dollar-cost averaging is table stakes for any investment product. We're surprised it's not live yet.", role: "Nina Patel, Product Manager" },
  ],
  r8: [
    { company: "ZenDesk", quote: "We had two near-miss fraud events last quarter. The current detection is too slow for high-value transfers.", role: "Alex Morgan, Risk Lead" },
  ],
}

export const itemDependencies: { from: string; to: string; type: 'blocks' | 'depends-on' | 'related' }[] = [
  { from: "r2", to: "r3", type: "blocks" },        // categorisation blocks budgeting (budgeting needs categories)
  { from: "r1", to: "r5", type: "blocks" },         // portfolio advisor blocks savings rules (shared risk model)
  { from: "r4", to: "r6", type: "depends-on" },     // multi-currency needed for recurring investment plans
  { from: "r2", to: "r5", type: "related" },         // categorisation related to savings rules
  { from: "r8", to: "r11", type: "related" },        // fraud detection related to open banking (external data)
  { from: "r8", to: "r4", type: "related" },         // fraud detection related to multi-currency (FX risk)
  { from: "r3", to: "r7", type: "depends-on" },      // budgeting insights feed into tax-loss harvesting
]

/* ─── Demand trends (for UC1 ranking + UC5 drift detection) ─── */

export interface DemandTrend {
  itemId: string
  direction: 'growing' | 'stable' | 'declining'
  mentionsDelta: number      // change in mentions over last 30 days
  lastMentionDate: string    // ISO date
}

export const demandTrend: DemandTrend[] = [
  // Roadmap items
  { itemId: "r1",  direction: "growing",   mentionsDelta: +22,  lastMentionDate: "2026-03-28" },
  { itemId: "r2",  direction: "stable",    mentionsDelta: +3,   lastMentionDate: "2026-03-30" },
  { itemId: "r3",  direction: "stable",    mentionsDelta: +1,   lastMentionDate: "2026-03-25" },
  { itemId: "r4",  direction: "growing",   mentionsDelta: +18,  lastMentionDate: "2026-03-29" },
  { itemId: "r5",  direction: "declining", mentionsDelta: -8,   lastMentionDate: "2026-02-28" },
  { itemId: "r6",  direction: "stable",    mentionsDelta: +2,   lastMentionDate: "2026-03-20" },
  { itemId: "r7",  direction: "declining", mentionsDelta: -4,   lastMentionDate: "2026-02-15" },
  { itemId: "r8",  direction: "growing",   mentionsDelta: +8,   lastMentionDate: "2026-03-27" },
  { itemId: "r9",  direction: "declining", mentionsDelta: -6,   lastMentionDate: "2026-02-10" },
  // r10 removed from roadmap — Natural language search is now backlog-only (id: "6")

  { itemId: "r11", direction: "growing",   mentionsDelta: +5,   lastMentionDate: "2026-03-26" },
  { itemId: "r12", direction: "stable",    mentionsDelta: 0,    lastMentionDate: "2026-03-10" },
  { itemId: "r13", direction: "stable",    mentionsDelta: +1,   lastMentionDate: "2026-03-05" },
  { itemId: "r14", direction: "stable",    mentionsDelta: 0,    lastMentionDate: "2026-02-20" },
  // Backlog items (using sampleData IDs)
  { itemId: "1",   direction: "growing",   mentionsDelta: +22,  lastMentionDate: "2026-03-28" },
  { itemId: "2",   direction: "stable",    mentionsDelta: +3,   lastMentionDate: "2026-03-30" },
  { itemId: "3",   direction: "stable",    mentionsDelta: +1,   lastMentionDate: "2026-03-25" },
  { itemId: "4",   direction: "growing",   mentionsDelta: +18,  lastMentionDate: "2026-03-29" },
  { itemId: "5",   direction: "declining", mentionsDelta: -8,   lastMentionDate: "2026-02-28" },
  { itemId: "6",   direction: "growing",   mentionsDelta: +15,  lastMentionDate: "2026-03-30" },
  { itemId: "7",   direction: "stable",    mentionsDelta: +2,   lastMentionDate: "2026-03-20" },
  { itemId: "8",   direction: "growing",   mentionsDelta: +8,   lastMentionDate: "2026-03-27" },
  { itemId: "9",   direction: "declining", mentionsDelta: -6,   lastMentionDate: "2026-02-10" },
  { itemId: "10",  direction: "declining", mentionsDelta: -4,   lastMentionDate: "2026-02-15" },
  { itemId: "11",  direction: "growing",   mentionsDelta: +5,   lastMentionDate: "2026-03-26" },
  { itemId: "12",  direction: "stable",    mentionsDelta: 0,    lastMentionDate: "2026-02-20" },
  { itemId: "13",  direction: "stable",    mentionsDelta: +1,   lastMentionDate: "2026-03-05" },
  { itemId: "14",  direction: "declining", mentionsDelta: -3,   lastMentionDate: "2026-02-18" },
  { itemId: "15",  direction: "declining", mentionsDelta: -2,   lastMentionDate: "2026-01-30" },
  { itemId: "16",  direction: "stable",    mentionsDelta: 0,    lastMentionDate: "2026-02-05" },
  { itemId: "17",  direction: "stable",    mentionsDelta: +1,   lastMentionDate: "2026-03-01" },
  { itemId: "18",  direction: "declining", mentionsDelta: -1,   lastMentionDate: "2026-02-12" },
]

/* ─── Item change history (for UC4 summaries + UC5 drift) ─── */

export interface ItemChange {
  date: string
  itemId: string
  changeType: 'priority-changed' | 'status-changed' | 'added' | 'removed' | 'scope-changed'
  from?: string
  to?: string
  reason?: string
}

export const itemHistory: ItemChange[] = [
  { date: "2026-03-28", itemId: "r4",  changeType: "priority-changed", from: "next", to: "now",       reason: "Multi-currency demand grew 40% — 18 new mentions from APAC accounts" },
  { date: "2026-03-25", itemId: "r12", changeType: "status-changed",   from: "in-progress", to: "done", reason: "Dark mode shipped to all platforms" },
  { date: "2026-03-22", itemId: "r5",  changeType: "priority-changed", from: "now", to: "next",       reason: "Automated savings demand declining — deprioritized to make room" },
  { date: "2026-03-20", itemId: "r8",  changeType: "status-changed",   from: "planning", to: "in-progress", reason: "Fraud detection v2 kicked off after two near-miss events at ZenDesk" },
  { date: "2026-03-18", itemId: "15",  changeType: "added",            to: "roadmap",                  reason: "Leadership mandate: crypto asset support for enterprise accounts" },
  { date: "2026-03-15", itemId: "r9",  changeType: "priority-changed", from: "next", to: "later",     reason: "Push notifications demand dropped — no new mentions since January" },
  { date: "2026-03-12", itemId: "r7",  changeType: "scope-changed",    from: "Full automation", to: "Advisory only", reason: "Tax-loss harvesting descoped to advisory after compliance review" },
  { date: "2026-03-10", itemId: "r13", changeType: "status-changed",   from: "planning", to: "done",  reason: "Accessibility audit completed across all flows" },
  { date: "2026-03-08", itemId: "r1",  changeType: "status-changed",   from: "planning", to: "in-progress", reason: "AI portfolio advisor started — strongest customer signal" },
  { date: "2026-03-05", itemId: "r11", changeType: "priority-changed", from: "later", to: "next",     reason: "Open Banking demand growing — 5 new enterprise mentions" },
  { date: "2026-03-01", itemId: "r14", changeType: "status-changed",   from: "in-progress", to: "done", reason: "Financial literacy hub shipped" },
  { date: "2026-02-25", itemId: "9",   changeType: "removed",          from: "backlog",                reason: "Social investing deprioritized — demand declining, only 21 mentions" },
  { date: "2026-02-20", itemId: "r3",  changeType: "scope-changed",    from: "Full forecasting engine", to: "Spending prediction MVP", reason: "Smart budgeting descoped to MVP to ship faster" },
  { date: "2026-02-18", itemId: "r6",  changeType: "priority-changed", from: "later", to: "next",     reason: "Recurring investment plans moved up after Asana feedback" },
  { date: "2026-02-15", itemId: "r2",  changeType: "status-changed",   from: "planning", to: "in-progress", reason: "Transaction categorisation started — ML model ready" },
]

/* ─── Expanded companyARR for remaining items ─── */
// (appended to existing companyARR above — add these programmatically or paste into the existing object)
