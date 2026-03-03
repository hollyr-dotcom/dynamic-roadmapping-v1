export interface SpaceRow {
  id: string
  title: string
  mentions: number
  customers: number
  estRevenue: number
  companies: string[]
}

export const sampleData: SpaceRow[] = [
  { id: "1",  title: "Visualize guest RSVPs and dietary needs with interactive charts",     mentions: 142, customers: 4853, estRevenue: 425, companies: ["AC", "BX", "CL", "DV"] },
  { id: "2",  title: "Effortlessly manage invitations with intuitive guest list tools",     mentions: 118, customers: 9873, estRevenue: 917, companies: ["FN", "GH", "HI", "JK"] },
  { id: "3",  title: "Create stunning invitation designs with seamless image integration",  mentions: 105, customers: 2957, estRevenue: 235, companies: ["LM", "NO", "PQ"] },
  { id: "4",  title: "Get personalized assistance planning your perfect party",             mentions: 98,  customers: 8532, estRevenue: 843, companies: ["RS", "TU", "VW", "XY"] },
  { id: "5",  title: "Discover party planning tips and inspiration in our blog",            mentions: 64,  customers: 6394, estRevenue: 629, companies: ["ZA", "BC", "DE"] },
  { id: "6",  title: "Easily request help with invitation design",                          mentions: 48,  customers: 7583, estRevenue: 748, companies: ["FG", "HI"] },
  { id: "7",  title: "Start planning your party with a clear event timeline",               mentions: 45,  customers: 3578, estRevenue: 317, companies: ["JK", "LM", "NO"] },
  { id: "8",  title: "Get invitation wording suggestions based on your event theme",        mentions: 23,  customers: 5789, estRevenue: 538, companies: ["PQ", "RS", "TU"] },
  { id: "9",  title: "Track RSVPs and guest details with integrated tables",                mentions: 21,  customers: 1039, estRevenue: 101, companies: ["VW", "XY"] },
  { id: "10", title: "Find the perfect party theme with our smart search feature",          mentions: 16,  customers: 9283, estRevenue: 921, companies: ["ZA", "BC", "DE", "FG"] },
  { id: "11", title: "Get notified about RSVPs and important event updates",                mentions: 16,  customers: 4759, estRevenue: 415, companies: ["HI", "JK"] },
  { id: "12", title: "Learn how to plan the perfect party with our guided tour",            mentions: 12,  customers: 8531, estRevenue: 823, companies: ["LM", "NO", "PQ", "RS"] },
  { id: "13", title: "Explore our learning center with resources on using kanban effectively", mentions: 10, customers: 2649, estRevenue: 214, companies: ["TU", "VW"] },
  { id: "14", title: "Enhance your experience with smart search capabilities across all your project spaces", mentions: 10, customers: 7582, estRevenue: 738, companies: ["XY", "ZA", "BC"] },
  { id: "15", title: "Shopping Cart — streamlined checkout flow for event supplies",        mentions: 8,   customers: 3214, estRevenue: 156, companies: ["DE"] },
  { id: "16", title: "Board-level analytics dashboard for event performance tracking",      mentions: 7,   customers: 5621, estRevenue: 490, companies: ["FG", "HI", "JK"] },
  { id: "17", title: "Dark mode for web and desktop planning interfaces",                   mentions: 6,   customers: 1847, estRevenue: 0,   companies: ["LM", "NO", "PQ", "RS", "TU"] },
  { id: "18", title: "Swimlane auto-arrange by priority for event task boards",             mentions: 5,   customers: 982,  estRevenue: 130, companies: ["VW", "XY"] },
]
