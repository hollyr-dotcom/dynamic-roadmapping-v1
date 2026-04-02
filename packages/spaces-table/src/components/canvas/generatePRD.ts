import type { SpaceRow } from '@spaces/shared'

export interface DocumentContent {
  title: string
  sections: { heading: string; body: string }[]
  links: { label: string; url: string }[]
}

const PRIORITY_LABELS: Record<string, string> = {
  now: 'P0 — Immediate',
  triage: 'P1 — Triage',
  next: 'P2 — Prioritised',
  later: 'P3 — Up next',
  icebox: 'P4 — Watching',
}

export function generatePRD(row: SpaceRow, prompt: string): DocumentContent {
  const priority = PRIORITY_LABELS[row.priority] || row.priority
  const revenue = row.estRevenue > 0 ? `$${row.estRevenue}K` : 'TBD'
  const companiesList = row.companies.length > 0 ? row.companies.join(', ') : 'Multiple enterprise accounts'
  const jiraRef = row.jiraKey ? `${row.jiraKey}` : 'N/A'

  return {
    title: row.title,
    sections: [
      {
        heading: 'Overview',
        body: `This PRD outlines the product requirements for "${row.title}". The initiative is classified as ${priority} and is driven by demand from ${row.customers} customers across ${row.companies.length} key accounts including ${companiesList}.\n\nThe feature has been referenced ${row.mentions} times in customer conversations and internal discussions, signalling strong alignment with current market needs. Estimated revenue impact is ${revenue} ARR.`,
      },
      {
        heading: 'Goals & Objectives',
        body: `1. Deliver a production-ready implementation that addresses the core customer need identified in ${jiraRef}\n2. Increase platform engagement for the ${row.companies.length} accounts that have requested this capability\n3. Capture ${revenue} in incremental ARR within the first two quarters post-launch\n4. Reduce support ticket volume related to workarounds by 40%\n5. Establish a reusable pattern for similar features in the product roadmap`,
      },
      {
        heading: 'User Stories',
        body: `• As a product manager, I want to ${row.title.toLowerCase()} so that my team can make data-driven decisions faster\n• As an analyst, I want to access real-time insights so I can respond to trends before competitors\n• As a team lead, I want to configure the feature for my org's workflow so adoption is seamless\n• As an executive sponsor, I want visibility into ROI metrics so I can justify continued investment`,
      },
      {
        heading: 'Success Metrics',
        body: `• Adoption: 60% of target accounts (${Math.round(row.customers * 0.6)} customers) active within 90 days\n• Revenue: ${revenue} ARR impact tracked via deal attribution\n• Engagement: 3x weekly active usage per enabled account\n• NPS: +15 point lift in feature-specific satisfaction scores\n• Support: 40% reduction in related support tickets within 60 days`,
      },
      {
        heading: 'Technical Requirements',
        body: `The implementation requires integration with the existing data pipeline and real-time event processing infrastructure. Key technical considerations:\n\n• API design: RESTful endpoints with GraphQL subscriptions for live updates\n• Data model: Extension of the current entity schema with backwards-compatible migrations\n• Performance: P95 response time under 200ms for primary query paths\n• Security: Row-level access control aligned with existing org permission model\n• Observability: Structured logging, distributed tracing, and alerting via existing Datadog stack`,
      },
      {
        heading: 'Timeline & Milestones',
        body: `Phase 1 — Discovery & Design (2 weeks)\n  • Stakeholder interviews with ${companiesList}\n  • Technical spike and architecture review\n  • Figma design explorations and review\n\nPhase 2 — Core Implementation (4 weeks)\n  • Backend API and data model\n  • Frontend components and integration\n  • Internal dogfooding\n\nPhase 3 — Beta & Launch (2 weeks)\n  • Private beta with 5 accounts\n  • Performance testing and optimisation\n  • GA release and enablement`,
      },
      {
        heading: 'Dependencies & Risks',
        body: `Dependencies:\n• Platform team — data pipeline capacity for real-time processing\n• Design system — new components required (estimated 1 sprint)\n• ${companiesList} — beta participation commitment\n\nRisks:\n• Data pipeline throughput may require scaling ahead of launch\n• Customer expectations set by ${row.mentions} conversation mentions may exceed initial scope\n• Timeline assumes no competing P0 interrupts during Phase 2`,
      },
    ],
    links: [
      { label: 'Figma designs', url: '#' },
      { label: `Jira epic (${jiraRef})`, url: '#' },
      { label: 'Technical architecture — Confluence', url: '#' },
      { label: '#proj-channel — Slack', url: '#' },
    ],
  }
}
