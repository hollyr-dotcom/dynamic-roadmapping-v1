import { IconHeart, IconFlag } from '@mirohq/design-system'
import type { SpaceRow } from '@spaces/shared'

function IconUserTickDown({ css: _css, ...props }: { css?: unknown; width?: number; height?: number }) {
  const size = (props as { width?: number }).width ?? 24
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: 0 }}>
      <circle cx="12" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 19c0-3.314 3.134-6 7-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 15l4 4M19 15l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export const CARD_STYLES = [
  { borderColor: '#D1F09F', Icon: IconHeart, stars: 3, date: 'Aug 02', source: 'App Store' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'Jul 18', source: 'Gong' },
  { borderColor: '#ffd4b2', Icon: IconUserTickDown, date: 'Jun 30', source: 'SurveyMonkey' },
  { borderColor: '#D1F09F', Icon: IconHeart, stars: 5, date: 'Jun 12', source: 'App Store' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'May 28', source: 'Play Store' },
  { borderColor: '#D1F09F', Icon: IconHeart, stars: 4, date: 'May 14', source: 'Gong' },
  { borderColor: '#ffd4b2', Icon: IconUserTickDown, date: 'Apr 29', source: 'SurveyMonkey' },
  { borderColor: '#D1F09F', Icon: IconHeart, stars: 5, date: 'Apr 11', source: 'Play Store' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'Mar 27', source: 'Gong' },
  { borderColor: '#D1F09F', Icon: IconHeart, stars: 2, date: 'Mar 10', source: 'App Store' },
  { borderColor: '#ffd4b2', Icon: IconUserTickDown, date: 'Feb 22', source: 'SurveyMonkey' },
  { borderColor: '#D1F09F', Icon: IconHeart, stars: 4, date: 'Feb 05', source: 'Play Store' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'Jan 20', source: 'Gong' },
  { borderColor: '#D1F09F', Icon: IconHeart, stars: 5, date: 'Jan 08', source: 'App Store' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'Dec 19', source: 'Play Store' },
]

export function generateFeedbackCards(row: SpaceRow) {
  const t = row.title
  const d = row.description ?? t

  const texts = [
    `Our team has been requesting ${t.toLowerCase()} for several quarters. ${d} This would directly reduce the manual overhead our finance team deals with every sprint.`,
    `"${t}" keeps coming up in our quarterly planning sessions. Without it, we're stuck maintaining brittle workarounds. Fixing this would unblock at least three downstream initiatives.`,
    `We've escalated this internally multiple times. ${d} The lack of this capability is one of the top reasons our power users are evaluating alternatives.`,
    `Positive early signal from our pilot group on ${t.toLowerCase()}. Users describe it as intuitive and well-scoped. A few noted edge cases around data freshness that would be worth addressing before GA.`,
    `This came up in our last exec review as a gap we need to close. ${d} Shipping this would meaningfully strengthen our renewal conversations this quarter.`,
    `We trialled ${t.toLowerCase()} with a subset of our enterprise accounts last month. The reception was genuinely enthusiastic — several customers flagged it as the most impactful update we've shipped this year.`,
    `${d} Our support team is fielding this question weekly. The workaround we've documented is fragile and regularly breaks after updates, creating ongoing noise for both customers and engineering.`,
    `I've been waiting for ${t.toLowerCase()} since we first onboarded. It fills a gap that's been blocking a whole category of workflows. When this ships, it'll be one of the first things I demo to new team members.`,
    `We raised ${t.toLowerCase()} in our last business review as a critical gap. Customers in our mid-market segment are particularly affected — two accounts have explicitly tied their renewal decision to progress here.`,
    `The concept is sound but the current implementation doesn't go far enough. ${d} We need finer-grained control before we can roll this out to our full user base without risking data integrity issues.`,
    `We've had three separate enterprise prospects mention ${t.toLowerCase()} during sales calls this quarter. It's consistently coming up as a competitive differentiator that we can't credibly respond to right now.`,
    `Rolled out ${t.toLowerCase()} to our power users last sprint and the feedback loop has been really positive. Usage is already higher than we expected at this stage — retention metrics are trending up meaningfully.`,
    `${d} This is the kind of foundational capability that unlocks a lot of downstream value. Without it, we're asking teams to do things manually that should be automated, which erodes trust in the platform over time.`,
    `Honestly, ${t.toLowerCase()} exceeded my expectations in the beta. It's fast, the UX is clean, and it integrates well with our existing setup. My main ask would be better documentation before the general rollout.`,
    `${d} We keep deprioritising this but the hidden cost is real. Every sprint we don't ship this, someone on our ops team is spending hours compensating. It's become a quiet tax on the whole organisation.`,
  ]

  const authors = [
    'Sarah Kim, VP of Product',
    'Marcus Osei, Head of Growth',
    'Priya Nair, Chief Product Officer',
    'Tom Hauser, Director of Product',
    'Lena Vogel, Product Lead',
    'James Whitfield, Senior PM',
    'Aiko Tanaka, Head of Customer Success',
    'David Reyes, Principal Product Manager',
    'Nina Patel, VP of Engineering',
    'Connor Walsh, Product Manager',
    'Mei Lin, Director of Partnerships',
    'Rafi Goldstein, Head of Product',
    'Simone Dubois, VP of Customer Experience',
    'Ben Okafor, Product Lead',
    'Tariq Hassan, Chief Operating Officer',
  ]

  const titles = [
    `Quarterly Demand for ${t}, Manual Overhead Persists`,
    `${t} Blocking Downstream Planning Initiatives`,
    `Churn Risk: Power Users Evaluating Alternatives`,
    `Positive Pilot Signal, Minor Data Freshness Gaps`,
    `Exec-Level Gap Affecting Renewal Pipeline`,
    `Enterprise Trial: Most Impactful Update of the Year`,
    `Fragile Workaround Creating Ongoing Support Noise`,
    `Onboarding Gap Blocking Entire Workflow Category`,
    `Mid-Market Renewals Tied to ${t} Progress`,
    `Implementation Depth Insufficient for Full Rollout`,
    `Competitive Gap Surfacing in Enterprise Sales Calls`,
    `Power User Adoption Exceeds Early Forecasts`,
    `Platform Trust Eroding Without ${t}`,
    `Beta Exceeded Expectations, Documentation Gaps Remain`,
    `Hidden Ops Tax Growing Every Sprint`,
  ]

  return CARD_STYLES.map((style, i) => ({
    ...style,
    title: titles[i],
    text: texts[i],
    author: authors[i],
    companies: row.companies.slice(0, 1),
  }))
}
