import { useState } from 'react'
import type { FieldDefinition, SpaceRow } from '@spaces/shared'
import { IconDotsSixVertical, IconChatPlus, DropdownMenu, IconSquaresTwoOverlap, IconTrash, IconArrowsOutSimple, IconMap, IconChatLinesTwo, Popover, IconInsights } from '@mirohq/design-system'

function IconAddLineTop() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.33342 9.3335V6.66683H4.66675V5.3335H7.33342V2.66683H8.66675V5.3335H11.3334V6.66683H8.66675V9.3335H7.33342ZM1.33342 13.3335V12.0002H14.6667V13.3335H1.33342Z" fill="currentColor"/>
    </svg>
  )
}

function IconAddLineBottom() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.66658 6.6665V9.33317H11.3333V10.6665H8.66658V13.3332H7.33325V10.6665H4.66659V9.33317H7.33325V6.6665H8.66658ZM14.6666 2.6665V3.99984H1.33325V2.6665H14.6666Z" fill="currentColor"/>
    </svg>
  )
}

function IconFilledBottomBox() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M3.33333 6.66667C2.59695 6.66667 2 6.06971 2 5.33333V3.33333C2 2.59695 2.59695 2 3.33333 2H12.6667C13.403 2 14 2.59695 14 3.33333V5.33333C14 6.06971 13.403 6.66667 12.6667 6.66667H4.66667V10C4.66667 10.7364 5.26362 11.3333 6 11.3333H7.33333V10.6667C7.33333 9.93029 7.93029 9.33333 8.66667 9.33333H12.6667C13.403 9.33333 14 9.93029 14 10.6667V12.6667C14 13.403 13.403 14 12.6667 14H8.66667C7.93029 14 7.33333 13.403 7.33333 12.6667H6C4.52724 12.6667 3.33333 11.4728 3.33333 10V6.66667ZM3.33333 5.33333H12.6667V3.33333H3.33333V5.33333Z" fill="currentColor"/>
    </svg>
  )
}
import { CellRenderer } from './CellRenderer'
import { MENU_WIDTH } from '../page/ViewTabsToolbar'

interface TableRowProps {
  row: SpaceRow
  idx: number
  fields: FieldDefinition[]
  isSelected: boolean
  onToggleSelect: (id: string, e: React.MouseEvent) => void
  onDeselect: () => void
  onRowClick?: (row: SpaceRow) => void
  onCompanyClick?: (row: SpaceRow, name: string) => void
  isUpdated?: boolean
  importDelay?: number
  onMoveToRoadmap?: (rowId: string) => void
  showMoveToRoadmap?: boolean
}

function RowContextMenu({ onClose, onOpenSidePanel, onMoveToRoadmap, showMoveToRoadmap }: { onClose: () => void; onOpenSidePanel?: () => void; onMoveToRoadmap?: () => void; showMoveToRoadmap?: boolean }) {
  return (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger asChild>
        <div onClick={(e) => e.stopPropagation()} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="bottom" align="start" alignOffset={-12} css={{ minWidth: MENU_WIDTH }}>
        <DropdownMenu.Item onSelect={() => { onOpenSidePanel?.(); onClose() }}>
          <DropdownMenu.IconSlot><IconArrowsOutSimple /></DropdownMenu.IconSlot>
          Open in side panel
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={onClose}>
          <DropdownMenu.IconSlot><IconChatLinesTwo /></DropdownMenu.IconSlot>
          View comments
        </DropdownMenu.Item>
        {showMoveToRoadmap && (
          <>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onSelect={onMoveToRoadmap ?? onClose}>
              <DropdownMenu.IconSlot><IconMap /></DropdownMenu.IconSlot>
              Move to roadmap
            </DropdownMenu.Item>
          </>
        )}
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={onClose}>
          <DropdownMenu.IconSlot><IconAddLineTop /></DropdownMenu.IconSlot>
          Add record above
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={onClose}>
          <DropdownMenu.IconSlot><IconAddLineBottom /></DropdownMenu.IconSlot>
          Add record below
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={onClose}>
          <DropdownMenu.IconSlot><IconFilledBottomBox /></DropdownMenu.IconSlot>
          Add sub-record
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

export function TableRow({ row, idx, fields, isSelected, onToggleSelect, onDeselect, onRowClick, onCompanyClick, isUpdated, importDelay, onMoveToRoadmap, showMoveToRoadmap }: TableRowProps) {
  const [openPopoverField, setOpenPopoverField] = useState<string | null>(null)

  const importStyle = importDelay !== undefined ? {
    opacity: 0,
    animation: `row-import-enter 300ms cubic-bezier(0.16, 1, 0.3, 1) ${importDelay}ms forwards, row-arrival-wash 600ms ease ${importDelay + 300}ms forwards`,
  } : {}

  return (
    <tr
      className={isSelected ? 'row-selected' : ''}
      style={{ height: '56px', ...importStyle }}
    >
      <td className="pl-14 divider-first" style={{ fontSize: '12px', position: 'relative' }}>
        {isUpdated && (
          <span style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4262FF', zIndex: 1 }} />
        )}
        <div className="flex items-center w-full gap-0.5">
          {/* Row number / dots — swap in the same slot */}
          <div className="relative w-8 h-8 shrink-0">
            <div className="row-number w-8 h-8 flex items-center justify-center">
              {idx + 1}
            </div>
            <button
              className="row-dots absolute inset-0 flex items-center justify-center rounded-lg cursor-grab"
              onClick={(e) => onToggleSelect(row.id, e)}
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
            onClose={onDeselect}
            onOpenSidePanel={onRowClick ? () => onRowClick(row) : undefined}
            onMoveToRoadmap={onMoveToRoadmap ? () => { onMoveToRoadmap(row.id); onDeselect() } : undefined}
            showMoveToRoadmap={showMoveToRoadmap}
          />
        )}
      </td>

      {fields.map((field) => {
        const noPopover = ['jiraKey', 'title', 'priority', 'description'].includes(field.id)
        return (
          <td
            key={field.id}
            className="px-3 border-b border-[#F1F2F5]"
            style={field.id === 'description' ? { maxWidth: '320px' } : undefined}
          >
            {noPopover ? (
              <div style={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
                <CellRenderer field={field} row={row} onAvatarChipClick={onCompanyClick ? (name) => onCompanyClick(row, name) : undefined} />
              </div>
            ) : (
              <Popover open={openPopoverField === field.id} onOpen={() => setOpenPopoverField(field.id)} onClose={() => setOpenPopoverField(null)}>
                <Popover.Trigger asChild>
                  <div style={{ width: '100%' }} onClick={(e) => e.stopPropagation()}>
                    <CellRenderer field={field} row={row} onAvatarChipClick={onCompanyClick ? (name) => onCompanyClick(row, name) : undefined} />
                  </div>
                </Popover.Trigger>
                <Popover.Content
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  css={{
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
                  }}
                >
                  <button
                    onMouseDown={(e) => { e.preventDefault(); setOpenPopoverField(null); onRowClick?.(row) }}
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
                </Popover.Content>
              </Popover>
            )}
          </td>
        )
      })}

      <td className="table-fill" aria-hidden="true" />
    </tr>
  )
}
