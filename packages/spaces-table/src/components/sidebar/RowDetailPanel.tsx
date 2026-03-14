import { useState } from 'react'
import type { SpaceRow } from '@spaces/shared'
import {
  IconButton,
  IconCross,
  IconDotsThreeVertical,
  IconWarning,
  Chip,
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

export function RowDetailPanel({ row, onClose }: RowDetailPanelProps) {
  const [activeTab, setActiveTab] = useState('Details')
  const [insightDismissed, setInsightDismissed] = useState(false)

  const chip = PRIORITY_CHIP[row.priority] ?? PRIORITY_CHIP.icebox
  const priorityLabel = PRIORITY_LABELS[row.priority] ?? row.priority

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden" style={{ width: 376, fontFamily: 'Open Sans, sans-serif' }}>

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 h-12 pl-4 pr-0 shrink-0">
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
        <div className="flex items-center gap-1 shrink-0">
          <IconButton aria-label="More options" variant="ghost" size="medium">
            <IconDotsThreeVertical />
          </IconButton>
          <IconButton aria-label="Close panel" variant="ghost" size="medium" onPress={onClose}>
            <IconCross />
          </IconButton>
        </div>
      </div>

      {/* 4px spacer */}
      <div className="h-1 shrink-0" />

      {/* ── Tabs ────────────────────────────────────────── */}
      <div className="flex border-b border-[#E9EAEF] px-4 shrink-0 pb-1 pt-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="mr-4 pb-2 text-[14px] font-semibold transition-colors"
            style={{
              fontFamily: 'Open Sans, sans-serif',
              color: activeTab === tab ? '#4262FF' : '#656B81',
              borderBottom: activeTab === tab ? '2px solid #4262FF' : '2px solid transparent',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4px spacer */}
      <div className="h-1 shrink-0" />

      {/* ── Content ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto panel-scroll px-4 pt-2 flex flex-col gap-2">

        {activeTab === 'Details' && (
          <>
            {/* Title */}
            <FieldRow label="Title">
              <div className="bg-white rounded px-2 py-1 w-full">
                <p className="text-[14px] text-[#222428] leading-[1.4]">{row.title}</p>
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
              <Chip removable={false}>02-Aug-2026</Chip>
            </FieldRow>

            {/* End date */}
            <FieldRow label="End date">
              <Chip removable={false}>08-Aug-2026</Chip>
            </FieldRow>

            {/* Blocking */}
            <FieldRow label="Blocking">
              <span className="text-[14px] text-[#222428] leading-[1.4] px-2">—</span>
            </FieldRow>

            {/* Company */}
            <FieldRow label="Company" alignStart>
              <div className="flex flex-wrap gap-2 py-1">
                {row.companies.map((name) => (
                  <Chip key={name} removable={false}>{name}</Chip>
                ))}
              </div>
            </FieldRow>

            {/* Low-confidence Insights callout */}
            {!insightDismissed && (
              <div
                className="mt-2 mb-4 rounded-lg px-4 py-3 relative"
                style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}
              >
                <button
                  onClick={() => setInsightDismissed(true)}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded text-[#92400E] hover:bg-[#FEF3C7] transition-colors"
                  aria-label="Dismiss"
                >
                  <IconCross size="small" />
                </button>
                <div className="flex flex-col gap-1 pr-6">
                  <div className="flex items-center gap-2">
                    <IconWarning size="small" css={{ color: '#D97706' }} />
                    <span className="text-[13px] font-semibold text-[#92400E]">Low-confidence Insights</span>
                  </div>
                  <p className="text-[13px] text-[#92400E] leading-[1.5] w-full">
                    The title or description may be too brief to reliably match to customer feedback. Improving context will increase matching accuracy.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab !== 'Details' && (
          <div className="flex-1 flex items-center justify-center py-16">
            <p className="text-[14px] text-[#AEB2C0]">{activeTab} coming soon</p>
          </div>
        )}
      </div>
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
    <div className={`flex gap-2 min-h-[40px] ${alignStart ? 'items-start' : 'items-center'}`}>
      <div className="w-[100px] shrink-0 flex items-center min-h-[40px]">
        <span className="text-[14px] text-[#656B81] leading-[1.4]">{label}</span>
      </div>
      <div className="flex-1 min-w-0 flex items-center flex-wrap">
        {children}
      </div>
    </div>
  )
}
