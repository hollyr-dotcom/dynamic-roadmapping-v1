import type { Priority, Status } from './types.ts'

export interface SpaceRow {
  id: string
  title: string
  description?: string
  mentions: number
  customers: number
  estRevenue: number
  companies: string[]
  priority: Priority
  status?: Status
}

export const sampleData: SpaceRow[] = [
  { id: "1",  title: "AI portfolio advisor with personalized risk-adjusted recommendations",       description: "Use ML models to generate tailored portfolio suggestions based on user risk profile and market data.",        mentions: 142, customers: 4853, estRevenue: 425, companies: ["Figma", "Airbnb", "Stripe", "Notion"], priority: "now" },
  { id: "2",  title: "Real-time transaction categorisation using ML classification",               description: "Automatically tag every transaction with a spending category using a trained classification model.",         mentions: 118, customers: 9873, estRevenue: 917, companies: ["Spotify", "Stripe", "Linear"], priority: "now" },
  { id: "3",  title: "Smart budgeting engine with predictive spending forecasts",                  description: "Analyse past spending to predict future expenses and surface proactive budget recommendations.",              mentions: 105, customers: 2957, estRevenue: 235, companies: ["Dropbox", "ZenDesk", "Asana"], priority: "now" },
  { id: "4",  title: "Multi-currency wallet with instant FX conversion",                           description: "Let users hold and convert between currencies in real time at competitive exchange rates.",                  mentions: 98,  customers: 8532, estRevenue: 843, companies: ["Atlassian", "Notion", "Miro"], priority: "now" },
  { id: "5",  title: "Automated savings rules based on spending pattern analysis",                 description: "Trigger automatic transfers to savings when predefined spending thresholds or patterns are detected.",        mentions: 64,  customers: 6394, estRevenue: 629, companies: ["Shopify", "Figma", "Linear"], priority: "now" },
  { id: "6",  title: "Natural language search across transactions and accounts",                   description: "Allow users to query their financial history in plain English, e.g. 'coffee last month'.",                   mentions: 48,  customers: 7583, estRevenue: 748, companies: ["Apple", "Google", "Slack", "Jira"], priority: "now" },
  { id: "7",  title: "Recurring investment plans with dollar-cost averaging automation",           description: "Enable scheduled investments into chosen assets to smooth out market volatility over time.",                  mentions: 45,  customers: 3578, estRevenue: 317, companies: ["Asana", "Linear", "Notion"], priority: "next" },
  { id: "8",  title: "Fraud detection model v2 — anomaly scoring for high-value transfers",       description: "Upgrade the fraud pipeline with real-time anomaly scores to flag suspicious large transactions.",             mentions: 23,  customers: 5789, estRevenue: 538, companies: ["Apple", "Google", "ZenDesk"], priority: "triage" },
  { id: "9",  title: "Social investing — follow and mirror portfolios from top performers",        description: "Let users discover and copy-trade verified high-performing investor portfolios.",                             mentions: 21,  customers: 1039, estRevenue: 101, companies: ["Dropbox", "ZenDesk"], priority: "later" },
  { id: "10", title: "Tax-loss harvesting assistant with end-of-year optimisation",                description: "Identify opportunities to sell underperforming assets to offset capital gains before year end.",              mentions: 16,  customers: 9283, estRevenue: 921, companies: ["Spotify", "Stripe", "Miro", "Slack"], priority: "later" },
  { id: "11", title: "Open Banking API integration for third-party account aggregation",           description: "Connect external bank accounts via Open Banking APIs to give users a unified financial view.",                mentions: 16,  customers: 4759, estRevenue: 415, companies: ["ZenDesk", "Jira", "Atlassian"], priority: "triage" },
  { id: "12", title: "Financial literacy hub with interactive learning modules",                   description: "Build an in-app learning centre with bite-sized lessons on investing, saving, and credit.",                  mentions: 12,  customers: 8531, estRevenue: 823, companies: ["Figma", "Airbnb", "Shopify", "Linear"], priority: "later" },
  { id: "13", title: "Accessibility audit and WCAG 2.2 AA compliance across all flows",           description: "Audit and remediate all user-facing flows to meet WCAG 2.2 AA accessibility standards.",                    mentions: 10,  customers: 2649, estRevenue: 214, companies: ["Notion", "Asana"], priority: "later" },
  { id: "14", title: "Push notification engine for price alerts and goal milestones",              description: "Deliver timely push alerts when assets hit target prices or savings goals are reached.",                     mentions: 10,  customers: 7582, estRevenue: 738, companies: ["Asana", "Linear", "Google"], priority: "triage" },
  { id: "15", title: "Crypto asset support — buy, hold, and track digital currencies",            description: "Add crypto to the portfolio: purchase, custody, and price tracking for major digital assets.",               mentions: 8,   customers: 3214, estRevenue: 156, companies: ["Stripe"], priority: "icebox" },
  { id: "16", title: "Advisor marketplace connecting users with certified financial planners",     description: "Surface a curated marketplace where users can book sessions with vetted financial advisors.",                mentions: 7,   customers: 5621, estRevenue: 490, companies: ["Figma", "Miro", "Slack"], priority: "icebox" },
  { id: "17", title: "Dark mode across web and mobile apps",                                       description: "Implement a system-aware dark theme across all surfaces for improved low-light usability.",                  mentions: 6,   customers: 1847, estRevenue: 0,   companies: ["Apple", "Google", "Notion", "Atlassian", "Jira"], priority: "icebox" },
  { id: "18", title: "Gamified savings challenges with achievement badges",                        description: "Motivate users to hit savings targets through streaks, challenges, and unlockable badge rewards.",           mentions: 5,   customers: 982,  estRevenue: 130, companies: ["Shopify", "Airbnb"], priority: "icebox" },
]

export const roadmapData: SpaceRow[] = [
  // Now — actively in progress
  { id: "r1",  title: "AI portfolio advisor with personalized risk-adjusted recommendations",       mentions: 142, customers: 4853, estRevenue: 425, companies: ["Figma", "Airbnb", "Stripe", "Notion"],   priority: "now", status: "in-progress" },
  { id: "r2",  title: "Real-time transaction categorisation using ML classification",               mentions: 118, customers: 9873, estRevenue: 917, companies: ["Spotify", "Stripe", "Linear"],            priority: "now", status: "in-progress" },
  { id: "r3",  title: "Smart budgeting engine with predictive spending forecasts",                  mentions: 105, customers: 2957, estRevenue: 235, companies: ["Dropbox", "ZenDesk", "Asana"],            priority: "now", status: "in-progress" },
  { id: "r4",  title: "Multi-currency wallet with instant FX conversion",                           mentions: 98,  customers: 8532, estRevenue: 843, companies: ["Atlassian", "Notion", "Miro"],            priority: "now", status: "planning" },
  { id: "r5",  title: "Automated savings rules based on spending pattern analysis",                 mentions: 64,  customers: 6394, estRevenue: 629, companies: ["Shopify", "Figma", "Linear"],             priority: "now", status: "in-progress" },
  // Next — planned, not started
  { id: "r6",  title: "Recurring investment plans with dollar-cost averaging automation",           mentions: 45,  customers: 3578, estRevenue: 317, companies: ["Asana", "Linear", "Notion"],              priority: "next", status: "planning" },
  { id: "r7",  title: "Tax-loss harvesting assistant with end-of-year optimisation",                mentions: 16,  customers: 9283, estRevenue: 921, companies: ["Spotify", "Stripe", "Miro", "Slack"],     priority: "next", status: "planning" },
  { id: "r8",  title: "Open Banking API integration for third-party account aggregation",           mentions: 16,  customers: 4759, estRevenue: 415, companies: ["ZenDesk", "Jira", "Atlassian"],           priority: "next", status: "planning" },
  { id: "r9",  title: "Push notification engine for price alerts and goal milestones",              mentions: 10,  customers: 7582, estRevenue: 738, companies: ["Asana", "Linear", "Google"],              priority: "next", status: "planning" },
  // Later — on the horizon
  { id: "r10", title: "Natural language search across transactions and accounts",                   mentions: 48,  customers: 7583, estRevenue: 748, companies: ["Apple", "Google", "Slack", "Jira"],       priority: "later", status: "planning" },
  { id: "r11", title: "Fraud detection model v2 — anomaly scoring for high-value transfers",       mentions: 23,  customers: 5789, estRevenue: 538, companies: ["Apple", "Google", "ZenDesk"],             priority: "later", status: "planning" },
  // Done — shipped
  { id: "r12", title: "Dark mode across web and mobile apps",                                       mentions: 6,   customers: 1847, estRevenue: 0,   companies: ["Apple", "Google", "Notion", "Atlassian", "Jira"], priority: "now", status: "done" },
  { id: "r13", title: "Accessibility audit and WCAG 2.2 AA compliance across all flows",           mentions: 10,  customers: 2649, estRevenue: 214, companies: ["Notion", "Asana"],                        priority: "now", status: "done" },
  { id: "r14", title: "Financial literacy hub with interactive learning modules",                   mentions: 12,  customers: 8531, estRevenue: 823, companies: ["Figma", "Airbnb", "Shopify", "Linear"],   priority: "now", status: "done" },
]
