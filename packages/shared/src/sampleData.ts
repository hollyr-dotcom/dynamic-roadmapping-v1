import type { Priority, Status } from './types.ts'

export interface SpaceRow {
  id: string
  title: string
  mentions: number
  customers: number
  estRevenue: number
  companies: string[]
  priority: Priority
  status?: Status
}

export const sampleData: SpaceRow[] = [
  { id: "1",  title: "AI portfolio advisor with personalized risk-adjusted recommendations",       mentions: 142, customers: 4853, estRevenue: 425, companies: ["AC", "BX", "CL", "DV"], priority: "now" },
  { id: "2",  title: "Real-time transaction categorisation using ML classification",               mentions: 118, customers: 9873, estRevenue: 917, companies: ["FN", "GH", "HI", "JK"], priority: "now" },
  { id: "3",  title: "Smart budgeting engine with predictive spending forecasts",                  mentions: 105, customers: 2957, estRevenue: 235, companies: ["LM", "NO", "PQ"], priority: "now" },
  { id: "4",  title: "Multi-currency wallet with instant FX conversion",                           mentions: 98,  customers: 8532, estRevenue: 843, companies: ["RS", "TU", "VW", "XY"], priority: "now" },
  { id: "5",  title: "Automated savings rules based on spending pattern analysis",                 mentions: 64,  customers: 6394, estRevenue: 629, companies: ["ZA", "BC", "DE"], priority: "now" },
  { id: "6",  title: "Natural language search across transactions and accounts",                   mentions: 48,  customers: 7583, estRevenue: 748, companies: ["FG", "HI"], priority: "now" },
  { id: "7",  title: "Recurring investment plans with dollar-cost averaging automation",           mentions: 45,  customers: 3578, estRevenue: 317, companies: ["JK", "LM", "NO"], priority: "next" },
  { id: "8",  title: "Fraud detection model v2 — anomaly scoring for high-value transfers",       mentions: 23,  customers: 5789, estRevenue: 538, companies: ["PQ", "RS", "TU"], priority: "triage" },
  { id: "9",  title: "Social investing — follow and mirror portfolios from top performers",        mentions: 21,  customers: 1039, estRevenue: 101, companies: ["VW", "XY"], priority: "later" },
  { id: "10", title: "Tax-loss harvesting assistant with end-of-year optimisation",                mentions: 16,  customers: 9283, estRevenue: 921, companies: ["ZA", "BC", "DE", "FG"], priority: "later" },
  { id: "11", title: "Open Banking API integration for third-party account aggregation",           mentions: 16,  customers: 4759, estRevenue: 415, companies: ["HI", "JK"], priority: "triage" },
  { id: "12", title: "Financial literacy hub with interactive learning modules",                   mentions: 12,  customers: 8531, estRevenue: 823, companies: ["LM", "NO", "PQ", "RS"], priority: "later" },
  { id: "13", title: "Accessibility audit and WCAG 2.2 AA compliance across all flows",           mentions: 10,  customers: 2649, estRevenue: 214, companies: ["TU", "VW"], priority: "later" },
  { id: "14", title: "Push notification engine for price alerts and goal milestones",              mentions: 10,  customers: 7582, estRevenue: 738, companies: ["XY", "ZA", "BC"], priority: "triage" },
  { id: "15", title: "Crypto asset support — buy, hold, and track digital currencies",            mentions: 8,   customers: 3214, estRevenue: 156, companies: ["DE"], priority: "icebox" },
  { id: "16", title: "Advisor marketplace connecting users with certified financial planners",     mentions: 7,   customers: 5621, estRevenue: 490, companies: ["FG", "HI", "JK"], priority: "icebox" },
  { id: "17", title: "Dark mode across web and mobile apps",                                       mentions: 6,   customers: 1847, estRevenue: 0,   companies: ["LM", "NO", "PQ", "RS", "TU"], priority: "icebox" },
  { id: "18", title: "Gamified savings challenges with achievement badges",                        mentions: 5,   customers: 982,  estRevenue: 130, companies: ["VW", "XY"], priority: "icebox" },
]

export const roadmapData: SpaceRow[] = [
  // Now — actively in progress
  { id: "r1",  title: "AI portfolio advisor with personalized risk-adjusted recommendations",       mentions: 142, customers: 4853, estRevenue: 425, companies: ["AC", "BX", "CL", "DV"], priority: "now", status: "in-progress" },
  { id: "r2",  title: "Real-time transaction categorisation using ML classification",               mentions: 118, customers: 9873, estRevenue: 917, companies: ["FN", "GH", "HI", "JK"], priority: "now", status: "in-progress" },
  { id: "r3",  title: "Smart budgeting engine with predictive spending forecasts",                  mentions: 105, customers: 2957, estRevenue: 235, companies: ["LM", "NO", "PQ"],       priority: "now", status: "in-progress" },
  { id: "r4",  title: "Multi-currency wallet with instant FX conversion",                           mentions: 98,  customers: 8532, estRevenue: 843, companies: ["RS", "TU", "VW", "XY"], priority: "now", status: "planning" },
  { id: "r5",  title: "Automated savings rules based on spending pattern analysis",                 mentions: 64,  customers: 6394, estRevenue: 629, companies: ["ZA", "BC", "DE"],       priority: "now", status: "in-progress" },
  // Next — planned, not started
  { id: "r6",  title: "Recurring investment plans with dollar-cost averaging automation",           mentions: 45,  customers: 3578, estRevenue: 317, companies: ["JK", "LM", "NO"],       priority: "next", status: "planning" },
  { id: "r7",  title: "Tax-loss harvesting assistant with end-of-year optimisation",                mentions: 16,  customers: 9283, estRevenue: 921, companies: ["ZA", "BC", "DE", "FG"], priority: "next", status: "planning" },
  { id: "r8",  title: "Open Banking API integration for third-party account aggregation",           mentions: 16,  customers: 4759, estRevenue: 415, companies: ["HI", "JK"],             priority: "next", status: "planning" },
  { id: "r9",  title: "Push notification engine for price alerts and goal milestones",              mentions: 10,  customers: 7582, estRevenue: 738, companies: ["XY", "ZA", "BC"],       priority: "next", status: "planning" },
  // Later — on the horizon
  { id: "r10", title: "Natural language search across transactions and accounts",                   mentions: 48,  customers: 7583, estRevenue: 748, companies: ["FG", "HI"],             priority: "later", status: "planning" },
  { id: "r11", title: "Fraud detection model v2 — anomaly scoring for high-value transfers",       mentions: 23,  customers: 5789, estRevenue: 538, companies: ["PQ", "RS", "TU"],       priority: "later", status: "planning" },
  // Done — shipped
  { id: "r12", title: "Dark mode across web and mobile apps",                                       mentions: 6,   customers: 1847, estRevenue: 0,   companies: ["LM", "NO", "PQ", "RS", "TU"], priority: "now", status: "done" },
  { id: "r13", title: "Accessibility audit and WCAG 2.2 AA compliance across all flows",           mentions: 10,  customers: 2649, estRevenue: 214, companies: ["TU", "VW"],             priority: "now", status: "done" },
  { id: "r14", title: "Financial literacy hub with interactive learning modules",                   mentions: 12,  customers: 8531, estRevenue: 823, companies: ["LM", "NO", "PQ", "RS"], priority: "now", status: "done" },
]
