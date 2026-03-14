import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { SpaceRow } from '@spaces/shared'
import {
  IconCross,
  IconDotsThreeVertical,
  IconWarning,
  Chip,
  IconHeart,
  IconFlag,
  IconExclamationPointCircle,
  IconStarFilled,
  IconChevronDown,
  IconSlidersY,
} from '@mirohq/design-system'

interface RowDetailPanelProps {
  row: SpaceRow
  onClose: () => void
}

const PRIORITY_LABELS: Record<string, string> = {
  now:    'Now',
  next:   'Next',
  later:  'Later',
  triage: 'Triage',
  icebox: 'Icebox',
}

// Colors from Figma: Triage = #ffc6c6 / #600000; others extrapolated from design system
const PRIORITY_CHIP: Record<string, { bg: string; color: string }> = {
  now:    { bg: '#C6E9C6', color: '#003C00' },
  next:   { bg: '#C6D9FF', color: '#001E6B' },
  later:  { bg: '#FFE5C6', color: '#5C2D00' },
  triage: { bg: '#FFC6C6', color: '#600000' },
  icebox: { bg: '#E9EAEF', color: '#3C3F4A' },
}

const TABS = ['Details', 'Insights', 'Comments', 'Updates']

const INSIGHT_SUMMARIES: Record<string, string> = {
  '1':  'Customer feedback strongly signals demand for personalised portfolio guidance, with 142 mentions across 4,853 accounts. Users report that generic recommendations erode trust and lead to disengagement — AI-driven risk-adjusted suggestions are cited as a key driver of retention and upsell potential, with an estimated $425K revenue impact.',
  'r1': 'Customer feedback strongly signals demand for personalised portfolio guidance, with 142 mentions across 4,853 accounts. Users report that generic recommendations erode trust and lead to disengagement — AI-driven risk-adjusted suggestions are cited as a key driver of retention and upsell potential, with an estimated $425K revenue impact.',
  '2':  'With 118 mentions from 9,873 customers, automatic transaction categorisation ranks among the highest-impact requests in the backlog. Feedback highlights frustration with manual tagging errors and time spent correcting misclassified entries. Delivering accurate ML-based categorisation is projected to drive $917K in retained and expanded revenue.',
  'r2': 'With 118 mentions from 9,873 customers, automatic transaction categorisation ranks among the highest-impact requests in the backlog. Feedback highlights frustration with manual tagging errors and time spent correcting misclassified entries. Delivering accurate ML-based categorisation is projected to drive $917K in retained and expanded revenue.',
  '3':  'Customers consistently raise the lack of forward-looking budget intelligence as a gap that limits their financial confidence. 105 mentions across 2,957 accounts point to a clear need for predictive spending forecasts. Teams at Dropbox and Asana have specifically flagged this as a blocker to broader adoption, representing $235K in at-risk revenue.',
  'r3': 'Customers consistently raise the lack of forward-looking budget intelligence as a gap that limits their financial confidence. 105 mentions across 2,957 accounts point to a clear need for predictive spending forecasts. Teams at Dropbox and Asana have specifically flagged this as a blocker to broader adoption, representing $235K in at-risk revenue.',
  '4':  'International customers report significant friction around currency management, with 98 mentions spanning 8,532 accounts. Feedback from Atlassian and Notion highlights that delayed FX conversion and hidden fees are the top reasons users switch to competitor products. Solving this unlocks an estimated $843K in expansion revenue.',
  'r4': 'International customers report significant friction around currency management, with 98 mentions spanning 8,532 accounts. Feedback from Atlassian and Notion highlights that delayed FX conversion and hidden fees are the top reasons users switch to competitor products. Solving this unlocks an estimated $843K in expansion revenue.',
  '5':  'Automated savings rules surface frequently in feedback from users who want the app to work proactively on their behalf. 64 mentions across 6,394 customers reflect strong interest in set-and-forget financial automation. Shopify and Linear accounts indicate this feature would directly influence renewal decisions, with $629K in projected impact.',
  'r5': 'Automated savings rules surface frequently in feedback from users who want the app to work proactively on their behalf. 64 mentions across 6,394 customers reflect strong interest in set-and-forget financial automation. Shopify and Linear accounts indicate this feature would directly influence renewal decisions, with $629K in projected impact.',
  '6':  'Natural language search is one of the most-requested power-user features, with 48 mentions across 7,583 accounts. Customers at Apple, Google, and Slack describe current search as a friction point that slows down reconciliation workflows. Enabling plain-English queries is estimated to contribute $748K in retained revenue by reducing churn among high-value users.',
  'r10': 'Natural language search is one of the most-requested power-user features, with 48 mentions across 7,583 accounts. Customers at Apple, Google, and Slack describe current search as a friction point that slows down reconciliation workflows. Enabling plain-English queries is estimated to contribute $748K in retained revenue by reducing churn among high-value users.',
  '7':  'Recurring investment automation is gaining traction with customers focused on long-term wealth building, appearing in 45 mentions across 3,578 accounts. Feedback from Asana and Linear teams points to dollar-cost averaging as a missing capability that drives users to third-party investment apps. Closing this gap is valued at $317K in incremental revenue.',
  'r6': 'Recurring investment automation is gaining traction with customers focused on long-term wealth building, appearing in 45 mentions across 3,578 accounts. Feedback from Asana and Linear teams points to dollar-cost averaging as a missing capability that drives users to third-party investment apps. Closing this gap is valued at $317K in incremental revenue.',
  '8':  'Fraud detection improvements are cited in 23 mentions from 5,789 accounts, with enterprise customers at Apple and Google raising concerns about high-value transfer risk. Feedback highlights that the current anomaly model generates too many false positives, eroding confidence. Upgrading to v2 scoring is tied to $538K in at-risk contracts pending security review.',
  'r11': 'Fraud detection improvements are cited in 23 mentions from 5,789 accounts, with enterprise customers at Apple and Google raising concerns about high-value transfer risk. Feedback highlights that the current anomaly model generates too many false positives, eroding confidence. Upgrading to v2 scoring is tied to $538K in at-risk contracts pending security review.',
  '9':  'Social investing features generate 21 mentions across 1,039 accounts, primarily from younger, engagement-driven users. Feedback centres on wanting to learn from top performers rather than rely solely on personal research. While the revenue impact ($101K) is modest, this feature is a key differentiator for driving organic growth and word-of-mouth referrals.',
  '10': 'Tax-loss harvesting is a high-stakes feature with only 16 mentions but an outsized $921K revenue impact across 9,283 accounts. Enterprise customers at Spotify and Stripe have flagged the absence of end-of-year optimisation tools as a direct factor in delayed renewals. This feature disproportionately resonates with premium-tier users managing large portfolios.',
  'r7': 'Tax-loss harvesting is a high-stakes feature with only 16 mentions but an outsized $921K revenue impact across 9,283 accounts. Enterprise customers at Spotify and Stripe have flagged the absence of end-of-year optimisation tools as a direct factor in delayed renewals. This feature disproportionately resonates with premium-tier users managing large portfolios.',
  '11': "Open Banking integration appears in 16 mentions from 4,759 accounts, particularly from users who manage finances across multiple institutions. Atlassian and Jira teams report that the inability to aggregate external accounts limits the app's utility as a single source of financial truth. API connectivity is estimated to unlock $415K in expansion opportunities.",
  'r8': "Open Banking integration appears in 16 mentions from 4,759 accounts, particularly from users who manage finances across multiple institutions. Atlassian and Jira teams report that the inability to aggregate external accounts limits the app's utility as a single source of financial truth. API connectivity is estimated to unlock $415K in expansion opportunities.",
  '12': 'The financial literacy hub surfaces in 12 mentions across 8,531 accounts, with feedback pointing to a gap between product capability and user confidence. Customers at Figma and Airbnb describe onboarding drop-off as closely tied to users not understanding core financial concepts. An in-app learning centre is projected to improve activation rates and contribute $823K in retained revenue.',
  'r14': 'The financial literacy hub surfaces in 12 mentions across 8,531 accounts, with feedback pointing to a gap between product capability and user confidence. Customers at Figma and Airbnb describe onboarding drop-off as closely tied to users not understanding core financial concepts. An in-app learning centre is projected to improve activation rates and contribute $823K in retained revenue.',
  '13': 'Accessibility gaps are flagged in 10 mentions across 2,649 accounts, often escalated by enterprise procurement and legal teams at Notion and Asana. Feedback indicates that non-compliance with WCAG 2.2 AA is a contractual blocker in several renewal negotiations. Resolving these issues is directly tied to $214K in contracts that are currently at risk.',
  'r13': 'Accessibility gaps are flagged in 10 mentions across 2,649 accounts, often escalated by enterprise procurement and legal teams at Notion and Asana. Feedback indicates that non-compliance with WCAG 2.2 AA is a contractual blocker in several renewal negotiations. Resolving these issues is directly tied to $214K in contracts that are currently at risk.',
  '14': 'Push notifications for price alerts appear in 10 mentions from 7,582 accounts, with strong signal from goal-oriented users at Asana and Google. Feedback highlights that without timely alerts, users miss key market moments and feel the app is passive rather than proactive. A well-executed notification engine is estimated to improve DAU by 18% and contribute $738K in retained revenue.',
  'r9': 'Push notifications for price alerts appear in 10 mentions from 7,582 accounts, with strong signal from goal-oriented users at Asana and Google. Feedback highlights that without timely alerts, users miss key market moments and feel the app is passive rather than proactive. A well-executed notification engine is estimated to improve DAU by 18% and contribute $738K in retained revenue.',
  '15': 'Crypto support generates 8 mentions across 3,214 accounts, primarily from digitally native users at Stripe. While feedback volume is low, sentiment is high-intensity — users who want crypto describe it as a dealbreaker for full adoption. The $156K revenue estimate is conservative; analyst feedback suggests crypto unlocks a new segment with 3–5x growth potential.',
  '16': 'The advisor marketplace is mentioned across 5,621 customer accounts, with demand coming from users who want personalised guidance beyond what the app provides autonomously. Figma and Slack teams describe this as a trust-building feature that would increase willingness to pay for premium tiers, representing $490K in estimated revenue impact.',
  '17': 'Dark mode surfaces in 6 mentions from 1,847 accounts — lower volume but consistent sentiment across Apple, Google, and Atlassian users. Feedback frames it as a quality-of-life expectation rather than a nice-to-have, with its absence noted as a signal of product immaturity. NPS data correlates dark mode delivery with a 12-point satisfaction improvement.',
  'r12': 'Dark mode surfaces in 6 mentions from 1,847 accounts — lower volume but consistent sentiment across Apple, Google, and Atlassian users. Feedback frames it as a quality-of-life expectation rather than a nice-to-have, with its absence noted as a signal of product immaturity. NPS data correlates dark mode delivery with a 12-point satisfaction improvement.',
  '18': 'Gamified savings challenges appear in 5 mentions from 982 accounts, driven by younger users at Shopify and Airbnb. Feedback describes the current savings experience as transactional and uninspiring — badges, streaks, and challenges are seen as motivators that could meaningfully improve goal completion rates, with $130K in projected revenue impact.',
}

const CARD_STYLES = [
  { borderColor: '#ffc6c6', Icon: IconHeart, stars: 3, date: 'Aug 02' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'Jul 18' },
  { borderColor: '#ffd4b2', Icon: IconExclamationPointCircle, date: 'Jun 30' },
  { borderColor: '#ffc6c6', Icon: IconHeart, stars: 5, date: 'Jun 12' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'May 28' },
  { borderColor: '#ffc6c6', Icon: IconHeart, stars: 4, date: 'May 14' },
  { borderColor: '#ffd4b2', Icon: IconExclamationPointCircle, date: 'Apr 29' },
  { borderColor: '#ffc6c6', Icon: IconHeart, stars: 5, date: 'Apr 11' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'Mar 27' },
  { borderColor: '#ffc6c6', Icon: IconHeart, stars: 2, date: 'Mar 10' },
  { borderColor: '#ffd4b2', Icon: IconExclamationPointCircle, date: 'Feb 22' },
  { borderColor: '#ffc6c6', Icon: IconHeart, stars: 4, date: 'Feb 05' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'Jan 20' },
  { borderColor: '#ffc6c6', Icon: IconHeart, stars: 5, date: 'Jan 08' },
  { borderColor: '#d4bbff', Icon: IconFlag, date: 'Dec 19' },
]

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

  return CARD_STYLES.map((style, i) => ({
    ...style,
    text: texts[i],
    author: authors[i],
    companies: row.companies.slice(0, 2),
  }))
}

export function RowDetailPanel({ row, onClose }: RowDetailPanelProps) {
  const [activeTab, setActiveTab] = useState('Details')
  const [insightDismissed, setInsightDismissed] = useState(false)
  const [dismissedCards, setDismissedCards] = useState<Set<number>>(new Set())
  const [showToast, setShowToast] = useState(false)
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleDismissCard = (index: number) => {
    setDismissedCards(prev => new Set([...prev, index]))
    setShowToast(true)
    if (toastTimer) clearTimeout(toastTimer)
    const t = setTimeout(() => setShowToast(false), 4000)
    setToastTimer(t)
  }

  const handleUndo = () => {
    setDismissedCards(prev => {
      const arr = [...prev]
      arr.pop()
      return new Set(arr)
    })
    setShowToast(false)
  }

  const chip = PRIORITY_CHIP[row.priority] ?? PRIORITY_CHIP.icebox
  const priorityLabel = PRIORITY_LABELS[row.priority] ?? row.priority

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden" style={{ width: 376, fontFamily: 'Open Sans, sans-serif' }}>

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 h-12 pl-4 pr-7 shrink-0">
        <p
          className="flex-1 min-w-0 truncate text-[#222428] leading-[1.5]"
          style={{
            fontFamily: "'Roobert PRO', sans-serif",
            fontWeight: 600,
            fontSize: '16px',
            fontFeatureSettings: "'ss01' 1",
          }}
          title={row.title}
        >
          {row.title}
        </p>
        <div className="flex items-center shrink-0">
          <button aria-label="More options" className="w-6 h-6 flex items-center justify-center rounded text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
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
      <div className="flex pl-4 pr-7 shrink-0 pb-4 pt-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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

      {/* ── Content ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto panel-scroll pl-4 pr-7 pt-2 flex flex-col gap-2">

        {activeTab === 'Details' && (
          <>
            {/* Title */}
            <FieldRow label="Title" alignStart>
              <div className="bg-white rounded px-2 py-1 w-full">
                <p className="text-[14px] font-bold text-[#222428] leading-[1.4]">{row.title}</p>
              </div>
            </FieldRow>

            {/* Description */}
            <FieldRow label="Description" alignStart>
              <div className="bg-white rounded px-2 py-1 w-full" style={{ minHeight: 88 }}>
                <p className="text-[14px] text-[#222428] leading-[1.4]">
                  {row.description ?? '—'}
                </p>
              </div>
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

            {/* Start date */}
            <FieldRow label="Start date">
              <Chip removable={false} css={{ fontSize: 14 }}>02-Aug-2026</Chip>
            </FieldRow>

            {/* End date */}
            <FieldRow label="End date">
              <Chip removable={false} css={{ fontSize: 14 }}>08-Aug-2026</Chip>
            </FieldRow>

            {/* Blocking */}
            <FieldRow label="Blocking">
              <span className="text-[14px] text-[#222428] leading-[1.4] px-2">—</span>
            </FieldRow>

            {/* Companies */}
            <FieldRow label="Companies" alignStart>
              <div className="flex flex-wrap gap-2 py-1">
                {row.companies.map((name) => (
                  <Chip key={name} removable={false} css={{ fontSize: 14 }}>{name}</Chip>
                ))}
              </div>
            </FieldRow>

            {/* Low-confidence Insights callout */}
            {!insightDismissed && (
              <div
                className="mt-2 mb-4 w-full rounded-lg p-4 flex flex-col gap-2 relative"
                style={{ backgroundColor: '#FFFBEB', border: '1px solid #F59E0B' }}
              >
                <button
                  onClick={() => setInsightDismissed(true)}
                  className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded text-[#92400E] hover:bg-[#FEF3C7] transition-colors"
                  aria-label="Dismiss"
                >
                  <IconCross css={{ width: 14, height: 14 }} />
                </button>
                <IconWarning size="medium" color="icon-neutrals-dark" />
                <p className="text-[16px] text-[#3C3F4A] leading-[1.4] pr-7" style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1" }}>
                  Low-confidence Insights
                </p>
                <p className="text-[14px] text-[#3C3F4A] leading-[1.5] w-full">
                  The title or description may be too brief to reliably match to customer feedback. Improving context will increase matching accuracy.
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'Insights' && (
          <div className="flex flex-col gap-8 pb-6">

            {/* Summary */}
            <InsightSection label="Summary">
              <p className="text-[14px] text-[#656B81] leading-[1.4]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                {INSIGHT_SUMMARIES[row.id] ?? row.description ?? row.title}
              </p>
            </InsightSection>

            {/* Top impacted customers */}
            <InsightSection label="Top impacted customers">
              <div className="flex flex-wrap gap-2 mt-2">
                {row.companies.map(name => (
                  <Chip key={name} removable={false} css={{ fontSize: 13 }}>{name}</Chip>
                ))}
              </div>
            </InsightSection>

            {/* Impact estimates */}
            <InsightSection label="Impact estimates">
              <div className="flex flex-col gap-0 w-full">
                <div className="flex gap-3">
                  <StatBox value={String(row.mentions)} label="Total Mentions" />
                  <StatBox value={String(row.customers.toLocaleString())} label="Unique Customers" />
                </div>
                <div className="flex gap-3">
                  <StatBox value={String(row.customers.toLocaleString())} label="Total Users" />
                  <StatBox value={row.estRevenue > 0 ? `$${row.estRevenue}K` : '—'} label="Est. Revenue Impact" />
                </div>
              </div>
            </InsightSection>

            {/* Feedback */}
            <div className="flex flex-col gap-3 -mt-1">
              {/* Feedback header row */}
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#222428] leading-[1]" style={{ fontFamily: "'Roobert PRO', sans-serif", fontFeatureSettings: "'ss01' 1" }}>
                  Feedback
                </span>
                <div className="flex items-center gap-1">
                  <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-[13px] text-[#222428] hover:bg-[#F1F2F5] transition-colors">
                    Latest
                    <IconChevronDown size="small" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#222428] hover:bg-[#F1F2F5] transition-colors">
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
                      maxHeight: dismissedCards.has(i) ? 0 : 600,
                      opacity: dismissedCards.has(i) ? 0 : 1,
                      marginBottom: dismissedCards.has(i) ? 0 : 12,
                      overflow: 'hidden',
                      transition: 'max-height 0.35s ease, opacity 0.25s ease, margin-bottom 0.35s ease',
                    }}
                  >
                    <FeedbackCard {...card} onDismiss={() => handleDismissCard(i)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'Details' && activeTab !== 'Insights' && (
          <div className="flex-1 flex items-center justify-center py-16">
            <p className="text-[14px] text-[#AEB2C0]">{activeTab} coming soon</p>
          </div>
        )}
      </div>
      {/* Toast — rendered via portal to escape panel's CSS transform */}
      {showToast && createPortal(
        <div
          className="fixed bottom-6 left-6 z-[9999] flex items-start gap-3 rounded-lg"
          style={{
            backgroundColor: '#2B2D33',
            boxShadow: '0px 6px 16px rgba(34,36,40,0.12), 0px 0px 8px rgba(34,36,40,0.06)',
            width: 280,
            padding: '16px 40px 16px 16px',
            animation: 'toastSlideUp 0.25s ease',
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
            onClick={() => setShowToast(false)}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded text-[#FAFAFC] hover:bg-white/10 transition-colors"
          >
            <IconCross css={{ width: 14, height: 14 }} />
          </button>
        </div>,
        document.body
      )}
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

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 flex flex-col gap-1 pb-3">
      <span className="text-[32px] text-[#222428] leading-[1.2]" style={{ fontFamily: "'Roobert PRO', sans-serif", fontFeatureSettings: "'ss01' 1" }}>
        {value}
      </span>
      <span className="text-[14px] text-[#656B81] leading-[1.4]">{label}</span>
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
  onDismiss,
}: {
  borderColor: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>
  stars?: number
  text: string
  author: string
  date: string
  companies: string[]
  onDismiss: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="w-full rounded-xl flex flex-col gap-2 p-5 transition-all duration-200"
      style={{ border: `2px solid ${borderColor}`, borderBottomWidth: 6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card header: icon + date (on hover) + actions */}
      <div className="flex items-center gap-2">
        <Icon css={{ width: 25, height: 25 }} />
        {hovered && (
          <span className="text-[12px] text-[#959AAC] leading-[1.5] whitespace-nowrap">
            {date}
          </span>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
            <IconDotsThreeVertical css={{ width: 16, height: 16 }} />
          </button>
          <button onClick={onDismiss} aria-label="Remove signal" className="w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
            <IconCross css={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

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
        className="text-[12px] text-[#222428] leading-[1.5] overflow-hidden"
        style={{
          fontVariationSettings: "'CTGR' 0, 'wdth' 100",
          ...(!expanded && { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }),
        }}
      >
        {text}
      </p>
      <span
        className="text-[12px] text-[#222428] cursor-pointer hover:underline"
        onClick={() => setExpanded(v => !v)}
      >
        {expanded ? 'Show less' : 'Show more'}
      </span>

      {/* Author */}
      <p className="text-[12px] text-[#656B81] leading-[1.5]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        {author}
      </p>

      {/* Company chips — visible on hover */}
      {hovered && (
        <div className="flex flex-wrap gap-2 pt-1">
          {companies.map(name => (
            <Chip key={name} removable={false} css={{ fontSize: 14 }}>{name}</Chip>
          ))}
        </div>
      )}
    </div>
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
      <div className="w-[100px] shrink-0 flex items-center">
        <span className="text-[14px] text-[#656B81] leading-[1.4]">{label}</span>
      </div>
      <div className="flex-1 min-w-0 flex items-center flex-wrap">
        {children}
      </div>
    </div>
  )
}
