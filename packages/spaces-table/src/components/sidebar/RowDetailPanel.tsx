import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import type { SpaceRow } from '@spaces/shared'
import { CompanyLogo } from '../CompanyLogo'
import { SourceLogoChip } from './SourceLogoChip'
import { CallTranscriptPanel, type TranscriptLine } from './CallTranscriptPanel'
import {
  IconCross,
  IconDotsThreeVertical,
  IconWarning as _IconWarning,
  Chip,
  IconHeart,
  IconFlag,

  IconStarFilled,
  IconChevronDown,
  IconSlidersY,
  IconArrowLeft,
  IconOffice,
  IconLink,
  IconGlobe,
  IconArrowUp,
  IconSlidersX,
  IconStickyNote,
  IconChevronRight,
  IconDotsThree,
  IconInsights,
  IconBoard,
  IconSquaresTwoOverlap,
  IconDocFormat,
  IconSparksFilled,
  IconChevronLeft,
  IconMagnifyingGlass,
  Checkbox,
  IconStackedCircles as _IconStackedCircles,
  IconPlusBox as _IconPlusBox,
  IconUser as _IconUser,
  IconSmileyPlus,
  IconPaperPlaneFilledRight,
  IconSocialJira,
} from '@mirohq/design-system'

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

interface FeedbackCardData {
  title: string
  text: string
  author: string
  date: string
  companies: string[]
  borderColor: string
  stars?: number
  source?: string
}

interface RowDetailPanelProps {
  row: SpaceRow
  onClose: () => void
  initialCompany?: string
  onAddToBoard?: (data: FeedbackCardData) => void
  onRowUpdated?: (id: string) => void
  timelineDates?: { startDate: string; endDate: string }
  onCompanyFilter?: (name: string) => void
  activeCompanyFilter?: string[] | null
}

const PRIORITY_LABELS: Record<string, string> = {
  now:    'Now',
  next:   'Next',
  later:  'Later',
  triage: 'Triage',
  icebox: 'Icebox',
}

// Colors matched to KanbanBoard column tags
const PRIORITY_CHIP: Record<string, { bg: string; color: string }> = {
  triage: { bg: '#D1F09F', color: '#600000' },
  now:    { bg: '#b5ecff', color: '#003d54' },
  next:   { bg: '#ffc795', color: '#5c3200' },
  later:  { bg: '#d4bbff', color: '#2d0066' },
  icebox: { bg: '#dad8d8', color: '#222428' },
}

const TABS = ['Details', 'Insights', 'Comments', 'Jira']

const FEEDBACK_FILTER_SUB_OPTIONS: Record<string, string[]> = {
  'Company':   ['Spotify', 'Stripe', 'Linear', 'Atlassian', 'Notion', 'Shopify', 'Dropbox', 'Google', 'Apple'],
  'Source':    ['Survey', 'Interview', 'Support Ticket', 'NPS', 'Forum'],
  'Type':      ['Call', 'Ticket', 'Message', 'Other'],
  'User role': ['Admin', 'End User', 'Manager', 'Developer', 'Designer'],
}

const INSIGHT_SUMMARIES: Record<string, string> = {
  '1':  'Customer feedback strongly signals demand for personalised portfolio guidance, with 142 mentions across 134 accounts. Users report that generic recommendations erode trust and lead to disengagement — AI-driven risk-adjusted suggestions are cited as a key driver of retention and upsell potential, with an estimated $425K revenue impact.',
  'r1': 'Customer feedback strongly signals demand for personalised portfolio guidance, with 142 mentions across 134 accounts. Users report that generic recommendations erode trust and lead to disengagement — AI-driven risk-adjusted suggestions are cited as a key driver of retention and upsell potential, with an estimated $425K revenue impact.',
  '2':  'With 118 mentions from 97 customers, automatic transaction categorisation ranks among the highest-impact requests in the backlog. Feedback highlights frustration with manual tagging errors and time spent correcting misclassified entries. Delivering accurate ML-based categorisation is projected to drive $340K in retained and expanded revenue.',
  'r2': 'With 118 mentions from 97 customers, automatic transaction categorisation ranks among the highest-impact requests in the backlog. Feedback highlights frustration with manual tagging errors and time spent correcting misclassified entries. Delivering accurate ML-based categorisation is projected to drive $340K in retained and expanded revenue.',
  '3':  'Customers consistently raise the lack of forward-looking budget intelligence as a gap that limits their financial confidence. 105 mentions across 89 accounts point to a clear need for predictive spending forecasts. Teams at Dropbox and Asana have specifically flagged this as a blocker to broader adoption, representing $235K in at-risk revenue.',
  'r3': 'Customers consistently raise the lack of forward-looking budget intelligence as a gap that limits their financial confidence. 105 mentions across 89 accounts point to a clear need for predictive spending forecasts. Teams at Dropbox and Asana have specifically flagged this as a blocker to broader adoption, representing $235K in at-risk revenue.',
  '4':  'International customers report significant friction around currency management, with 98 mentions spanning 112 accounts. Feedback from Atlassian and Notion highlights that delayed FX conversion and hidden fees are the top reasons users switch to competitor products. Solving this unlocks an estimated $390K in expansion revenue.',
  'r4': 'International customers report significant friction around currency management, with 98 mentions spanning 112 accounts. Feedback from Atlassian and Notion highlights that delayed FX conversion and hidden fees are the top reasons users switch to competitor products. Solving this unlocks an estimated $390K in expansion revenue.',
  '5':  'Automated savings rules surface frequently in feedback from users who want the app to work proactively on their behalf. 64 mentions across 71 customers reflect strong interest in set-and-forget financial automation. Shopify and Linear accounts indicate this feature would directly influence renewal decisions, with $250K in projected impact.',
  'r5': 'Automated savings rules surface frequently in feedback from users who want the app to work proactively on their behalf. 64 mentions across 71 customers reflect strong interest in set-and-forget financial automation. Shopify and Linear accounts indicate this feature would directly influence renewal decisions, with $250K in projected impact.',
  '6':  'Natural language search is one of the most-requested power-user features, with 48 mentions across 53 accounts. Customers at Apple, Google, and Slack describe current search as a friction point that slows down reconciliation workflows. Enabling plain-English queries is estimated to contribute $190K in retained revenue by reducing churn among high-value users.',
  'r10': 'Natural language search is one of the most-requested power-user features, with 48 mentions across 53 accounts. Customers at Apple, Google, and Slack describe current search as a friction point that slows down reconciliation workflows. Enabling plain-English queries is estimated to contribute $190K in retained revenue by reducing churn among high-value users.',
  '7':  'Recurring investment automation is gaining traction with customers focused on long-term wealth building, appearing in 45 mentions across 38 accounts. Feedback from Asana and Linear teams points to dollar-cost averaging as a missing capability that drives users to third-party investment apps. Closing this gap is valued at $160K in incremental revenue.',
  'r6': 'Recurring investment automation is gaining traction with customers focused on long-term wealth building, appearing in 45 mentions across 38 accounts. Feedback from Asana and Linear teams points to dollar-cost averaging as a missing capability that drives users to third-party investment apps. Closing this gap is valued at $160K in incremental revenue.',
  '8':  'Fraud detection improvements are cited in 23 mentions from 19 accounts, with enterprise customers at Apple and Google raising concerns about high-value transfer risk. Feedback highlights that the current anomaly model generates too many false positives, eroding confidence. Upgrading to v2 scoring is tied to $85K in at-risk contracts pending security review.',
  'r11': 'Fraud detection improvements are cited in 23 mentions from 19 accounts, with enterprise customers at Apple and Google raising concerns about high-value transfer risk. Feedback highlights that the current anomaly model generates too many false positives, eroding confidence. Upgrading to v2 scoring is tied to $85K in at-risk contracts pending security review.',
  '9':  'Social investing features generate 21 mentions across 24 accounts, primarily from younger, engagement-driven users. Feedback centres on wanting to learn from top performers rather than rely solely on personal research. While the revenue impact ($100K) is modest, this feature is a key differentiator for driving organic growth and word-of-mouth referrals.',
  '10': 'Tax-loss harvesting is a niche but high-intent feature, with 16 mentions across 14 accounts. Enterprise customers at Spotify and Stripe have flagged the absence of end-of-year optimisation tools as a direct factor in delayed renewals. This feature disproportionately resonates with premium-tier users managing large portfolios, representing $70K in projected revenue.',
  'r7': 'Tax-loss harvesting is a niche but high-intent feature, with 16 mentions across 14 accounts. Enterprise customers at Spotify and Stripe have flagged the absence of end-of-year optimisation tools as a direct factor in delayed renewals. This feature disproportionately resonates with premium-tier users managing large portfolios, representing $70K in projected revenue.',
  '11': "Open Banking integration appears in 16 mentions from 18 accounts, particularly from users who manage finances across multiple institutions. Atlassian and Jira teams report that the inability to aggregate external accounts limits the app's utility as a single source of financial truth. API connectivity is estimated to unlock $80K in expansion opportunities.",
  'r8': "Open Banking integration appears in 16 mentions from 18 accounts, particularly from users who manage finances across multiple institutions. Atlassian and Jira teams report that the inability to aggregate external accounts limits the app's utility as a single source of financial truth. API connectivity is estimated to unlock $80K in expansion opportunities.",
  '12': 'The financial literacy hub surfaces in 12 mentions across 9 accounts, with feedback pointing to a gap between product capability and user confidence. Customers at Figma and Airbnb describe onboarding drop-off as closely tied to users not understanding core financial concepts. An in-app learning centre is projected to improve activation rates and contribute $45K in retained revenue.',
  'r14': 'The financial literacy hub surfaces in 12 mentions across 9 accounts, with feedback pointing to a gap between product capability and user confidence. Customers at Figma and Airbnb describe onboarding drop-off as closely tied to users not understanding core financial concepts. An in-app learning centre is projected to improve activation rates and contribute $45K in retained revenue.',
  '13': 'Accessibility gaps are flagged in 10 mentions across 11 accounts, often escalated by enterprise procurement and legal teams at Notion and Asana. Feedback indicates that non-compliance with WCAG 2.2 AA is a contractual blocker in several renewal negotiations. Resolving these issues is directly tied to $50K in contracts that are currently at risk.',
  'r13': 'Accessibility gaps are flagged in 10 mentions across 11 accounts, often escalated by enterprise procurement and legal teams at Notion and Asana. Feedback indicates that non-compliance with WCAG 2.2 AA is a contractual blocker in several renewal negotiations. Resolving these issues is directly tied to $50K in contracts that are currently at risk.',
  '14': 'Push notifications for price alerts appear in 10 mentions from 8 accounts, with strong signal from goal-oriented users at Asana and Google. Feedback highlights that without timely alerts, users miss key market moments and feel the app is passive rather than proactive. A well-executed notification engine is estimated to improve DAU by 18% and contribute $35K in retained revenue.',
  'r9': 'Push notifications for price alerts appear in 10 mentions from 8 accounts, with strong signal from goal-oriented users at Asana and Google. Feedback highlights that without timely alerts, users miss key market moments and feel the app is passive rather than proactive. A well-executed notification engine is estimated to improve DAU by 18% and contribute $35K in retained revenue.',
  '15': 'Crypto support generates 8 mentions across 6 accounts, primarily from digitally native users at Stripe. While feedback volume is low, sentiment is high-intensity — users who want crypto describe it as a dealbreaker for full adoption. The $25K revenue estimate is conservative; analyst feedback suggests crypto unlocks a new segment with 3–5x growth potential.',
  '16': 'The advisor marketplace is mentioned across 9 customer accounts, with demand coming from users who want personalised guidance beyond what the app provides autonomously. Figma and Slack teams describe this as a trust-building feature that would increase willingness to pay for premium tiers, representing $40K in estimated revenue impact.',
  '17': 'Dark mode surfaces in 6 mentions from 5 accounts — lower volume but consistent sentiment across Apple, Google, and Atlassian users. Feedback frames it as a quality-of-life expectation rather than a nice-to-have, with its absence noted as a signal of product immaturity. NPS data correlates dark mode delivery with a 12-point satisfaction improvement.',
  'r12': 'Dark mode surfaces in 6 mentions from 5 accounts — lower volume but consistent sentiment across Apple, Google, and Atlassian users. Feedback frames it as a quality-of-life expectation rather than a nice-to-have, with its absence noted as a signal of product immaturity. NPS data correlates dark mode delivery with a 12-point satisfaction improvement.',
  '18': 'Gamified savings challenges appear in 5 mentions from 7 accounts, driven by younger users at Shopify and Airbnb. Feedback describes the current savings experience as transactional and uninspiring — badges, streaks, and challenges are seen as motivators that could meaningfully improve goal completion rates, with $30K in projected revenue impact.',
}

// Per-card impact weights — must sum to 1.0
const CARD_WEIGHTS = [0.13, 0.12, 0.10, 0.09, 0.08, 0.08, 0.07, 0.07, 0.06, 0.05, 0.05, 0.04, 0.03, 0.02, 0.01]
const isStoreReview = (source?: string) => source === 'App Store' || source === 'Play Store'

const CARD_STYLES = [
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

// Transcripts for Gong-sourced cards (indices 1, 5, 8, 12 in CARD_STYLES)
const GONG_TRANSCRIPT_MAP: Record<number, TranscriptLine[]> = {
  1: [
    { speaker: 'Marcus Osei', timestamp: '00:01', text: 'This has come up every quarter for the past year. We keep pushing it to next cycle because something more urgent takes over — but the downstream cost is starting to compound in ways we can\'t ignore.', highlighted: true, section: 'box' },
    { speaker: 'Emma Clarke', timestamp: '00:03', text: 'Which initiatives are directly blocked right now?', section: 'box' },
    { speaker: 'Marcus Osei', timestamp: '00:05', text: 'At least three. Our growth attribution model, the new segmentation workflow, and the cross-team reporting layer. All of them are waiting on this being in place.', section: 'box' },
    { speaker: 'Emma Clarke', timestamp: '00:07', text: 'And what does the current workaround look like?', section: 'box' },
    { speaker: 'Marcus Osei', timestamp: '00:09', text: 'It\'s a manual export process we stitched together about eight months ago. It was never meant to be permanent. Every major update breaks it and we spend a day or two recovering.', section: 'box' },
    { speaker: 'Emma Clarke', timestamp: '00:11', text: 'That\'s a significant hidden cost.', section: 'dim' },
    { speaker: 'Marcus Osei', timestamp: '00:12', text: 'It\'s quiet, but it adds up. I\'ve stopped tracking the hours — it\'s too demoralising.', section: 'dim' },
    { speaker: 'Emma Clarke', timestamp: '00:14', text: 'Understood. I\'ll make sure this is on the agenda for the next planning session.', section: 'dim' },
    { speaker: 'Gong AI', timestamp: '', text: 'How many teams are currently affected by the workaround?\nI\'d estimate four or five directly — more feel it indirectly.', section: 'bubble-operator', timeLabel: '3 days ago', botLabel: 'Bot・1 min' },
    { speaker: 'Marcus Osei', timestamp: '', text: 'How many teams are currently affected by the workaround?\nI\'d estimate four or five directly — more feel it indirectly.', section: 'bubble-user', timeLabel: '3 days ago' },
    { speaker: 'Gong AI', timestamp: '', text: 'Got it — I\'ve flagged this as high priority for the product review.\nThanks for the detail, Marcus.', section: 'bubble-operator', timeLabel: '3 days ago', botLabel: 'Bot・1 min' },
  ],
  5: [
    { speaker: 'James Whitfield', timestamp: '00:01', text: 'We ran the trial with about 35 enterprise accounts over four weeks. Honestly, the feedback was stronger than we anticipated — customers were sharing it internally before we\'d even asked for input.', highlighted: true, section: 'box' },
    { speaker: 'Sarah Kim', timestamp: '00:04', text: 'What were the standout themes in the feedback?', section: 'box' },
    { speaker: 'James Whitfield', timestamp: '00:05', text: 'Speed and reliability came up constantly. Several customers described it as the most impactful thing we\'d shipped all year. A few mentioned it unprompted in their QBRs.', section: 'box' },
    { speaker: 'Sarah Kim', timestamp: '00:07', text: 'Good signal. Any critical gaps before we commit to a GA date?', section: 'box' },
    { speaker: 'James Whitfield', timestamp: '00:09', text: 'One recurring edge case around data freshness when records are updated mid-session. It\'s reproducible — we\'ve documented the steps. Everything else looks solid.', section: 'dim' },
    { speaker: 'Sarah Kim', timestamp: '00:11', text: 'Let\'s get a deep-dive scheduled with the infra team before we lock in a date.', section: 'dim' },
    { speaker: 'Gong AI', timestamp: '', text: 'Can you share the trial feedback summary?\nHappy to — I\'ll drop the link in chat now.', section: 'bubble-operator', timeLabel: '2 days ago', botLabel: 'Bot・1 min' },
    { speaker: 'James Whitfield', timestamp: '', text: 'Can you share the trial feedback summary?\nHappy to — I\'ll drop the link in chat now.', section: 'bubble-user', timeLabel: '2 days ago' },
    { speaker: 'Gong AI', timestamp: '', text: 'Thanks — I\'ll share this with the team ahead of Thursday\'s review.\nGreat session.', section: 'bubble-operator', timeLabel: '2 days ago', botLabel: 'Bot・1 min' },
  ],
  8: [
    { speaker: 'Nina Patel', timestamp: '00:01', text: 'We raised this as a critical gap in last month\'s business review. It\'s moved beyond a feature request — two mid-market accounts have explicitly conditioned their renewals on seeing meaningful progress here.', highlighted: true, section: 'box' },
    { speaker: 'Rafi Goldstein', timestamp: '00:03', text: 'What\'s the combined ARR at risk?', section: 'box' },
    { speaker: 'Nina Patel', timestamp: '00:04', text: 'Around $280K. Both contracts are up for renewal in Q3, so the window is tighter than it looks.', section: 'box' },
    { speaker: 'Rafi Goldstein', timestamp: '00:06', text: 'We need to get ahead of this. I\'ll flag it for the planning session — it has to be front of queue.', section: 'box' },
    { speaker: 'Nina Patel', timestamp: '00:08', text: 'I appreciate it. I can send over the full account notes today — the renewal owners for both are already in the loop on our end.', section: 'dim' },
    { speaker: 'Rafi Goldstein', timestamp: '00:10', text: 'Please do. Let\'s set up a joint review before end of next week.', section: 'dim' },
    { speaker: 'Gong AI', timestamp: '', text: 'Should I flag these accounts as at-risk in the tracker?\nYes — both are Q3, please mark them at-risk and cc the account owners.', section: 'bubble-operator', timeLabel: '5 days ago', botLabel: 'Bot・1 min' },
    { speaker: 'Nina Patel', timestamp: '', text: 'Should I flag these accounts as at-risk in the tracker?\nYes — both are Q3, please mark them at-risk and cc the account owners.', section: 'bubble-user', timeLabel: '5 days ago' },
    { speaker: 'Gong AI', timestamp: '', text: 'Done — both accounts flagged and owners notified.\nLet me know if anything else needs actioning.', section: 'bubble-operator', timeLabel: '5 days ago', botLabel: 'Bot・1 min' },
  ],
  12: [
    { speaker: 'Rafi Goldstein', timestamp: '00:01', text: 'Without this in place, we\'re asking teams to do manually what should be automated. The trust erosion is gradual — but once teams start building their own workarounds, they stop believing the platform will ever catch up.', highlighted: true, section: 'box' },
    { speaker: 'Tom Hauser', timestamp: '00:03', text: 'How widespread is this across your organisation right now?', section: 'box' },
    { speaker: 'Rafi Goldstein', timestamp: '00:05', text: 'Our ops team alone is spending roughly four hours per sprint compensating for it. Multiply that across three product teams and it\'s a significant hidden tax every cycle.', section: 'box' },
    { speaker: 'Tom Hauser', timestamp: '00:07', text: 'That\'s meaningful at scale. What does your ideal timeline look like?', section: 'box' },
    { speaker: 'Rafi Goldstein', timestamp: '00:09', text: 'Before end of Q2. Every sprint we don\'t ship this, the technical debt compounds — and so does the trust debt. Those are harder to recover from.', section: 'dim' },
    { speaker: 'Tom Hauser', timestamp: '00:11', text: 'Noted. I\'ll get it in front of the right people at Thursday\'s prioritisation meeting.', section: 'dim' },
    { speaker: 'Gong AI', timestamp: '', text: 'Can you walk me through the manual steps your team is doing?\nHappy to — I can share our internal doc as well.', section: 'bubble-operator', timeLabel: '1 week ago', botLabel: 'Bot・1 min' },
    { speaker: 'Rafi Goldstein', timestamp: '', text: 'Can you walk me through the manual steps your team is doing?\nHappy to — I can share our internal doc as well.', section: 'bubble-user', timeLabel: '1 week ago' },
    { speaker: 'Gong AI', timestamp: '', text: 'Documentation added to the shared drive — really useful context.\nThanks for your time today, Rafi.', section: 'bubble-operator', timeLabel: '1 week ago', botLabel: 'Bot・1 min' },
  ],
}

function generateFeedbackCards(row: SpaceRow) {
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

export function RowDetailPanel({ row, onClose, initialCompany, onAddToBoard, onRowUpdated, timelineDates, onCompanyFilter, activeCompanyFilter: _activeCompanyFilter }: RowDetailPanelProps) {
  const [activeTab, setActiveTab] = useState('Details')
  const [insightDismissed, setInsightDismissed] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<string | null>(initialCompany ?? null)

  useEffect(() => {
    if (initialCompany) setSelectedCompany(initialCompany)
  }, [initialCompany])
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [selectedFeedbackCard, setSelectedFeedbackCard] = useState<{ title: string; text: string; author: string; date: string; companies: string[]; borderColor?: string; source?: string; stars?: number } | null>(null)
  const [callCard, setCallCard] = useState<{ title: string; author: string; company: string; date: string; transcript: TranscriptLine[]; borderColor?: string } | null>(null)
  const [dismissedCards, setDismissedCards] = useState<Set<number>>(new Set())
  const [promptCards, setPromptCards] = useState<Set<number>>(new Set())
  const [showToast, setShowToast] = useState(false)
  const [toastExiting, setToastExiting] = useState(false)
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [showFeedbackToast, setShowFeedbackToast] = useState(false)
  const [feedbackToastExiting, setFeedbackToastExiting] = useState(false)
  const [showFeedbackConfetti, setShowFeedbackConfetti] = useState(false)
  const [editingField, setEditingField] = useState<'title' | 'description' | null>(null)
  const [editValue, setEditValue] = useState('')
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([
    { name: 'Liam Johnson', time: 'Today, 12:30 PM', text: 'Adding rounded edges could create a friendlier look.', avatarImg: 10 },
    { name: 'Sarah Kim', time: 'Today, 11:14 AM', text: 'Agreed — also worth checking how this lands on mobile viewports.', avatarImg: 47 },
    { name: 'Marcus T.', time: 'Yesterday, 4:02 PM', text: 'Should we tie this to the existing design token for border radius?', avatarImg: 32 },
  ])
  const [resolved, setResolved] = useState(false)
  const commentsEndRef = useRef<HTMLDivElement>(null)
  const [savePhase, setSavePhase] = useState<'refreshing' | 'success' | null>(null)
  const [saveProgress, setSaveProgress] = useState(0)
  const [saveToastExiting, setSaveToastExiting] = useState(false)
  const [saveConfetti, setSaveConfetti] = useState(false)
  const [saveChangesCount, setSaveChangesCount] = useState(1)
  const savePhaseRef = useRef<'refreshing' | 'success' | null>(null)
  const [companiesExpanded, setCompaniesExpanded] = useState(false)

  const [feedbackFilterOpen, setFeedbackFilterOpen] = useState(false)
  const [feedbackFilterPos, setFeedbackFilterPos] = useState({ top: 0, left: 0 })
  const [feedbackFilterView, setFeedbackFilterView] = useState<string | null>(null)
  const [feedbackFilterSearch, setFeedbackFilterSearch] = useState('')
  const [feedbackFilterChecked, setFeedbackFilterChecked] = useState<Set<string>>(new Set())
  const feedbackFilterBtnRef = useRef<HTMLButtonElement>(null)
  const feedbackFilterDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!feedbackFilterOpen) return
    const handler = (e: MouseEvent) => {
      if (feedbackFilterBtnRef.current?.contains(e.target as Node)) return
      if (feedbackFilterDropdownRef.current?.contains(e.target as Node)) return
      setFeedbackFilterOpen(false)
      setFeedbackFilterView(null)
      setFeedbackFilterSearch('')
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [feedbackFilterOpen])

  const openFeedbackFilter = () => {
    if (feedbackFilterOpen) {
      setFeedbackFilterOpen(false)
      setFeedbackFilterView(null)
      setFeedbackFilterSearch('')
      return
    }
    const rect = feedbackFilterBtnRef.current?.getBoundingClientRect()
    if (rect) setFeedbackFilterPos({ top: rect.bottom + 4, left: rect.left - 160 })
    setFeedbackFilterOpen(true)
  }

  const dismissToast = () => {
    setToastExiting(true)
    setTimeout(() => { setShowToast(false); setToastExiting(false) }, 300)
  }

  const dismissFeedbackToast = () => {
    setFeedbackToastExiting(true)
    setTimeout(() => { setShowFeedbackToast(false); setFeedbackToastExiting(false) }, 300)
  }

  const dismissSaveToast = () => {
    setSaveToastExiting(true)
    setTimeout(() => { savePhaseRef.current = null; setSavePhase(null); setSaveToastExiting(false); setSaveConfetti(false); setInsightDismissed(true) }, 300)
  }

  const triggerSaveToast = () => {
    onRowUpdated?.(row.id)
    setSaveChangesCount(prev => savePhaseRef.current === 'refreshing' ? prev + 1 : 1)
    savePhaseRef.current = 'refreshing'
    setSaveToastExiting(false)
    setSaveProgress(0)
    setSavePhase('refreshing')
    // Kick off progress bar animation on next frame
    requestAnimationFrame(() => requestAnimationFrame(() => setSaveProgress(100)))
    // After 5s switch to success + confetti
    setTimeout(() => {
      savePhaseRef.current = 'success'
      setSavePhase('success')
      setSaveConfetti(true)
      setTimeout(() => setSaveConfetti(false), 2200)
    }, 5000)
    // Auto-dismiss after 8s total
    setTimeout(() => dismissSaveToast(), 8000)
  }

  const handleDismissCard = (index: number) => {
    setPromptCards(prev => new Set([...prev, index]))
    setToastExiting(false)
    setShowToast(true)
    if (toastTimer) clearTimeout(toastTimer)
    const t = setTimeout(() => dismissToast(), 2000)
    setToastTimer(t)
  }

  const handlePromptClose = (index: number) => {
    setPromptCards(prev => { const s = new Set(prev); s.delete(index); return s })
    setDismissedCards(prev => new Set([...prev, index]))
  }

  const handlePromptSubmit = (index: number) => {
    handlePromptClose(index)
    setShowFeedbackToast(true)
    setShowFeedbackConfetti(true)
    setTimeout(() => setShowFeedbackConfetti(false), 2200)
    setTimeout(() => dismissFeedbackToast(), 2000)
  }

  const handleUndo = () => {
    setDismissedCards(prev => {
      const arr = [...prev]
      arr.pop()
      return new Set(arr)
    })
    setPromptCards(prev => {
      const arr = [...prev]
      arr.pop()
      return new Set(arr)
    })
    dismissToast()
  }


  const chip = PRIORITY_CHIP[row.priority] ?? PRIORITY_CHIP.icebox
  const priorityLabel = PRIORITY_LABELS[row.priority] ?? row.priority

  const remainingFraction = CARD_WEIGHTS.reduce((sum, w, i) => dismissedCards.has(i) ? sum : sum + w, 0)
  const adjMentions = Math.round(row.mentions * remainingFraction)
  const adjCustomers = Math.round(row.customers * remainingFraction)
  const adjRevenue = Math.round(row.estRevenue * remainingFraction)

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative" style={{ width: 476, fontFamily: 'Open Sans, sans-serif' }}>


      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 h-12 pl-4 pr-3 shrink-0 relative z-20 bg-white">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <IconSocialJira css={{ width: 18, height: 18, flexShrink: 0 }} />
          <p
            className="flex-1 min-w-0 truncate text-[#222428] leading-[1.5]"
            style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: '16px', fontFeatureSettings: "'ss01' 1" }}
            title={row.jiraKey ?? row.title}
          >
            {row.jiraKey ?? row.title}
          </p>
        </div>
        <div className="flex items-center shrink-0">
          <button
            aria-label="More options"
            className="w-6 h-6 flex items-center justify-center rounded text-[#656B81] hover:bg-[#F1F2F5] transition-colors"
          >
            <IconDotsThreeVertical css={{ width: 16, height: 16 }} />
          </button>
          <button aria-label="Close panel" className="w-6 h-6 flex items-center justify-center rounded text-[#656B81] hover:bg-[#F1F2F5] transition-colors" onClick={onClose}>
            <IconCross css={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* 4px spacer */}
      <div className="h-1 shrink-0" />

      {/* ── Tabs ────────────────────────────────────────── */}
      <div className="flex pl-3 pr-4 shrink-0 pb-5 pt-4 relative z-20 bg-white">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); if (selectedCompany) setSelectedCompany(null); if (selectedFeedbackCard) setSelectedFeedbackCard(null); if (callCard) setCallCard(null) }}
            className="mr-1 px-2 py-1 rounded-lg text-[14px] font-semibold transition-colors"
            style={{
              fontFamily: 'Open Sans, sans-serif',
              color: activeTab === tab ? '#4262FF' : '#656B81',
              backgroundColor: activeTab === tab ? '#F2F4FC' : 'transparent',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4px spacer */}
      <div className="h-1 shrink-0" />

      {/* ── Content (sliding panels) ─────────────────── */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
      <div
        className="flex absolute inset-y-0 left-0"
        style={{
          width: 1428,
          transform: (callCard || selectedFeedbackCard) ? 'translateX(-952px)' : selectedCompany ? 'translateX(-476px)' : 'translateX(0)',
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
      {/* ── Main panel ─── */}
      <div key={activeTab} className="h-full overflow-y-auto panel-scroll pl-4 pr-4 pt-2 flex flex-col gap-2 shrink-0 tab-slide-in" style={{ width: 476, overflowAnchor: 'none' }}>

        {activeTab === 'Details' && (
          <>
            {/* Title */}
            <FieldRow label="Title" alignStart>
              {editingField === 'title' ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => { setEditingField(null); triggerSaveToast() }}
                  onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditingField(null) }}
                  className="text-[14px] text-[#222428] leading-[1.4] w-full px-2 py-1 rounded-md outline-none bg-white"
                  style={{ border: '1.5px solid #4262FF', boxShadow: '0 0 0 3px rgba(66,98,255,0.12)' }}
                />
              ) : (
                <div
                  className="rounded px-2 py-1 w-full cursor-text hover:bg-[#F1F2F5] transition-colors"
                  onClick={() => { setEditingField('title'); setEditValue(row.title) }}
                >
                  <p className="text-[14px] text-[#222428] leading-[1.4]">{row.title}</p>
                </div>
              )}
            </FieldRow>

            {/* Description */}
            <FieldRow label="Description" alignStart>
              {editingField === 'description' ? (
                <textarea
                  autoFocus
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => { setEditingField(null); triggerSaveToast() }}
                  onKeyDown={e => { if (e.key === 'Escape') setEditingField(null) }}
                  className="text-[14px] text-[#222428] leading-[1.4] w-full px-2 py-1 rounded-md outline-none bg-white resize-none"
                  style={{ minHeight: 56, border: '1.5px solid #4262FF', boxShadow: '0 0 0 3px rgba(66,98,255,0.12)' }}
                />
              ) : (
                <div
                  className="rounded px-2 py-1 w-full cursor-text hover:bg-[#F1F2F5] transition-colors"
                  style={{ minHeight: 56 }}
                  onClick={() => { setEditingField('description'); setEditValue(row.description ?? '') }}
                >
                  <p className="text-[14px] text-[#222428] leading-[1.4]">{row.description ?? '—'}</p>
                </div>
              )}
            </FieldRow>

            {/* Status */}
            <FieldRow label="Status">
              <div
                className="inline-flex items-center rounded-[6px] px-2"
                style={{ backgroundColor: chip.bg, color: chip.color, height: 28 }}
              >
                <span className="text-[14px] leading-[20px]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {priorityLabel}
                </span>
              </div>
            </FieldRow>

            {/* Blocking */}
            <FieldRow label="Blocking">
              <span className="text-[14px] text-[#222428] leading-[1.4] px-2">—</span>
            </FieldRow>

            {/* Start / End dates (timeline only) */}
            {timelineDates && (
              <>
                <FieldRow label="Start date">
                  <span className="text-[14px] text-[#222428] leading-[1.4] px-2">{timelineDates.startDate}</span>
                </FieldRow>
                <FieldRow label="End date">
                  <span className="text-[14px] text-[#222428] leading-[1.4] px-2">{timelineDates.endDate}</span>
                </FieldRow>
              </>
            )}

            {/* Companies */}
            {(() => {
              const allCompanies = [...new Set([...row.companies, ...Object.keys(COMPANY_INFO)])]
              const MAX_VISIBLE = 4
              const overflow = allCompanies.length - MAX_VISIBLE
              return (
                <FieldRow label="Companies" alignStart>
                  <div className="flex flex-col gap-0 py-1 w-full">
                    <div className="flex flex-wrap gap-2">
                      {allCompanies.slice(0, MAX_VISIBLE).map(name => (
                        <CompanyLogo key={name} name={name} size={32} onClick={() => { setSelectedCompany(name); onCompanyFilter?.(name) }} />
                      ))}
                      {overflow > 0 && !companiesExpanded && (
                        <button
                          onClick={() => setCompaniesExpanded(true)}
                          className="inline-flex items-center h-[28px] px-2 rounded-lg text-[13px] font-semibold transition-colors"
                          style={{ backgroundColor: '#F1F2F5', color: '#656B81' }}
                        >
                          +{overflow}
                        </button>
                      )}
                    </div>
                    {/* Accordion overflow */}
                    <div style={{ maxHeight: companiesExpanded ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {allCompanies.slice(MAX_VISIBLE).map(name => (
                          <CompanyLogo key={name} name={name} size={32} onClick={() => { setSelectedCompany(name); onCompanyFilter?.(name) }} />
                        ))}
                        <button
                          onClick={() => setCompaniesExpanded(false)}
                          className="inline-flex items-center h-[28px] px-2 rounded-lg text-[13px] font-semibold transition-colors"
                          style={{ backgroundColor: '#E0E2E8', color: '#656B81' }}
                        >
                          −
                        </button>
                      </div>
                    </div>
                  </div>
                </FieldRow>
              )
            })()}

          </>
        )}

        {activeTab === 'Insights' && (
          <div className="flex flex-col gap-8 pb-6">

            {/* Low-confidence Insights callout — only for AI portfolio advisor row */}
            {!insightDismissed && (row.id === '1' || row.id === 'r1') && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  padding: 16,
                  gap: 12,
                  background: '#F2F4FC',
                  border: '1.5px solid #C7D0FD',
                  borderRadius: 8,
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, paddingRight: 20 }}>
                  <p className="text-[14px] leading-[1.4]" style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1", color: '#1a1b1e', margin: 0 }}>
                    Low-confidence Insights
                  </p>
                  <p style={{ fontSize: 14, color: '#656B81', lineHeight: 1.5, margin: 0 }}>
                    The title or description may be too brief to reliably match to customer feedback. Improving context will increase matching accuracy.
                  </p>
                </div>
              </div>
            )}

            {/* Summary */}
            <InsightSection label="Summary">
              <p className="text-[14px] text-[#222428] leading-[1.4]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                {INSIGHT_SUMMARIES[row.id] ?? row.description ?? row.title}
              </p>
            </InsightSection>

            {/* Top impacted customers */}
            <InsightSection label="Top impacted customers">
              <div className="flex flex-wrap gap-2 mt-2">
                {row.companies.map(name => (
                  <CompanyLogo key={name} name={name} size={32} onClick={() => { setSelectedCompany(name); onCompanyFilter?.(name) }} />
                ))}
              </div>
            </InsightSection>

            {/* Impact estimates */}
            <InsightSection label="Impact estimates">
              <div className="flex flex-col gap-0 w-full">
                <div className="flex gap-3">
                  <StatBox value={adjMentions} format={n => String(n)} label="Total Mentions" />
                  <StatBox value={adjCustomers} format={n => n.toLocaleString()} label="Unique Customers" />
                </div>
                <div className="flex gap-3">
                  <StatBox value={adjCustomers} format={n => n.toLocaleString()} label="Total Users" noPadding />
                  <StatBox value={adjRevenue} format={n => n > 0 ? `$${n}K` : '—'} label="Impacted Customer ARR" noPadding />
                </div>
              </div>
            </InsightSection>

            {/* Feedback */}
            <div className="flex flex-col gap-3">
              {/* Feedback header row */}
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#222428] leading-[1]" style={{ fontFamily: "'Roobert PRO', sans-serif", fontFeatureSettings: "'ss01' 1" }}>
                  Feedback
                </span>
                <div className="flex items-center gap-1">
                  <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[13px] text-[#222428] hover:bg-[#F1F2F5] transition-colors">
                    Relevance
                    <IconChevronDown size="small" />
                  </button>
                  <button
                    ref={feedbackFilterBtnRef}
                    onClick={openFeedbackFilter}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: '#222428' }}
                  >
                    <IconSlidersY size="small" />
                  </button>
                </div>
              </div>

              {/* Feedback cards */}
              <div style={{ overflowAnchor: 'none' }} className="flex flex-col">
                {generateFeedbackCards(row).map((card, i) => (
                  <div
                    key={i}
                    style={{
                      maxHeight: dismissedCards.has(i) ? 0 : 800,
                      opacity: dismissedCards.has(i) ? 0 : 1,
                      marginBottom: dismissedCards.has(i) ? 0 : 12,
                      overflow: 'hidden',
                      transition: 'max-height 0.35s ease, opacity 0.25s ease, margin-bottom 0.35s ease',
                    }}
                  >
                    {promptCards.has(i)
                      ? <FeedbackPrompt onSubmit={() => handlePromptSubmit(i)} onClose={() => handlePromptClose(i)} />
                      : <FeedbackCard {...card} onDismiss={() => handleDismissCard(i)} onSelect={() => { setSelectedFeedbackCard({ title: card.title, text: card.text, author: card.author, date: card.date, companies: card.companies, borderColor: card.borderColor, source: card.source, stars: card.stars }) }} onAddToBoard={() => onAddToBoard?.({ title: card.title, text: card.text, author: card.author, date: card.date, companies: card.companies, borderColor: card.borderColor, stars: card.stars })} onViewCall={GONG_TRANSCRIPT_MAP[i] ? () => setCallCard({ title: card.title, author: card.author, company: card.companies[0] ?? '', date: card.date, transcript: GONG_TRANSCRIPT_MAP[i], borderColor: card.borderColor }) : undefined} />
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Updates' && (
          <div className="flex flex-col">
            {[
              { text: 'Prioritized this signal as an idea', date: 'May 21, 2026' },
              { text: 'Updated customer count and mentions by 12% and 8%', date: 'May 21, 2026' },
              { text: 'Enriched your backlog with new signals', date: 'May 15, 2026' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-center pr-5" style={{ paddingTop: i === 0 ? 8 : 12, paddingBottom: 8 }}>
                <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F2F4FC' }}>
                  <IconSparksFilled css={{ width: 16, height: 16, color: '#4262FF' }} />
                </div>
                <p className="text-[14px] leading-[1.4] text-[#555A6A]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {item.text}
                  {' • '}
                  {item.date}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Comments' && (
          <div className="flex flex-col" style={{ minHeight: '100%' }}>
            {/* Resolve toggle */}
            <div className="flex items-center gap-2 px-2 pb-3">
              <button
                onClick={() => setResolved(r => !r)}
                className="relative shrink-0"
                style={{ width: 32, height: 18, borderRadius: 999, background: resolved ? '#4262FF' : '#E0E2E8', border: 'none', cursor: 'pointer', padding: 0, transition: 'background 150ms ease' }}
              >
                <span style={{ position: 'absolute', top: 2, left: resolved ? 16 : 2, width: 14, height: 14, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 150ms ease' }} />
              </button>
              <span className="text-[14px] text-[#222428]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Resolve</span>
            </div>

            {/* Comment list */}
            <div className="flex flex-col flex-1 px-2">
              {comments.map((comment, i) => (
                <div key={i} className="flex gap-[9px] items-start py-2">
                  <img
                    src={`https://i.pravatar.cc/48?img=${comment.avatarImg}`}
                    alt={comment.name}
                    className="shrink-0 w-6 h-6 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-[#050038] whitespace-nowrap" style={{ fontFamily: 'Open Sans, sans-serif' }}>{comment.name}</span>
                      <span className="text-[12px] text-[#656B81]" style={{ fontFamily: 'Open Sans, sans-serif' }}>{comment.time}</span>
                    </div>
                    <p className="text-[14px] text-[#222428] leading-[1.4] m-0" style={{ fontFamily: 'Open Sans, sans-serif' }}>{comment.text}</p>
                  </div>
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>

            {/* Compose box — sticky at bottom */}
            <div className="sticky bottom-0 bg-white pt-2 pb-4 px-0" style={{ marginTop: 'auto' }}>
              <div
                className="flex flex-col rounded-[6px] px-2 py-2"
                style={{ border: `1px solid ${commentText ? '#4262FF' : '#E0E2E8'}`, transition: 'border-color 150ms ease' }}
              >
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey && commentText.trim()) {
                      e.preventDefault()
                      const now = new Date()
                      const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                      setComments(prev => [...prev, { name: 'You', time: `Today, ${time}`, text: commentText.trim(), avatarImg: 1 }])
                      setCommentText('')
                      setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
                    }
                  }}
                  placeholder="Leave a comment. Use @ to mention."
                  rows={3}
                  className="w-full resize-none text-[14px] text-[#222428] leading-[1.4] px-2 outline-none bg-transparent placeholder-[#7D8297]"
                  style={{ fontFamily: 'Open Sans, sans-serif', border: 'none', minHeight: 60 }}
                />
                <div className="flex items-center justify-end gap-1 pt-1">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg text-[#AEB2C0]" style={{ border: 'none', background: 'none', cursor: 'default' }}>
                    <IconSmileyPlus size="medium" />
                  </button>
                  <button
                    onClick={() => {
                      if (!commentText.trim()) return
                      const now = new Date()
                      const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                      setComments(prev => [...prev, { name: 'You', time: `Today, ${time}`, text: commentText.trim(), avatarImg: 1 }])
                      setCommentText('')
                      setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
                    style={{ border: 'none', background: 'none', color: commentText.trim() ? '#4262FF' : '#AEB2C0', cursor: commentText.trim() ? 'pointer' : 'default' }}
                  >
                    <IconPaperPlaneFilledRight size="medium" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Jira' && <JiraForm row={row} />}
      </div>
      {/* ── Company panel ─── */}
      <div className="h-full overflow-y-auto panel-scroll pl-4 pr-4 pt-3 flex flex-col shrink-0" style={{ width: 476 }}>
        {selectedCompany && (
          <CompanyDetailView
            company={selectedCompany}
            onBack={() => setSelectedCompany(null)}
            onPromptSelect={(prompt) => setSelectedPrompt(prompt)}
          />
        )}
      </div>
      {/* ── Detail panel (call transcript + all feedback card details) ─── */}
      <div className="h-full shrink-0" style={{ width: 476 }}>
        {callCard && (
          <CallTranscriptPanel
            author={callCard.author}
            company={callCard.company}
            date={callCard.date}
            transcript={callCard.transcript}
            onBack={() => setCallCard(null)}
            highlightColor={callCard.borderColor === '#d4bbff' ? '#EFEDFD' : callCard.borderColor === '#D1F09F' ? '#F1FECF' : '#f1f2f5'}
            avatarColor={callCard.borderColor}
          />
        )}
        {selectedFeedbackCard && isStoreReview(selectedFeedbackCard.source) && (
          <AppStoreReviewDetail
            card={selectedFeedbackCard}
            onBack={() => setSelectedFeedbackCard(null)}
            highlightColor={selectedFeedbackCard.borderColor === '#D1F09F' ? '#F1FECF' : selectedFeedbackCard.borderColor === '#d4bbff' ? '#EFEDFD' : '#f1f2f5'}
          />
        )}
        {selectedFeedbackCard?.source === 'SurveyMonkey' && (
          <SurveyFeedbackDetail
            card={selectedFeedbackCard}
            onBack={() => setSelectedFeedbackCard(null)}
            highlightColor={selectedFeedbackCard.borderColor === '#ffd4b2' ? '#FFEEDE' : '#f1f2f5'}
          />
        )}
        {selectedFeedbackCard && !isStoreReview(selectedFeedbackCard.source) && selectedFeedbackCard.source !== 'SurveyMonkey' && (
          <FeedbackCardDetailView
            card={selectedFeedbackCard}
            onBack={() => setSelectedFeedbackCard(null)}
            onClose={onClose}
            onAddToBoard={onAddToBoard}
            highlightColor={selectedFeedbackCard.borderColor === '#d4bbff' ? '#EFEDFD' : '#f1f2f5'}
          />
        )}
      </div>
      </div>{/* end slider */}
      </div>{/* end overflow wrapper */}

      {/* ── Chat overlay (full-panel, avoids slider height-shift glitch) ─── */}
      {selectedPrompt && (
        <div className="absolute inset-0 z-10 bg-white flex flex-col">
          <PromptChatView
            prompt={selectedPrompt}
            company={selectedCompany ?? ''}
            onBack={() => setSelectedPrompt(null)}
            onClose={onClose}
          />
        </div>
      )}
      {/* Toast — rendered via portal to escape panel's CSS transform */}
      {showToast && createPortal(
        <div
          className="fixed bottom-6 left-6 z-[9999] flex items-start gap-3 rounded-lg"
          style={{
            backgroundColor: '#2B2D33',
            boxShadow: '0px 6px 16px rgba(34,36,40,0.12), 0px 0px 8px rgba(34,36,40,0.06)',
            width: 280,
            padding: '16px 40px 16px 16px',
            animation: toastExiting ? 'toastSlideDownLeft 0.3s ease forwards' : 'toastSlideUpLeft 0.25s ease',
          }}
        >
          <div className="flex flex-col gap-0 flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[#FAFAFC] leading-[1.4] truncate" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>Feedback removed</p>
            <p className="text-[12px] text-[#C7CAD5] leading-[1.5]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>This will remove feedback from insights and impact metrics.</p>
            <div className="pt-3">
              <button onClick={handleUndo} className="text-[14px] text-[#FAFAFC] underline hover:opacity-80 transition-opacity">Undo</button>
            </div>
          </div>
          <button
            onClick={() => dismissToast()}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded text-[#FAFAFC] hover:bg-white/10 transition-colors"
          >
            <IconCross css={{ width: 14, height: 14 }} />
          </button>
        </div>,
        document.body
      )}
      {/* Feedback received toast */}
      {showFeedbackToast && createPortal(
        <>
          {showFeedbackConfetti && (
            <div
              className="fixed pointer-events-none"
              style={{
                bottom: 0, left: 0,
                width: 520, height: 520,
                zIndex: 9998,
                animation: feedbackToastExiting ? 'toastSlideDownLeft 0.3s ease forwards' : undefined,
              }}
            >
              <DotLottieReact src="/confetti.json" autoplay loop={false} style={{ width: '100%', height: '100%' }} />
            </div>
          )}
          <div
            className="fixed bottom-6 left-6 z-[9999] flex items-start overflow-visible rounded-[8px]"
            style={{
              backgroundColor: '#2B2D33',
              boxShadow: '0px 6px 16px rgba(34,36,40,0.12), 0px 0px 8px rgba(34,36,40,0.06)',
              width: 340,
              padding: '16px 120px 16px 16px',
              animation: feedbackToastExiting ? 'toastSlideDownLeft 0.3s ease forwards' : 'toastSlideUpLeft 0.25s ease',
            }}
          >
            <div className="reaction-pop absolute pointer-events-none" style={{ top: -84, right: -44, zIndex: 1 }}>
              <img src="/amazing-reaction.png" alt="" style={{ width: 160, height: 160, pointerEvents: 'none' }} />
            </div>
            <div className="flex flex-col gap-0 flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#FAFAFC] leading-[1.4]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>Feedback received!</p>
              <p className="text-[12px] text-[#C7CAD5] leading-[1.5]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>We really appreciate your feedback.</p>
            </div>
            <button
              onClick={() => dismissFeedbackToast()}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded text-[#FAFAFC] hover:bg-white/10 transition-colors"
            >
              <IconCross css={{ width: 14, height: 14 }} />
            </button>
          </div>
        </>,
        document.body
      )}
      {/* Save toast — phase 1: refreshing, phase 2: success */}
      {savePhase && createPortal(
        <>
          {saveConfetti && (
            <div
              className="fixed pointer-events-none"
              style={{ bottom: 0, left: 0, width: 520, height: 520, zIndex: 9998,
                animation: saveToastExiting ? 'toastSlideDownLeft 0.3s ease forwards' : undefined }}
            >
              <DotLottieReact src="/confetti.json" autoplay loop={false} style={{ width: '100%', height: '100%' }} />
            </div>
          )}
          <div
            className="fixed bottom-6 left-6 z-[9999] flex items-start overflow-visible rounded-[8px]"
            style={{
              backgroundColor: '#2B2D33',
              boxShadow: '0px 6px 16px rgba(34,36,40,0.12), 0px 0px 8px rgba(34,36,40,0.06)',
              width: 280,
              padding: '16px 40px 16px 16px',
              animation: saveToastExiting ? 'toastSlideDownLeft 0.3s ease forwards' : 'toastSlideUpLeft 0.25s ease',
            }}
          >
            {savePhase === 'success' && (
              <div className="reaction-pop absolute pointer-events-none" style={{ top: -84, right: -44, zIndex: 1 }}>
                <img src="/amazing-reaction.png" alt="" style={{ width: 160, height: 160, pointerEvents: 'none' }} />
              </div>
            )}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#FAFAFC] leading-[1.4] truncate" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                {savePhase === 'refreshing' ? 'Refreshing...' : 'Refresh successful'}
              </p>
              {savePhase === 'refreshing' ? (
                <div className="w-full rounded-full overflow-hidden" style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.15)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${saveProgress}%`,
                      backgroundColor: '#4262FF',
                      transition: 'width 5s linear',
                    }}
                  />
                </div>
              ) : (
                <>
                  <p className="text-[12px] text-[#C7CAD5] leading-[1.5]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                    {saveChangesCount === 1 ? '1 insight has been updated' : `${saveChangesCount} insights have been updated`}
                  </p>
                  <button
                    onClick={() => dismissSaveToast()}
                    className="mt-1 px-3 py-1.5 rounded-lg text-[13px] font-semibold text-white self-start w-fit"
                    style={{ backgroundColor: '#4262FF' }}
                  >
                    View updates
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => dismissSaveToast()}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded text-[#FAFAFC] hover:bg-white/10 transition-colors"
            >
              <IconCross css={{ width: 14, height: 14 }} />
            </button>
          </div>
        </>,
        document.body
      )}

      {feedbackFilterOpen && createPortal(
        <div
          ref={feedbackFilterDropdownRef}
          className="fixed z-[9999] bg-white rounded-[8px] flex flex-col overflow-hidden"
          style={{
            top: feedbackFilterPos.top,
            left: feedbackFilterPos.left,
            width: 200,
            border: '0.5px solid #E9EAEF',
            boxShadow: '0px 0px 12px 0px rgba(34,36,40,0.04), 0px 2px 8px 0px rgba(34,36,40,0.12)',
            fontFamily: 'Open Sans, sans-serif',
          }}
        >
          {feedbackFilterView === null ? (
            <>
              <div className="px-3 py-[10px]">
                <p className="text-[14px] text-[#656B81] leading-[1.4]">Select filters</p>
              </div>
              <div className="mx-3 border-t border-[#E9EAEF]" />
              {['Company', 'Source', 'Type', 'User role'].map(label => (
                <button
                  key={label}
                  className="flex items-center justify-between px-3 h-10 hover:bg-[#F1F2F5] transition-colors w-full"
                  onClick={() => { setFeedbackFilterView(label); setFeedbackFilterSearch('') }}
                >
                  <span className="text-[14px] leading-[1.4] text-[#222428]">{label}</span>
                  <IconChevronRight css={{ width: 16, height: 16, color: '#656B81' }} />
                </button>
              ))}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 px-2 h-10 border-b border-[#E9EAEF] shrink-0">
                <button
                  onClick={() => { setFeedbackFilterView(null); setFeedbackFilterSearch('') }}
                  className="flex items-center justify-center w-6 h-6 rounded hover:bg-[#F1F2F5] shrink-0"
                >
                  <IconChevronLeft css={{ width: 14, height: 14, color: '#656B81' }} />
                </button>
                <span className="text-[14px] text-[#222428]">{feedbackFilterView}</span>
              </div>
              <div className="px-3 py-2 shrink-0">
                <input
                  value={feedbackFilterSearch}
                  onChange={e => setFeedbackFilterSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full text-[13px] text-[#222428] placeholder:text-[#AEB2C0] outline-none border border-[#E9EAEF] rounded-lg px-2 py-1"
                />
              </div>
              <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 200 }}>
                {(FEEDBACK_FILTER_SUB_OPTIONS[feedbackFilterView] ?? [])
                  .filter(opt => opt.toLowerCase().includes(feedbackFilterSearch.toLowerCase()))
                  .map(opt => (
                    <button
                      key={opt}
                      className="flex items-center gap-2 px-3 h-10 hover:bg-[#F1F2F5] transition-colors w-full text-left shrink-0"
                      onClick={() => setFeedbackFilterChecked(prev => {
                        const next = new Set(prev)
                        next.has(opt) ? next.delete(opt) : next.add(opt)
                        return next
                      })}
                    >
                      <Checkbox
                        checked={feedbackFilterChecked.has(opt)}
                        variant="solid-prominent"
                        size="small"
                      />
                      <span className="text-[14px] text-[#222428] truncate">{opt}</span>
                    </button>
                  ))}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}

const COMPANY_INFO: Record<string, { domain: string; stage: string; dealValue: string; source: string }> = {
  Figma:     { domain: 'figma.com',          stage: 'Enterprise', dealValue: '$85K',  source: 'Salesforce' },
  Airbnb:    { domain: 'airbnb.com',         stage: 'Enterprise', dealValue: '$120K', source: 'Salesforce' },
  Stripe:    { domain: 'stripe.com',         stage: 'Enterprise', dealValue: '$200K', source: 'Salesforce' },
  Notion:    { domain: 'notion.so',          stage: 'Growth',     dealValue: '$48K',  source: 'HubSpot' },
  Spotify:   { domain: 'spotify.com',        stage: 'Enterprise', dealValue: '$175K', source: 'Salesforce' },
  Linear:    { domain: 'linear.app',         stage: 'Growth',     dealValue: '$32K',  source: 'HubSpot' },
  Shopify:   { domain: 'shopify.com',        stage: 'Enterprise', dealValue: '$160K', source: 'Salesforce' },
  Dropbox:   { domain: 'dropbox.com',        stage: 'Enterprise', dealValue: '$95K',  source: 'Salesforce' },
  Atlassian: { domain: 'atlassian.com',      stage: 'Enterprise', dealValue: '$240K', source: 'Salesforce' },
  Miro:      { domain: 'miro.com',           stage: 'Enterprise', dealValue: '$110K', source: 'Salesforce' },
  Apple:     { domain: 'apple.com',          stage: 'Enterprise', dealValue: '$500K', source: 'Salesforce' },
  Google:    { domain: 'google.com',         stage: 'Enterprise', dealValue: '$500K', source: 'Salesforce' },
  Slack:     { domain: 'slack.com',          stage: 'Enterprise', dealValue: '$145K', source: 'Salesforce' },
  Asana:     { domain: 'asana.com',          stage: 'Growth',     dealValue: '$62K',  source: 'HubSpot' },
  ZenDesk:   { domain: 'zendesk.com',        stage: 'Enterprise', dealValue: '$88K',  source: 'Salesforce' },
  Jira:      { domain: 'jira.atlassian.com', stage: 'Enterprise', dealValue: '$240K', source: 'Salesforce' },
}

type AiItem = { title: string; stats: string; description: string }
type AiMessage = { role: 'user'; text: string } | { role: 'ai'; intro: string; items: AiItem[] }

function generateAiResponse(prompt: string, company: string): { intro: string; items: AiItem[] } {
  if (prompt.startsWith('Top 3 issues')) return {
    intro: `Here are the top 3 issues from ${company} the last 14 days, based on feedback count and company impact:`,
    items: [
      { title: 'Difficulty Managing Teams and Sub-Accounts', stats: '8 feedback, 6 companies, $277,298', description: `Users report it's "hard to keep track of teams and sub-accounts," leading to confusion and inefficiency.` },
      { title: 'Limited Section-Level Access Control in Spaces', stats: '6 feedback, 6 companies, $1,017,654', description: `Customers say, "We need more granular access controls within Spaces," highlighting security and collaboration concerns.` },
      { title: 'Cumbersome Addition and Arrangement of New Elements', stats: '4 feedback, 3 companies, $525,001', description: `Feedback includes, "Adding new elements is too complicated and disrupts workflow."` },
    ],
  }
  if (prompt.startsWith('Top five key insights')) return {
    intro: `Here are the five key insights for ${company} based on recent feedback:`,
    items: [
      { title: 'Renewal risk tied to feature gaps', stats: '14 mentions, 8 companies, $842,000', description: `Multiple stakeholders have flagged missing capabilities as a direct factor in renewal decisions.` },
      { title: 'Power users most impacted', stats: '11 mentions, 6 companies, $614,500', description: `Advanced workflows are disproportionately affected, increasing churn risk among high-value users.` },
      { title: 'Manual workarounds are widespread', stats: '9 mentions, 5 companies, $390,200', description: `Teams have built brittle internal processes to compensate, adding ongoing maintenance overhead.` },
      { title: 'Competitive alternatives being evaluated', stats: '7 mentions, 4 companies, $512,000', description: `At least two contacts have mentioned evaluating competing tools in the past quarter.` },
      { title: 'Exec-level escalation is high', stats: '5 mentions, 3 companies, $725,000', description: `This has been escalated to VP and C-suite stakeholders, making it a priority for account health.` },
    ],
  }
  return {
    intro: `Here's what I found about ${company} based on available feedback and account data:`,
    items: [
      { title: 'Enterprise-tier account with high engagement', stats: '42 total feedback signals', description: `${company} is an active feedback contributor across multiple product areas, with signals spanning 6+ internal teams.` },
      { title: 'Top requested capabilities', stats: '18 mentions in last 30 days', description: `Automation, reporting, and third-party integrations are the most consistently requested improvements.` },
      { title: 'Renewal timeline context', stats: 'Contract review in Q3', description: `Based on deal data, ${company}'s renewal window aligns with Q3 — making current feature gaps time-sensitive.` },
    ],
  }
}

function PromptChatView({ prompt, company, onBack, onClose }: { prompt: string; company: string; onBack: () => void; onClose: () => void }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<AiMessage[]>([])
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([{ role: 'user', text: prompt }])
    setThinking(true)
    const t = setTimeout(() => {
      setThinking(false)
      setMessages(m => [...m, { role: 'ai', ...generateAiResponse(prompt, company) }])
    }, 1400)
    return () => clearTimeout(t)
  }, [prompt, company])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setThinking(true)
    setTimeout(() => {
      setThinking(false)
      setMessages(m => [...m, { role: 'ai', intro: `Based on available data for ${company}:`, items: [
        { title: 'Follow-up context', stats: 'Latest signals', description: `For "${userMsg}" — the most relevant feedback points to workflow friction and integration gaps as root causes. Would you like me to filter by a specific time range or team?` },
      ] }])
    }, 1400)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center h-14 pl-4 pr-2 shrink-0 gap-1">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors shrink-0">
          <IconChevronRight css={{ width: 16, height: 16, transform: 'rotate(180deg)' }} />
        </button>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-[16px] text-[#222428] leading-[1.5] font-semibold truncate" style={{ fontFamily: "'Roobert PRO', sans-serif", fontFeatureSettings: "'ss01' 1" }}>
            Miro Insights
          </span>
          <span className="shrink-0 px-1.5 py-0.5 rounded text-[11px] font-semibold text-[#3C3F4A] bg-[#E9EAEF] leading-none" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Beta
          </span>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors shrink-0">
          <IconDotsThree css={{ width: 16, height: 16 }} />
        </button>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors shrink-0">
          <IconCross css={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto panel-scroll px-5 py-4 flex flex-col gap-4">
        {messages.map((msg, i) => (
          msg.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[75%] rounded-lg px-4 py-3 text-[14px] leading-[1.57] text-[#3C3F4A]" style={{ backgroundColor: '#F1F2F5', fontFamily: 'Open Sans, sans-serif' }}>
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-col gap-3">
              <p className="text-[14px] leading-[1.57] text-[#222428]" style={{ fontFamily: 'Open Sans, sans-serif' }}>{msg.intro}</p>
              <ol className="flex flex-col gap-4 list-decimal" style={{ fontFamily: 'Open Sans, sans-serif', paddingLeft: 20 }}>
                {msg.items.map((item, j) => (
                  <li key={j} className="text-[14px] leading-[1.57] text-[#222428]">
                    <span className="font-semibold">{item.title}</span>
                    <br />
                    <span className="text-[#222428]">({item.stats}): </span>
                    <button className="inline-flex items-center justify-center w-5 h-5 rounded-md align-middle mx-0.5" style={{ backgroundColor: '#E8ECFC' }}>
                      <IconLink css={{ width: 10, height: 10, color: '#4262FF' }} />
                    </button>
                    <br />
                    <span className="text-[#656B81]">{item.description}</span>
                  </li>
                ))}
              </ol>
            </div>
          )
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Thinking indicator — 16px above input */}
      {thinking && (
        <div className="shrink-0 flex items-center gap-2 px-5 text-[#656B81]" style={{ paddingBottom: 16, fontFamily: 'Open Sans, sans-serif' }}>
          <IconInsights css={{ width: 16, height: 16 }} />
          <span className="text-[13px]">Thinking…</span>
        </div>
      )}

      {/* Input card */}
      <div className="shrink-0 px-4 pb-4" style={{ paddingTop: thinking ? 0 : 8 }}>
        <div className="flex flex-col rounded-lg border border-[#EBEBEB] bg-white" style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask anything..."
            rows={2}
            className="w-full px-4 pt-4 pb-2 text-[14px] text-[#222428] outline-none bg-transparent resize-none placeholder:text-[#7D8297] leading-[1.4]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
                <IconSlidersX size="small" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
                <IconStickyNote size="small" />
              </button>
            </div>
            <button
              onClick={send}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ backgroundColor: input.trim() ? '#4262FF' : '#E9EAEF', color: input.trim() ? '#fff' : '#AEB2C0' }}
            >
              <IconArrowUp css={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompanyDetailView({ company, rowTitle: _rowTitle, onBack, onPromptSelect }: { company: string; rowTitle?: string; onBack: () => void; onPromptSelect: (prompt: string) => void }) {
  const info = COMPANY_INFO[company] ?? { domain: `${company.toLowerCase()}.com`, stage: 'N/A', dealValue: 'N/A', source: 'N/A' }
  return (
    <div className="flex flex-col pb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1 h-8 rounded-lg px-2 text-[14px] font-semibold text-[#656B81] hover:bg-[#F1F2F5] transition-colors self-start -ml-2 mb-2"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      >
        <IconArrowLeft size="small" />
        {company}
      </button>
      <p className="text-[16px] text-[#222428] leading-[1.5] mb-1" style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1" }}>Details</p>
      <div className="flex flex-col">
        <CompanyFieldRow icon={<IconOffice size="small" />} label="Name"><Chip removable={false} css={{ fontSize: 13, '&:hover': { backgroundColor: '#000', color: '#fff', cursor: 'pointer' } }}>{company}</Chip></CompanyFieldRow>
        <CompanyFieldRow icon={<IconLink size="small" />} label="Domain"><Chip removable={false} css={{ fontSize: 13, '&:hover': { backgroundColor: '#000', color: '#fff', cursor: 'pointer' } }}>{info.domain}</Chip></CompanyFieldRow>
        <CompanyFieldRow icon={<span className="text-[13px] leading-none">◎</span>} label="Stage"><Chip removable={false} css={{ fontSize: 13, '&:hover': { backgroundColor: '#000', color: '#fff', cursor: 'pointer' } }}>{info.stage}</Chip></CompanyFieldRow>
        <CompanyFieldRow icon={<span className="text-[13px] font-semibold leading-none">$</span>} label="Deal Value"><span className="text-[14px] text-[#222428] px-1">{info.dealValue}</span></CompanyFieldRow>
        <CompanyFieldRow icon={<IconGlobe size="small" />} label="Source"><Chip removable={false} css={{ fontSize: 13, '&:hover': { backgroundColor: '#000', color: '#fff', cursor: 'pointer' } }}>{info.source}</Chip></CompanyFieldRow>
      </div>
      <p className="text-[16px] text-[#222428] leading-[1.5] mt-6 mb-3" style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1" }}>Discover more about {company}</p>
      <div className="flex flex-col gap-3">
        {[`Top five key insights`, `Learn more about ${company}`, `Top 3 issues from ${company}`].map(label => (
          <button key={label} onClick={() => onPromptSelect(label)} className="flex items-center h-8 px-3 rounded-xl text-[14px] text-[#222428] bg-white border border-[#E9EAEF] hover:border-[#C2C5D3] transition-colors self-start whitespace-nowrap" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

function CompanyFieldRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 min-h-[40px]">
      <div className="w-[120px] shrink-0 flex items-center gap-2 text-[#656B81]">
        <span className="flex items-center shrink-0">{icon}</span>
        <span className="text-[14px] leading-[1.4]">{label}</span>
      </div>
      <div className="flex-1 flex items-center">{children}</div>
    </div>
  )
}

export { SourceLogoChip } from './SourceLogoChip'

function JiraFormField({ label, hint, charMax, lines, children }: { label: string; hint?: string; charMax?: number; lines?: number; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-[14px] font-semibold text-[#222428]" style={{ fontFamily: 'Open Sans, sans-serif' }}>{label}</span>
          <span className="text-[12px] text-[#656B81]" style={{ fontFamily: 'Open Sans, sans-serif' }}>(optional)</span>
        </div>
        {(charMax || lines) && (
          <div className="flex items-center gap-1.5">
            {charMax && <span className="text-[12px] text-[#AEB2C0]">{charMax}</span>}
            {lines && <span className="text-[12px] text-[#AEB2C0]">{lines}</span>}
          </div>
        )}
      </div>
      {children}
      {hint && <span className="text-[12px] text-[#AEB2C0]" style={{ fontFamily: 'Open Sans, sans-serif' }}>{hint}</span>}
    </div>
  )
}

function JiraSelect({ value, onChange, placeholder, options }: { value: string; onChange: (v: string) => void; placeholder: string; options: string[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-[#E0E2E8] rounded-[6px] px-3 h-9 outline-none bg-white transition-colors"
      style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14, color: value ? '#222428' : '#AEB2C0' }}
    >
      <option value="" disabled style={{ color: '#AEB2C0' }}>{placeholder}</option>
      {options.map(o => <option key={o} value={o} style={{ color: '#222428' }}>{o}</option>)}
    </select>
  )
}

export function JiraForm({ row }: { row: SpaceRow }) {
  const [summary, setSummary] = useState(row.title)
  const [description, setDescription] = useState(row.description ?? '')
  const [assignee, setAssignee] = useState('Alex Kim')
  const [reporter, setReporter] = useState('Sarah Park')
  const [epic, setEpic] = useState('')
  const [issueType, setIssueType] = useState('Story')
  const [priority, setPriority] = useState(row.priority === 'now' ? 'High' : row.priority === 'next' ? 'Medium' : 'Low')
  const [teams, setTeams] = useState('')
  const [startDate, setStartDate] = useState('')
  const inputClass = 'w-full border border-[#E0E2E8] rounded-[6px] px-3 h-9 outline-none bg-white transition-colors text-[14px] text-[#222428] focus:border-[#4262FF]'
  const inputStyle = { fontFamily: 'Open Sans, sans-serif' }

  return (
    <div className="flex flex-col gap-4 pb-8">
      <JiraFormField label="Issue type" hint="This is helpful text like req. or formats">
        <JiraSelect value={issueType} onChange={setIssueType} placeholder="Select an option" options={['Story', 'Bug', 'Task', 'Epic', 'Sub-task']} />
      </JiraFormField>

      <JiraFormField label="Priority" hint="This is helpful text like req. or formats">
        <JiraSelect value={priority} onChange={setPriority} placeholder="Select an option" options={['Highest', 'High', 'Medium', 'Low', 'Lowest']} />
      </JiraFormField>

      <JiraFormField label="Summary" hint="This is helpful text like req. or formats" charMax={255} lines={1}>
        <input value={summary} onChange={e => setSummary(e.target.value.slice(0, 255))} className={inputClass} style={inputStyle} placeholder="Placeholder Text" />
      </JiraFormField>

      <JiraFormField label="Description" hint="This is helpful text like req. or formats" charMax={255} lines={2}>
        <textarea value={description} onChange={e => setDescription(e.target.value.slice(0, 255))} rows={3} className="w-full border border-[#E0E2E8] rounded-[6px] px-3 py-2 outline-none bg-white transition-colors text-[14px] text-[#222428] focus:border-[#4262FF] resize-none" style={inputStyle} placeholder="Placeholder Text" />
      </JiraFormField>

      <JiraFormField label="Assignee" hint="This is helpful text like req. or formats" charMax={255} lines={1}>
        <input value={assignee} onChange={e => setAssignee(e.target.value.slice(0, 255))} className={inputClass} style={inputStyle} placeholder="Placeholder Text" />
      </JiraFormField>

      <JiraFormField label="Reporter" hint="This is helpful text like req. or formats" charMax={255} lines={1}>
        <input value={reporter} onChange={e => setReporter(e.target.value.slice(0, 255))} className={inputClass} style={inputStyle} placeholder="Placeholder Text" />
      </JiraFormField>

      <JiraFormField label="Epic" hint="This is helpful text like req. or formats" charMax={255} lines={1}>
        <input value={epic} onChange={e => setEpic(e.target.value.slice(0, 255))} className={inputClass} style={inputStyle} placeholder="Placeholder Text" />
      </JiraFormField>

      <JiraFormField label="Teams" hint="This is helpful text like req. or formats">
        <JiraSelect value={teams} onChange={setTeams} placeholder="Select an option" options={['Engineering', 'Design', 'Product', 'Data']} />
      </JiraFormField>

      <JiraFormField label="Start date" hint="This is helpful text like req. or formats">
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} style={{ ...inputStyle, color: startDate ? '#222428' : '#AEB2C0' }} />
      </JiraFormField>

      <div className="flex gap-2 pt-1">
        <button className="px-4 h-9 rounded-[6px] text-[14px] font-semibold text-white bg-[#4262FF] hover:bg-[#3451D1] transition-colors" style={{ fontFamily: 'Open Sans, sans-serif', border: 'none', cursor: 'pointer' }}>Update</button>
        <button className="px-4 h-9 rounded-[6px] text-[14px] font-semibold text-[#222428] bg-white border border-[#E0E2E8] hover:bg-[#F1F2F5] transition-colors" style={{ fontFamily: 'Open Sans, sans-serif', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  )
}

function InsightSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] font-semibold text-[#222428] leading-[1]" style={{ fontFamily: "'Roobert PRO', sans-serif", fontFeatureSettings: "'ss01' 1" }}>
        {label}
      </span>
      {children}
    </div>
  )
}

function useAnimatedNumber(target: number, duration = 600): number {
  const [displayed, setDisplayed] = useState(0)
  const prevRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = prevRef.current
    const to = target
    if (from === to) return
    let startTs: number | null = null
    const animate = (ts: number) => {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      const step = Math.max(1, Math.round(Math.abs(to - from) / 12))
      const raw = from + (to - from) * eased
      setDisplayed(Math.round(raw / step) * step)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        prevRef.current = to
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration])

  return displayed
}

function StatBox({ value, format, label, wow, noPadding }: { value: number; format: (n: number) => string; label: string; wow?: number; noPadding?: boolean }) {
  const animated = useAnimatedNumber(value)
  return (
    <div className={`flex-1 flex flex-col gap-1 ${noPadding ? '' : 'pb-3'}`}>
      <div className="flex items-baseline gap-2">
        <span className="text-[32px] text-[#222428] leading-[1.2]" style={{ fontFamily: "'Roobert PRO', sans-serif", fontFeatureSettings: "'ss01' 1", display: 'block' }}>
          {format(animated)}
        </span>
        {wow !== undefined && (
          <span style={{ fontSize: 10, fontWeight: 400, color: '#656B81', lineHeight: 1 }}>
            {wow >= 0 ? '+' : ''}{wow}% WoW
          </span>
        )}
      </div>
      <span className="flex items-center gap-1 text-[14px] text-[#656B81] leading-[1.4]">
        {label}
      </span>
    </div>
  )
}

function FeedbackPrompt({ onSubmit, onClose }: { onSubmit: () => void; onClose: () => void }) {
  const [value, setValue] = useState('')

  return (
    <div
      className="w-full rounded-xl p-4 flex flex-col gap-3 relative"
      style={{ backgroundColor: '#F2F4FC' }}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#E2E6F7] transition-colors"
        aria-label="Close"
      >
        <IconCross css={{ width: 14, height: 14 }} />
      </button>

      <p className="text-[16px] text-[#222428] pr-8 leading-[1.5]" style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1" }}>
        Share your feedback?
      </p>

      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Tell us why you're removing this..."
        rows={3}
        className="w-full rounded-lg px-3 py-2 text-[14px] text-[#222428] leading-[1.5] resize-none outline-none border border-[#C2C5D3] focus:border-[#4262FF] bg-white placeholder:text-[#AEB2C0] transition-colors"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      />

      <div className="flex items-center gap-2">
        <button
          onClick={onSubmit}
          className="px-4 h-8 rounded-lg text-[14px] font-semibold text-white transition-colors"
          style={{ backgroundColor: '#4262FF', fontFamily: 'Open Sans, sans-serif' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2D4FE0')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#4262FF')}
        >
          Submit
        </button>
        <button
          onClick={onClose}
          className="px-4 h-8 rounded-lg text-[14px] font-semibold text-[#222428] hover:bg-[#E2E6F7] transition-colors"
          style={{ fontFamily: 'Open Sans, sans-serif' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function AppStoreReviewDetail({
  card,
  onBack,
  highlightColor = '#f1f2f5',
}: {
  card: { title: string; text: string; author: string; date: string; companies: string[]; stars?: number; borderColor?: string; source?: string }
  onBack: () => void
  highlightColor?: string
}) {
  const authorParts = card.author.split(',')
  const authorName = authorParts[0].trim()
  const authorRole = authorParts.slice(1).join(',').trim()
  const stars = card.stars ?? 3


  const LABEL: React.CSSProperties = {
    fontSize: 14,
    color: '#656b81',
    width: 140,
    flexShrink: 0,
    fontFamily: "'Open Sans', sans-serif",
    lineHeight: 1.4,
  }

  return (
    <div
      className="panel-scroll"
      style={{ flex: 1, overflowY: 'auto', padding: '0 16px 32px', display: 'flex', flexDirection: 'column', fontFamily: "'Open Sans', sans-serif", color: '#222428' }}
    >
      {/* ── Sticky header ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'white', margin: '0 -16px', padding: '0 16px 0' }}>
        {/* ← Feedback */}
        <button
          onClick={onBack}
          className="hover:bg-[#F1F2F5] transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, fontSize: 14, color: '#656b81', fontFamily: "'Open Sans', sans-serif", alignSelf: 'flex-start', marginBottom: 12, marginLeft: -8, fontWeight: 600 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12.5L5.5 8 10 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Feedback
        </button>

      </div>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20, marginTop: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: card.borderColor ?? '#f1f2f5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <_IconUser css={{ width: 20, height: 20, color: 'rgba(0,0,0,0.35)' }} />
        </div>
        <div>
          <p style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: 16, color: '#222428', fontFeatureSettings: "'ss01' 1", margin: 0, lineHeight: 1.5 }}>{authorName}</p>
          {authorRole && <p style={{ fontSize: 14, color: '#656b81', margin: 0, lineHeight: 1.4, marginTop: 1 }}>{authorRole}</p>}
        </div>
      </div>

      {/* Metadata fields */}
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
          <span style={LABEL}>Source</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <SourceLogoChip source={card.source ?? 'App Store'} />
          </div>
        </div>
        {card.companies[0] && (
          <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
            <span style={LABEL}>Company</span>
            <CompanyLogo name={card.companies[0]} size={24} />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
          <span style={LABEL}>Feedback date</span>
          <div style={{ backgroundColor: '#f1f2f5', borderRadius: 6, padding: '0 8px', height: 28, display: 'inline-flex', alignItems: 'center', fontSize: 14, color: '#222428', fontFamily: "'Open Sans', sans-serif" }}>{card.date}</div>
        </div>
      </div>

      {/* Review card */}
      <div style={{ backgroundColor: highlightColor, borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <IconStarFilled key={i} css={{ width: 12, height: 12, color: i < stars ? '#3C3F4A' : '#D1D4DC' }} />
          ))}
        </div>
        {/* Title */}
        <p style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14, color: '#222428', margin: 0, marginTop: 4, lineHeight: 1.4 }}>
          {card.title}
        </p>
        {/* Body */}
        <p style={{ fontSize: 14, color: '#222428', margin: 0, lineHeight: 1.5, fontFamily: "'Open Sans', sans-serif" }}>
          {card.text}
        </p>
      </div>
    </div>
  )
}

function FeedbackCard({
  borderColor,
  Icon,
  stars,
  text,
  author,
  date,
  companies,
  source,
  onDismiss,
  onSelect,
  onAddToBoard,
  onViewCall,
}: {
  borderColor: string
  Icon: typeof IconHeart | typeof IconUserTickDown
  stars?: number
  text: string
  author: string
  date: string
  companies: string[]
  source?: string
  onDismiss: () => void
  onSelect: () => void
  onAddToBoard?: () => void
  onViewCall?: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipPos, setTooltipPos] = useState<{ top: number; right: number } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    if (menuButtonRef.current) {
      const r = menuButtonRef.current.getBoundingClientRect()
      setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
    }
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  return (
    <div
      className="w-full rounded-xl flex flex-col gap-2 p-5 cursor-pointer"
      style={{ border: `2px solid ${borderColor}`, borderBottomWidth: 6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onViewCall ?? onSelect}
    >
      {/* Card header: icon + category (on hover) + actions */}
      {(() => {
        const category =
          borderColor === '#D1F09F' ? 'User Praise' :
          borderColor === '#d4bbff' ? 'User Request' :
          'User Problem'
        const categoryColor =
          borderColor === '#D1F09F' ? { bg: '#EAFAEA', text: '#3C3F4A' } :
          borderColor === '#d4bbff' ? { bg: '#EFE9FF', text: '#3C3F4A' } :
          { bg: '#FFF0E0', text: '#3C3F4A' }
        const iconSize = category === 'User Problem' ? 30 : 26
        return (
      <div className="flex items-start gap-2">
        <span style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: hovered ? 6 : 0,
          fontSize: 14,
          fontWeight: 400,
          width: hovered ? 'auto' : 40,
          height: 40,
          padding: hovered ? '0 14px 0 0' : '0 4px 0 0',
          borderRadius: 6,
          backgroundColor: 'transparent',
          color: categoryColor.text,
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'width 0.25s ease, padding 0.25s ease, gap 0.25s ease',
        }}>

          <Icon css={{ width: iconSize, height: iconSize, flexShrink: 0, color: '#3C3F4A' }} />
          <span style={{
            maxWidth: hovered ? 120 : 0,
            opacity: hovered ? 1 : 0,
            overflow: 'hidden',
            display: 'inline-block',
            fontSize: 14,
            fontWeight: 600,
            transition: 'max-width 0.25s ease, opacity 0.2s ease',
          }}>{category}</span>
        </span>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <button
            ref={menuButtonRef}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors"
            onClick={e => { e.stopPropagation(); setMenuOpen(o => !o) }}
          >
            <IconDotsThreeVertical css={{ width: 16, height: 16 }} />
          </button>
          <div className="relative"
            onMouseEnter={e => {
              const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
              setTooltipPos({ top: r.top - 4, right: window.innerWidth - r.right })
              setTooltipVisible(true)
            }}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            <button onClick={e => { e.stopPropagation(); onDismiss() }} aria-label="Remove signal" className="w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
              <IconCross css={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </div>
        )
      })()}

      {/* Stars (optional) */}
      {stars && (
        <div className="flex gap-0.5">
          {Array.from({ length: stars }).map((_, i) => (
            <IconStarFilled key={i} css={{ width: 12, height: 12 }} />
          ))}
        </div>
      )}

      {/* Text */}
      <p
        className="text-[14px] text-[#222428] leading-[1.5] overflow-hidden"
        style={{
          fontVariationSettings: "'CTGR' 0, 'wdth' 100",
          ...(!expanded && { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }),
        }}
      >
        {text}
      </p>
      <span
        className="text-[14px] text-[#222428] cursor-pointer hover:underline"
        onClick={() => setExpanded(v => !v)}
      >
        {expanded ? 'Show less' : 'Show more'}
      </span>

      {/* Author */}
      <p className="text-[14px] text-[#656B81] leading-[1.5]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        {author}
      </p>

      {/* Source + company — smooth slide-in on hover using CSS grid trick */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: hovered ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.25s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 0, gap: 8, height: 24 }}>
            <span style={{ fontSize: 14, fontWeight: 400, color: '#3C3F4A', fontFamily: 'Open Sans, sans-serif', background: '#F1F2F5', borderRadius: 6, padding: '0 8px', height: 24, display: 'inline-flex', alignItems: 'center' }}>{date}</span>
            {source && <SourceLogoChip source={source} />}
            {companies[0] && (
              <CompanyLogo name={companies[0]} size={24} />
            )}
          </div>
        </div>
      </div>
      {menuOpen && menuPos && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[9999] bg-white flex flex-col gap-[4px] py-3 px-3 rounded-lg"
          style={{ top: menuPos.top, right: menuPos.right, width: 224, boxShadow: '0px 2px 8px rgba(34,36,40,0.12), 0px 0px 12px rgba(34,36,40,0.04)' }}
        >
          {[
            { icon: <IconBoard size="small" />, label: 'Add to board', onClick: () => { onAddToBoard?.(); setMenuOpen(false) } },
            { icon: <IconSquaresTwoOverlap size="small" />, label: 'Copy', onClick: () => setMenuOpen(false) },
            { icon: <IconDocFormat size="small" />, label: 'View in transcript', onClick: () => setMenuOpen(false) },
          ].map(({ icon, label, onClick }) => (
            <button
              key={label}
              className="flex items-center gap-3 w-full px-2 py-2.5 rounded text-[14px] text-[#222428] hover:bg-[#F1F2F5] transition-colors text-left"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
              onClick={onClick}
            >
              <span className="text-[#656B81] flex items-center shrink-0">{icon}</span>
              {label}
            </button>
          ))}
        </div>,
        document.body
      )}
      {tooltipVisible && tooltipPos && createPortal(
        <div
          className="fixed pointer-events-none z-[9999] flex flex-col items-end whitespace-nowrap"
          style={{ top: tooltipPos.top, right: tooltipPos.right, transform: 'translateY(-100%)' }}
        >
          <div className="bg-[#2B2D33] text-white text-[12px] leading-none px-2 py-1.5 rounded-md" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Remove signal
          </div>
          <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #2B2D33', marginRight: 8 }} />
        </div>,
        document.body
      )}
    </div>
  )
}

function generateTranscript(card: { title: string; text: string; author: string }) {
  const firstName = card.author.split(',')[0].split(' ')[0]
  const interviewer = 'Alex Mercer'

  const sentences = card.text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 15)

  const s0 = sentences[0] ?? card.text
  const s1 = sentences[1] ?? s0
  const s2 = sentences.slice(2).join(' ') || s1

  // Find the most impactful sentence for the bold highlight
  const impactIdx = sentences.findIndex(s =>
    /revenue|critical|risk|churn|block|erode|trust|renewal|compet|evaluating|alternative/i.test(s)
  )
  const boldSentence = impactIdx > 0 ? sentences[impactIdx] : sentences[sentences.length - 1] ?? ''
  const openingText = (impactIdx > 0 || impactIdx === -1) ? s0 : s0.replace(boldSentence, '').trim()
  const boldText = boldSentence !== s0 ? boldSentence : ''

  const isPositive = /positive|exceeds|exceeded|adoption|enthusiastic/i.test(card.title)
  const isRisk = /risk|churn|alternative|competitive|renewal/i.test(card.title)

  const q1 = isPositive
    ? 'That\'s encouraging to hear. What specifically resonated most with your team?'
    : 'How long has this been affecting your workflows?'
  const q2 = isPositive
    ? 'Were there any gaps or things that didn\'t quite land?'
    : isRisk
    ? 'Has this come up in any renewal or contract conversations?'
    : 'What does your current workaround look like?'

  return [
    { speaker: firstName, time: '00:01', text: openingText ? openingText + ' ' : s0 + ' ', bold: boldText },
    { speaker: interviewer, time: '00:03', text: q1, bold: '' },
    { speaker: firstName, time: '00:05', text: s1, bold: '' },
    { speaker: interviewer, time: '00:07', text: q2, bold: '' },
    { speaker: firstName, time: '00:09', text: s2, bold: '' },
    { speaker: interviewer, time: '00:12', text: 'What would a complete solution look like from your perspective?', bold: '' },
  ]
}

function generateSurveyResponses(card: { title: string; text: string; author: string }) {
  const sentences = card.text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 10)

  const isPositive = /positive|exceeds|exceeded|adoption|enthusiastic|great|excellent|love|really helps/i.test(card.text)
  const isNegative = /risk|churn|alternative|competitive|blocking|workaround|erode|trust|critical|evaluating/i.test(card.text)

  // Q1: Overall rating mapped to sentiment
  const overallRating = isPositive ? 'Excellent' : isNegative ? 'Poor' : 'Average'

  // Q2: Frequency — note friction for negative cards
  const frequency = isNegative
    ? "Daily, though the missing functionality forces us to rely on workarounds that slow us down."
    : 'Almost every day as part of our planning and review workflow.'

  // Q3: Main use case — strip complaint framing from the title to get the capability name
  const capability = card.title
    .replace(/^(Quarterly Demand for |Churn Risk:\s*|Exec-Level\s+|Competitive Gap\s+|Fragile Workaround\s+|Hidden Ops Tax\s+|Platform Trust\s+|Power User\s+|Mid-Market\s+|Beta Exceeded.*?,\s*|Implementation Depth\s+|Onboarding Gap\s+|Positive Pilot Signal,?\s*|Enterprise Trial:\s*)/i, '')
    .split(/[,:]|Blocking|Surfacing|Creating|Growing|Eroding/i)[0]
    .trim()
    .toLowerCase()
  const mainUse = `Primarily for ${capability}, as part of our core planning and product operations workflow.`

  // Q4: Ease of use — pick the sentence most about friction or difficulty
  const frictionSentence = sentences.find(s =>
    /workaround|fragile|breaks|slow|hard|difficult|manual|noise|friction|evaluate|gap|missing|lack|can't|cannot/i.test(s)
  )
  const easeAnswer = isPositive
    ? "Pretty intuitive overall — onboarding took a little time but once familiar it's straightforward."
    : frictionSentence ?? sentences[1] ?? sentences[0] ?? card.text

  // Q5: Working well — use the positive opening sentence for positive cards, or a generic fallback for problem cards
  const workingWell = isPositive
    ? sentences[0] ?? card.text
    : 'The core navigation and basic search work well. The reporting dashboard gives a useful high-level view.'

  // Q6: What to change — the sentence carrying the core complaint
  const changeSentence = sentences.find(s =>
    /evaluat|churn|risk|compet|alternative|workaround|fragile|noise|escalat|lack|missing|can't|cannot|tax|erode/i.test(s)
  ) ?? sentences[sentences.length - 1] ?? card.text

  return [
    { question: 'How would you rate your overall experience with the product?', answer: overallRating },
    { question: 'How often do you use the product?', answer: frequency },
    { question: 'What do you mainly use it for?', answer: mainUse },
    { question: 'How easy is the product to use?', answer: easeAnswer },
    { question: 'Which features are working well for you?', answer: workingWell },
    { question: 'What, if anything, would you change?', answer: changeSentence },
  ]
}

function makeResponseId(seed: string) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  let id = ''
  for (let i = 0; i < 24; i++) {
    h = (h * 1664525 + 1013904223) >>> 0
    id += chars[h % chars.length]
  }
  return id
}

function SurveyFeedbackDetail({
  card,
  onBack,
  highlightColor = '#f1f2f5',
}: {
  card: { title: string; text: string; author: string; date: string; companies: string[]; borderColor?: string }
  onBack: () => void
  highlightColor?: string
}) {
  const authorParts = card.author.split(',')
  const authorName = authorParts[0].trim()
  const authorRole = authorParts.slice(1).join(',').trim()
  const nameWords = authorName.split(' ')
  const authorInitials = (nameWords.length >= 2
    ? nameWords[0][0] + nameWords[nameWords.length - 1][0]
    : authorName.slice(0, 2)).toUpperCase()
  const AVATAR_COLORS = ['#de350b', '#4262FF', '#00C7A8', '#3C3F4A', '#7E57C2']
  const avatarBg = card.borderColor ?? AVATAR_COLORS[authorName.charCodeAt(0) % AVATAR_COLORS.length]

  const responses = generateSurveyResponses(card)
  const responseId = makeResponseId(card.author)
  const surveyId = 'sm-' + makeResponseId(card.title).slice(0, 6)
  const summary = card.text
    .replace(/\bwe've\b/gi, 'the team has')
    .replace(/\bwe're\b/gi, 'the team is')
    .replace(/\bwe\b/gi, 'the team')
    .replace(/\bour\b/gi, 'their')
    .replace(/\bi've\b/gi, 'the user has')
    .replace(/\bi'm\b/gi, 'the user is')
    .replace(/\bi\b/gi, 'the user')
    .replace(/\bmy\b/gi, 'their')
    .replace(/\bus\b/gi, 'the team')
    .replace(/^./, c => c.toUpperCase())

  const LABEL: React.CSSProperties = {
    fontSize: 14,
    color: '#656b81',
    width: 140,
    flexShrink: 0,
    fontFamily: "'Open Sans', sans-serif",
    lineHeight: 1.4,
  }
  const CHIP: React.CSSProperties = {
    backgroundColor: '#f1f2f5',
    borderRadius: 6,
    padding: '0 8px',
    height: 28,
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: 13,
    color: '#222428',
    fontFamily: 'monospace',
    maxWidth: 180,
    overflow: 'hidden',
    whiteSpace: 'nowrap' as const,
    textOverflow: 'ellipsis',
  }
  const DATE_CHIP: React.CSSProperties = {
    backgroundColor: '#f1f2f5',
    borderRadius: 6,
    padding: '0 8px',
    height: 28,
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: 14,
    color: '#222428',
    fontFamily: "'Open Sans', sans-serif",
  }

  return (
    <div
      className="panel-scroll"
      style={{ height: '100%', overflowY: 'auto', padding: '0 16px 32px', display: 'flex', flexDirection: 'column', fontFamily: "'Open Sans', sans-serif", color: '#222428' }}
    >
      {/* ── Sticky header ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'white', margin: '0 -16px', padding: '0 16px 0' }}>
        {/* ← Feedback */}
        <button
          onClick={onBack}
          className="hover:bg-[#F1F2F5] transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, fontSize: 14, color: '#656b81', fontFamily: "'Open Sans', sans-serif", alignSelf: 'flex-start', marginBottom: 12, marginLeft: -8, fontWeight: 600 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12.5L5.5 8 10 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Feedback
        </button>

      </div>

      {/* Author row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, marginTop: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: card.borderColor ? '#222428' : 'white', fontFamily: 'Open Sans, sans-serif' }}>{authorInitials}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: 16, color: '#222428', fontFeatureSettings: "'ss01' 1", margin: 0, lineHeight: 1.5 }}>{authorName}</p>
          {authorRole && <p style={{ fontSize: 14, color: '#656b81', margin: 0, lineHeight: 1.4, marginTop: 1 }}>{authorRole}</p>}
        </div>
      </div>

      {/* Metadata fields */}
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
          <span style={LABEL}>Response ID</span>
          <div style={CHIP}>{responseId.slice(0, 20) + '…'}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
          <span style={LABEL}>Survey ID</span>
          <div style={CHIP}>{surveyId}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
          <span style={LABEL}>Source</span>
          <SourceLogoChip source="SurveyMonkey" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
          <span style={LABEL}>Survey started</span>
          <div style={DATE_CHIP}>{card.date}</div>
        </div>
        {card.companies[0] && (
          <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
            <span style={LABEL}>Company</span>
            <CompanyLogo name={card.companies[0]} size={24} />
          </div>
        )}
      </div>

      {/* Summary bubble */}
      <div style={{ backgroundColor: highlightColor, borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#222428', fontFamily: "'Open Sans', sans-serif" }}>{summary}</p>
      </div>

      {/* Survey Q&A pairs */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {responses.map((qa, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              paddingBottom: 16,
              borderBottom: 'none',
              marginBottom: i < responses.length - 1 ? 16 : 0,
            }}
          >
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#222428', fontFamily: "'Open Sans', sans-serif", lineHeight: 1.4 }}>{qa.question}</p>
            <p style={{ margin: 0, fontSize: 14, color: '#222428', fontFamily: "'Open Sans', sans-serif", lineHeight: 1.5 }}>{qa.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function classifyEntry(text: string, borderColor: string): 'praise' | 'request' | 'problem' {
  const t = text.toLowerCase()
  const count = (pattern: RegExp) => (t.match(pattern) || []).length

  const praiseScore = count(/(love|great|excellent|amazing|fantastic|saves|saved|cut.*time|really helps|works well|positive|exceeds|exceeded|enthusiastic|adoption|appreciate|brilliant|impressed|game.?changer)/g)
  const requestScore = count(/(request(ing|ed|s)?|would like|wish|needs?|wants?|should|could you|if only|it would|please add|feature(s)?|improve(ment)?|enhancement|add support|looking for|hoping|asking for|quarters?)/g)
  const problemScore = count(/(hard|difficult|can't|cannot|broken|issue|problem|frustrated|frustrating|slow|blocking|workaround|complicated|confusing|annoying|painful|cumbersome|impossible|error|fail(ing|ed)?|bug|crash|missing)/g)

  if (praiseScore > requestScore && praiseScore > problemScore) return 'praise'
  if (requestScore >= problemScore && requestScore > praiseScore) return 'request'
  if (problemScore > praiseScore) return 'problem'

  // Fallback to card's border color
  if (borderColor === '#d4bbff') return 'request'
  if (borderColor === '#ffd4b2') return 'problem'
  return 'praise'
}

function FeedbackCardDetailView({
  card,
  onBack,
  onClose: _onClose,
  onAddToBoard,
  highlightColor = '#f1f2f5',
}: {
  card: { title: string; text: string; author: string; date: string; companies: string[]; borderColor?: string; source?: string; stars?: number }
  onBack: () => void
  onClose: () => void
  onAddToBoard?: (data: import('../canvas/CanvasFeedbackCard').FeedbackCardData) => void
  highlightColor?: string
}) {
  const [_activeTab, _setActiveTab] = useState('Conversation')
  const [search, setSearch] = useState('')
  const [showCopyToast, setShowCopyToast] = useState(false)
  const copyToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [convMenuIndex, setConvMenuIndex] = useState<number | null>(null)
  const [convMenuPos, setConvMenuPos] = useState({ top: 0, right: 0 })
  const convMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (convMenuIndex === null) return
    const handler = (e: MouseEvent) => {
      if (convMenuRef.current?.contains(e.target as Node)) return
      setConvMenuIndex(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [convMenuIndex])

  void convMenuIndex; void setConvMenuIndex; void convMenuPos; void setConvMenuPos;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setShowCopyToast(true)
    if (copyToastTimer.current) clearTimeout(copyToastTimer.current)
    copyToastTimer.current = setTimeout(() => setShowCopyToast(false), 2000)
  }

  const transcript = generateTranscript(card)

  const authorParts = card.author.split(',')
  const authorName = authorParts[0].trim()
  const authorRole = authorParts.slice(1).join(',').trim()
  const nameWords = authorName.split(' ')
  const authorInitials = (nameWords.length >= 2
    ? nameWords[0][0] + nameWords[nameWords.length - 1][0]
    : authorName.slice(0, 2)).toUpperCase()
  const AVATAR_COLORS = ['#de350b', '#4262FF', '#00C7A8', '#3C3F4A', '#7E57C2']
  const avatarBg = card.borderColor ?? AVATAR_COLORS[authorName.charCodeAt(0) % AVATAR_COLORS.length]

  const LABEL: React.CSSProperties = {
    fontSize: 14,
    color: '#656b81',
    width: 140,
    flexShrink: 0,
    fontFamily: "'Open Sans', sans-serif",
    lineHeight: 1.4,
  }
  const CHIP: React.CSSProperties = {
    backgroundColor: '#f1f2f5',
    borderRadius: 6,
    padding: '0 8px',
    height: 28,
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: 14,
    color: '#222428',
    fontFamily: "'Open Sans', sans-serif",
  }

  return (
    <><div
      className="panel-scroll"
      style={{ height: '100%', overflowY: 'auto', padding: '0 16px 32px', display: 'flex', flexDirection: 'column', fontFamily: "'Open Sans', sans-serif", color: '#222428' }}
    >
      {/* ── Sticky header ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'white', margin: '0 -16px', padding: '0 16px 0' }}>
        {/* ← Feedback back button */}
        <button
          onClick={onBack}
          className="hover:bg-[#F1F2F5] transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, fontSize: 14, color: '#656b81', fontFamily: "'Open Sans', sans-serif", alignSelf: 'flex-start', marginBottom: 12, marginLeft: -8, fontWeight: 600 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12.5L5.5 8 10 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Feedback
        </button>

      </div>

      {/* Author info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20, marginTop: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: card.borderColor ? '#222428' : 'white', fontFamily: 'Open Sans, sans-serif' }}>{authorInitials}</span>
        </div>
        <div>
          <p style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: 16, color: '#222428', fontFeatureSettings: "'ss01' 1", margin: 0, lineHeight: 1.5 }}>{authorName}</p>
          {authorRole && <p style={{ fontSize: 14, color: '#656b81', margin: 0, lineHeight: 1.4, marginTop: 1 }}>{authorRole}</p>}
        </div>
      </div>

      {/* Metadata fields */}
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
        {card.companies[0] && (
          <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
            <span style={LABEL}>Company</span>
            <CompanyLogo name={card.companies[0]} size={24} />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
          <span style={LABEL}>Feedback date</span>
          <div style={CHIP}>{card.date}</div>
        </div>
      </div>

      {/* Keyword search */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32, padding: '0 12px', borderRadius: 8, backgroundColor: '#f1f2f5' }}>
          <IconMagnifyingGlass css={{ width: 14, height: 14, color: '#7D8297', flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search keywords..."
            style={{ flex: 1, background: 'transparent', fontSize: 13, color: '#222428', outline: 'none', border: 'none', fontFamily: 'Open Sans, sans-serif' }}
          />
        </div>
      </div>

      {/* Grey box — highlighted excerpt */}
      <div style={{ backgroundColor: highlightColor, borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: 14, color: '#222428', fontFeatureSettings: "'ss01' 1" }}>{transcript[0].speaker}</span>
            <span style={{ fontSize: 13, color: '#656b81' }}>{transcript[0].time}</span>
            <span style={{ marginLeft: 'auto' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="5" width="8" height="9" rx="1.5" stroke="#aeb2c0" strokeWidth="1.3" />
                <path d="M5 5V3.5A1.5 1.5 0 016.5 2H12A1.5 1.5 0 0113.5 3.5V9A1.5 1.5 0 0112 10.5h-1.5" stroke="#aeb2c0" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#222428', fontFamily: "'Open Sans', sans-serif" }}>
            {transcript[0].text}{transcript[0].bold && <strong>{transcript[0].bold}</strong>}
          </p>
        </div>
      </div>

      {/* Remaining transcript entries */}
      {transcript.slice(1).map((msg, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: 14, color: '#222428', fontFeatureSettings: "'ss01' 1" }}>{msg.speaker}</span>
            <span style={{ fontSize: 13, color: '#aeb2c0' }}>{msg.time}</span>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#222428', fontFamily: "'Open Sans', sans-serif" }}>{msg.text}</p>
        </div>
      ))}
    </div>

      {/* Conversation entry menu */}
      {convMenuIndex !== null && createPortal(
        <div
          ref={convMenuRef}
          className="fixed z-[9999] bg-white flex flex-col gap-[4px] py-3 px-3 rounded-lg"
          style={{
            top: convMenuPos.top,
            right: convMenuPos.right,
            width: 224,
            boxShadow: '0px 2px 8px rgba(34,36,40,0.12), 0px 0px 12px rgba(34,36,40,0.04)',
            fontFamily: 'Open Sans, sans-serif',
          }}
        >
          {[
            { icon: <IconBoard size="small" />, label: 'Add to board', onClick: () => {
              const entry = convMenuIndex === 0 ? transcript[0] : transcript[convMenuIndex ?? 0]
              const text = entry ? (entry.text + (entry.bold ?? '')) : ''
              const cardType = classifyEntry(text, card.borderColor ?? '')
              const borderColor = cardType === 'request' ? '#d4bbff' : cardType === 'problem' ? '#ffd4b2' : '#D1F09F'
              onAddToBoard?.({
                title: card.title,
                text,
                author: `${entry?.speaker ?? ''} • ${entry?.time ?? ''}`,
                date: card.date,
                companies: card.companies,
                borderColor,
              })
              setConvMenuIndex(null)
            }},
            { icon: <IconSquaresTwoOverlap size="small" />, label: 'Copy', onClick: () => {
              const t = convMenuIndex === 0
                ? transcript[0].text + (transcript[0].bold ?? '')
                : transcript[convMenuIndex]?.text ?? ''
              handleCopy(t)
              setConvMenuIndex(null)
            }},
          ].map(({ icon, label, onClick }) => (
            <button
              key={label}
              className="flex items-center gap-3 w-full px-2 py-2.5 rounded text-[14px] text-[#222428] hover:bg-[#F1F2F5] transition-colors text-left"
              onClick={onClick}
            >
              <span className="text-[#656B81] flex items-center shrink-0">{icon}</span>
              {label}
            </button>
          ))}
        </div>,
        document.body
      )}

            {/* Copy toast */}
      {showCopyToast && createPortal(
        <div
          className="fixed bottom-6 left-6 z-[9999] flex items-center gap-3 rounded-lg"
          style={{
            backgroundColor: '#2B2D33',
            boxShadow: '0px 6px 16px rgba(34,36,40,0.12), 0px 0px 8px rgba(34,36,40,0.06)',
            padding: '12px 16px',
            animation: 'toastSlideUpLeft 0.25s ease',
            fontFamily: 'Open Sans, sans-serif',
          }}
        >
          <p className="text-[14px] font-semibold text-[#FAFAFC] leading-[1.4]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>Selection copied!</p>
        </div>,
        document.body
      )}
    </>
  )
}

function FieldRow({
  label,
  children,
  alignStart,
}: {
  label: string
  children: React.ReactNode
  alignStart?: boolean
}) {
  return (
    <div className={`flex gap-2 min-h-[40px] py-1 ${alignStart ? 'items-start' : 'items-center'}`}>
      <div className={`w-[100px] shrink-0 flex ${alignStart ? 'h-[32px] items-end pb-[5px]' : 'items-center'}`}>
        <span className="flex items-center gap-1 text-[14px] text-[#656B81] leading-[1.4]">
        {label}
      </span>
      </div>
      <div className="flex-1 min-w-0 flex items-center flex-wrap">
        {children}
      </div>
    </div>
  )
}
