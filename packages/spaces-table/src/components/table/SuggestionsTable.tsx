import { useState } from 'react'
import type { SpaceRow } from '@spaces/shared'
import {
  IconDotsSixVertical,
  IconChatPlus,
  DropdownMenu,
  IconSquaresTwoOverlap,
  IconTrash,
  IconChatLinesTwo,
  Popover,
  IconInsights,
  IconSparks,
} from '@mirohq/design-system'
import { CARDS, OVERVIEW_ROWS, MATCH_TAG_STYLE, confidenceTagStyle } from '../page/OverviewPage'
import { MENU_WIDTH } from '../page/ViewTabsToolbar'

interface SuggestionsTableProps {
  onRowClick?: (row: SpaceRow, description: string, cardId: string) => void
}

const STICKY_TOP = 64
const GAP_COVER = '0 -12px 0 0 white'

const COLUMNS = [
  { key: 'title',      label: 'Title',        width: '610px'  },
  { key: 'signal',     label: 'Signal',       width: '220px' },
  { key: 'confidence', label: 'Confidence',   width: '140px' },
  { key: 'mentions',   label: 'Mentions',     width: '140px' },
  { key: 'customers',  label: 'Customers',    width: '140px' },
  { key: 'revenue',    label: 'Est. revenue', width: '185px' },
] as const

const POPOVER_CSS = {
  background: 'white',
  borderRadius: 8,
  width: 'fit-content',
  minWidth: 160,
  padding: 0,
  boxShadow: '0px 0px 12px rgba(34,36,40,0.04), 0px 2px 8px rgba(34,36,40,0.12)',
  border: 'none',
  outline: 'none',
  overflow: 'hidden',
  '&::before': { display: 'none' },
  '&::after': { display: 'none' },
  '& svg[aria-hidden="true"][viewBox="0 0 6 50"]': { display: 'none' },
}

function ViewInsightsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        height: 48,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0 12px',
        fontSize: 14,
        color: '#222428',
        fontFamily: 'Open Sans, sans-serif',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#F1F2F5')}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
    >
      <IconInsights css={{ width: 16, height: 16, color: '#222428', flexShrink: 0 }} />
      View Insights
    </button>
  )
}

function RowContextMenu({ onClose, onViewInsights }: { onClose: () => void; onViewInsights?: () => void }) {
  return (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger asChild>
        <div onClick={(e) => e.stopPropagation()} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="bottom" align="start" alignOffset={-12} css={{ minWidth: MENU_WIDTH }}>
        <DropdownMenu.Item onSelect={() => { onViewInsights?.(); onClose() }}>
          <DropdownMenu.IconSlot><IconSparks /></DropdownMenu.IconSlot>
          Open in sidekick
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={onClose}>
          <DropdownMenu.IconSlot><IconChatLinesTwo /></DropdownMenu.IconSlot>
          View comments
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={onClose}>
          <DropdownMenu.IconSlot><IconSquaresTwoOverlap /></DropdownMenu.IconSlot>
          Duplicate
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={onClose}>
          <DropdownMenu.IconSlot><IconTrash /></DropdownMenu.IconSlot>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

export function SuggestionsTable({ onRowClick }: SuggestionsTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [openCellKey, setOpenCellKey] = useState<string | null>(null)

  const rows = CARDS.map(card => ({
    card,
    row: OVERVIEW_ROWS[card.id],
  })).filter(({ row }) => Boolean(row))

  return (
    <div className="w-full shrink-0 item-enter" style={{ animationDelay: '80ms' }}>
      <table className="border-separate" style={{ borderSpacing: 0, minWidth: '1360px' }}>
        <thead>
          <tr>
            {/* Leading spacer — matches pl-14 divider-first width */}
            <th
              className="pl-14 w-0 sticky z-10 bg-white"
              style={{ top: STICKY_TOP, boxShadow: GAP_COVER }}
              aria-hidden="true"
            />
            {COLUMNS.map(col => (
              <th
                key={col.key}
                className="text-left font-body font-semibold text-[#656B81] h-14 sticky z-10 bg-white"
                style={{
                  top: STICKY_TOP,
                  boxShadow: GAP_COVER,
                  fontSize: '14px',
                  width: col.width,
                  paddingLeft: '12px',
                  paddingRight: '20px',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </th>
            ))}
            <th
              className="table-fill sticky z-10 bg-white"
              style={{ top: STICKY_TOP, boxShadow: GAP_COVER }}
              aria-hidden="true"
            />
          </tr>
        </thead>
        <tbody>
          {rows.map(({ card, row }, idx) => {
            const matchStyle = MATCH_TAG_STYLE[card.matchTag]
            const confStyle = confidenceTagStyle(card.confidence)
            const isSelected = selectedId === card.id

            return (
              <tr
                key={card.id}
                className={isSelected ? 'row-selected' : ''}
                style={{ height: '56px' }}
              >
                {/* Leading cell with drag handle + comment — matches divider-first */}
                <td className="pl-14 divider-first" style={{ fontSize: '12px', position: 'relative' }}>
                  <div className="flex items-center w-full gap-0.5">
                    {/* Row number / dots — swap in the same slot */}
                    <div className="relative w-8 h-8 shrink-0">
                      <div className="row-number w-8 h-8 flex items-center justify-center" style={{ color: '#AEB2C0' }}>
                        {idx + 1}
                      </div>
                      <button
                        className="row-dots absolute inset-0 flex items-center justify-center rounded-lg cursor-grab"
                        onClick={(e) => { e.stopPropagation(); setSelectedId(prev => prev === card.id ? null : card.id) }}
                      >
                        <IconDotsSixVertical
                          size="small"
                          color={isSelected ? 'icon-primary' : 'icon-neutrals-subtle'}
                        />
                      </button>
                    </div>

                    {/* Comment button — hover only */}
                    <button
                      className="row-comment flex w-8 h-8 items-center justify-center rounded-lg hover:bg-[#E9EAEF] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconChatPlus size="small" color="icon-neutrals-subtle" />
                    </button>
                  </div>

                  {/* Context menu */}
                  {isSelected && (
                    <RowContextMenu
                      onClose={() => setSelectedId(null)}
                      onViewInsights={() => onRowClick?.(row, card.description, card.id)}
                    />
                  )}
                </td>

                {/* Title */}
                <td className="px-3 border-b border-[#F1F2F5]" style={{ maxWidth: '610px' }}>
                  <span className="truncate block font-body font-normal text-[#222428]" style={{ fontSize: 14 }}>
                    {card.title}
                  </span>
                </td>

                {/* Signal */}
                <td className="px-3 border-b border-[#F1F2F5]">
                  <Popover
                    open={openCellKey === `${card.id}-signal`}
                    onOpen={() => setOpenCellKey(`${card.id}-signal`)}
                    onClose={() => setOpenCellKey(null)}
                  >
                    <Popover.Trigger asChild>
                      <div style={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 28,
                            padding: '4px 8px',
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 600,
                            backgroundColor: matchStyle.bg,
                            color: matchStyle.text,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {card.matchTag}
                        </span>
                      </div>
                    </Popover.Trigger>
                    <Popover.Content side="bottom" align="start" sideOffset={4} css={POPOVER_CSS}>
                      <ViewInsightsButton onClick={() => { setOpenCellKey(null); onRowClick?.(row, card.description, card.id) }} />
                    </Popover.Content>
                  </Popover>
                </td>

                {/* Confidence */}
                <td className="px-3 border-b border-[#F1F2F5]">
                  <Popover
                    open={openCellKey === `${card.id}-confidence`}
                    onOpen={() => setOpenCellKey(`${card.id}-confidence`)}
                    onClose={() => setOpenCellKey(null)}
                  >
                    <Popover.Trigger asChild>
                      <div style={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 28,
                            padding: '4px 8px',
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 600,
                            backgroundColor: confStyle.bg,
                            color: confStyle.text,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {card.confidence}
                        </span>
                      </div>
                    </Popover.Trigger>
                    <Popover.Content side="bottom" align="start" sideOffset={4} css={POPOVER_CSS}>
                      <ViewInsightsButton onClick={() => { setOpenCellKey(null); onRowClick?.(row, card.description, card.id) }} />
                    </Popover.Content>
                  </Popover>
                </td>

                {/* Mentions */}
                <td className="px-3 border-b border-[#F1F2F5]">
                  <Popover
                    open={openCellKey === `${card.id}-mentions`}
                    onOpen={() => setOpenCellKey(`${card.id}-mentions`)}
                    onClose={() => setOpenCellKey(null)}
                  >
                    <Popover.Trigger asChild>
                      <div style={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
                        <span style={{ fontSize: 14, color: '#1a1b1e', fontFamily: "'Noto Sans', sans-serif" }}>
                          {row.mentions.toLocaleString()}
                        </span>
                      </div>
                    </Popover.Trigger>
                    <Popover.Content side="bottom" align="start" sideOffset={4} css={POPOVER_CSS}>
                      <ViewInsightsButton onClick={() => { setOpenCellKey(null); onRowClick?.(row, card.description, card.id) }} />
                    </Popover.Content>
                  </Popover>
                </td>

                {/* Customers */}
                <td className="px-3 border-b border-[#F1F2F5]">
                  <Popover
                    open={openCellKey === `${card.id}-customers`}
                    onOpen={() => setOpenCellKey(`${card.id}-customers`)}
                    onClose={() => setOpenCellKey(null)}
                  >
                    <Popover.Trigger asChild>
                      <div style={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
                        <span style={{ fontSize: 14, color: '#1a1b1e', fontFamily: "'Noto Sans', sans-serif" }}>
                          {row.customers.toLocaleString()}
                        </span>
                      </div>
                    </Popover.Trigger>
                    <Popover.Content side="bottom" align="start" sideOffset={4} css={POPOVER_CSS}>
                      <ViewInsightsButton onClick={() => { setOpenCellKey(null); onRowClick?.(row, card.description, card.id) }} />
                    </Popover.Content>
                  </Popover>
                </td>

                {/* Est. revenue */}
                <td className="px-3 border-b border-[#F1F2F5]">
                  <Popover
                    open={openCellKey === `${card.id}-revenue`}
                    onOpen={() => setOpenCellKey(`${card.id}-revenue`)}
                    onClose={() => setOpenCellKey(null)}
                  >
                    <Popover.Trigger asChild>
                      <div style={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
                        <span style={{ fontSize: 14, color: '#1a1b1e', fontFamily: "'Noto Sans', sans-serif", whiteSpace: 'nowrap' }}>
                          ${(row.estRevenue / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </Popover.Trigger>
                    <Popover.Content side="bottom" align="start" sideOffset={4} css={POPOVER_CSS}>
                      <ViewInsightsButton onClick={() => { setOpenCellKey(null); onRowClick?.(row, card.description, card.id) }} />
                    </Popover.Content>
                  </Popover>
                </td>

                {/* Trailing fill */}
                <td className="table-fill" aria-hidden="true" />
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
