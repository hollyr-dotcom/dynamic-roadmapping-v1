import type { SpaceRow } from '@spaces/shared'
import { companyARR } from '@spaces/shared'

export function confidenceTagStyle(confidence: string): { bg: string; text: string } {
  const pct = parseInt(confidence)
  if (pct >= 95) return { bg: '#DCFFF1', text: '#1C6B4A' }
  if (pct >= 88) return { bg: '#DAEAFF', text: '#0055CC' }
  if (pct >= 80) return { bg: '#FFF8D6', text: '#7F5F01' }
  return { bg: '#FFE2BD', text: '#A54800' }
}

export const CARD_SUMMARIES: Record<string, string> = {
  '1': 'This is the highest-volume theme with ~793 projected monthly mentions in March. Customers report board-wide lag, stuck loading spinners, frozen editing, and browser tab crashes when tables exceed 100–300 rows. This directly correlates with the existing roadmap item "I can work easily with large tables without significantly degrading the performance of my browser" (P0) and the item about going beyond 1000 rows and 50 fields. The volume and severity of this feedback — including total browser crashes and lost work — suggests this should remain a top priority and may need acceleration. The issue is compounded during collaborative sessions and large paste operations.',
  '2': 'Broken paste from Excel, Google Sheets, CSV, Word, and Confluence is a massive pain point with projected ~652 monthly mentions. The most critical sub-issue is that large pastes are silently truncated to 5 rows, forcing users to manually add rows and re-paste in chunks. Beyond truncation, data collapses into single cells, formatting is stripped, and rich text (bullets, links, bold) is flattened. No current roadmap item addresses paste/import fidelity. This is a foundational gap — customers cannot reliably get data into tables, which undermines adoption of all downstream table features.',
  '3': 'Cell formatting limitations are the highest-volume theme at ~874 projected monthly mentions in March. Customers consistently ask for bullets/numbered lists, bold text, and clickable links within cells. Current cells are essentially plain text, which breaks use cases like mini-specs, acceptance criteria, meeting notes, and workshop content. This is not covered by any existing roadmap item. The demand spans diverse user personas (PMs, facilitators, planners) and is strongly tied to paste fidelity issues — even if paste is fixed, cells need to support the rich content.',
  '4': 'Users are reporting that AI-generated tables appear instantly and unexpectedly overwrite their existing content without warning or preview. The lack of opt-in controls means mistakes are hard to reverse, eroding trust in the AI feature. Feedback consistently asks for a suggestion-only mode — where the AI proposes a table structure before inserting it — with a visible preview and explicit confirmation step before any changes are applied.',
}

export { CARD_SUMMARIES as OVERVIEW_CARD_SUMMARIES }

export const OVERVIEW_ROWS: Record<string, SpaceRow> = {
  '1': { id: 'ov1', title: 'Accelerate large-table performance improvements — boards become unusable at ~100+ rows', description: 'Customers report board-wide lag, stuck loading spinners, frozen editing, and browser tab crashes when tables exceed 100–300 rows.', mentions: 793, customers: 284, estRevenue: 4200, companies: ['Figma', 'Atlassian', 'Notion', 'Stripe'], priority: 'now' },
  '2': { id: 'ov2', title: 'Fix paste and CSV import fidelity — especially the 5-row truncation bug', description: 'Large pastes are silently truncated to 5 rows, forcing users to manually add rows and re-paste in chunks. Data collapses into single cells and formatting is stripped.', mentions: 652, customers: 198, estRevenue: 3100, companies: ['Google', 'Dropbox', 'Asana', 'Linear'], priority: 'now' },
  '3': { id: 'ov3', title: 'Add rich text editing inside table cells (bullets, bold, links)', description: 'Current cells are essentially plain text, breaking use cases like mini-specs, acceptance criteria, meeting notes, and workshop content.', mentions: 874, customers: 312, estRevenue: 3800, companies: ['Miro', 'Notion', 'Atlassian', 'Figma'], priority: 'now' },
  '4': { id: 'ov4', title: 'Rein in AI table creation — make it suggestion-only with preview and opt-in controls', description: 'AI-generated tables appear instantly and unexpectedly overwrite existing content without warning or preview, eroding trust in the AI feature.', mentions: 241, customers: 89, estRevenue: 1900, companies: ['Slack', 'Airbnb', 'Google', 'Spotify'], priority: 'now' },
}

companyARR['ov1'] = [
  { company: 'Atlassian', arr: 240, contacts: 15 },
  { company: 'Stripe',    arr: 200, contacts: 8  },
  { company: 'Figma',     arr: 85,  contacts: 12 },
  { company: 'Notion',    arr: 48,  contacts: 6  },
]
companyARR['ov2'] = [
  { company: 'Google',   arr: 500, contacts: 22 },
  { company: 'Dropbox',  arr: 95,  contacts: 9  },
  { company: 'Asana',    arr: 62,  contacts: 7  },
  { company: 'Linear',   arr: 32,  contacts: 5  },
]
companyARR['ov3'] = [
  { company: 'Miro',      arr: 110, contacts: 18 },
  { company: 'Atlassian', arr: 240, contacts: 14 },
  { company: 'Notion',    arr: 48,  contacts: 11 },
  { company: 'Figma',     arr: 85,  contacts: 9  },
]
companyARR['ov4'] = [
  { company: 'Slack',   arr: 145, contacts: 10 },
  { company: 'Google',  arr: 500, contacts: 7  },
  { company: 'Airbnb',  arr: 120, contacts: 5  },
  { company: 'Spotify', arr: 175, contacts: 4  },
]

export type MatchTag = 'Growing evidence' | 'Fading evidence' | 'New evidence' | 'Missing in roadmap' | 'Weak evidence'

export const MATCH_TAG_STYLE: Record<MatchTag, { bg: string; text: string }> = {
  'Growing evidence':   { bg: '#EAFAEA', text: '#067429' },
  'Fading evidence':    { bg: '#EFE9FF', text: '#3D25A0' },
  'New evidence':       { bg: '#E7F0FF', text: '#0055CC' },
  'Missing in roadmap': { bg: '#FFE3FC', text: '#7B2F6E' },
  'Weak evidence':      { bg: '#FFF8D6', text: '#7F5F01' },
}

export type CardIcon = 'chart-line' | 'chart-progress' | 'sparks' | 'lightning' | 'chat' | 'timeline' | 'insights-search' | 'rocket' | 'three-columns'

export const CARDS: {
  id: string
  icon: CardIcon
  tags: string[]
  matchTag: MatchTag
  title: string
  description: string
  confidence: string
  primaryAction: string
  secondaryAction?: string
}[] = [
  {
    id: '1',
    icon: 'chart-line',
    tags: ['Customer'],
    matchTag: 'Growing evidence',
    title: 'Accelerate large-table performance improvements — boards become unusable at ~100+ rows',
    description: '~793 projected monthly mentions make this the highest-volume theme in March, up 23% month-over-month. It correlates directly to an existing P0 roadmap item that may need to be pulled forward.',
    confidence: '90%',
    primaryAction: 'Reprioritize',
    secondaryAction: 'Dive deeper',
  },
  {
    id: '2',
    icon: 'rocket',
    tags: ['Customer'],
    matchTag: 'Missing in roadmap',
    title: 'Fix paste and CSV import fidelity — especially the 5-row truncation bug',
    description: 'Paste from Excel, Google Sheets, CSV, and Confluence is broken for ~652 projected monthly mentions. No existing roadmap item addresses paste or import fidelity.',
    confidence: '88%',
    primaryAction: 'Add to roadmap',
    secondaryAction: 'Dive deeper',
  },
  {
    id: '3',
    icon: 'chart-line',
    tags: ['Customer'],
    matchTag: 'Growing evidence',
    title: 'Add rich text editing inside table cells (bullets, bold, links)',
    description: '~874 projected monthly mentions make rich text the single highest-volume theme in March, rising for three consecutive months. Current cells are plain text only, breaking use cases like mini-specs, meeting notes, and workshop content.',
    confidence: '85%',
    primaryAction: 'Reprioritize',
    secondaryAction: 'Dive deeper',
  },
  {
    id: '4',
    icon: 'three-columns',
    tags: ['Customer'],
    matchTag: 'Weak evidence',
    title: 'Rein in AI table creation — make it suggestion-only with preview and opt-in controls',
    description: 'Only ~241 mentions across 89 customers so far — low volume relative to other themes. Reports are scattered with no clear pattern yet. Not enough signal to scope work confidently.',
    confidence: '83%',
    primaryAction: 'Dive deeper',
  },
]
