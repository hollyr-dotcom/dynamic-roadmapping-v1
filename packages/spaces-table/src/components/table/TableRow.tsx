
import { useState } from 'react'
import type { FieldDefinition, SpaceRow } from '@spaces/shared'
import { IconDotsSixVertical, IconDotsThreeVertical, IconButton, IconChatPlus, IconCursor, DropdownMenu, IconSquaresTwoOverlap, IconTrash, IconArrowsOutSimple, IconRocket, IconChatLinesTwo, IconPlus, IconLink, Popover, Tooltip, IconInsights } from '@mirohq/design-system'

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
  onRowClick?: (row: SpaceRow) => void
  onCompanyClick?: (row: SpaceRow, name: string) => void
  isUpdated?: boolean
  importDelay?: number
  onMoveToRoadmap?: (rowId: string) => void
  showMoveToRoadmap?: boolean
  onAddToBoard?: (rowId: string) => void
}


export function TableRow({ row, idx, fields, onRowClick, onCompanyClick, isUpdated, importDelay, onMoveToRoadmap, showMoveToRoadmap, onAddToBoard }: TableRowProps) {
  const [openFieldId, setOpenFieldId] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const importStyle = importDelay !== undefined ? {
    opacity: 0,
    animation: `row-import-enter 300ms cubic-bezier(0.16, 1, 0.3, 1) ${importDelay}ms forwards, row-arrival-wash 600ms ease ${importDelay + 300}ms forwards`,
  } : {}

  return (
    <tr
      data-row-id={row.id}
      className={isMenuOpen ? 'row-menu-open' : ''}
      style={{ height: '56px', ...importStyle }}
    >
      <td className="pl-14 divider-first" style={{ fontSize: '12px', position: 'relative' }}>
        {/* Floating drag handle — in the left padding gutter */}
        <div className="row-drag-handle">
          <IconDotsSixVertical size="small" />
        </div>

        {isUpdated && (
          <span style={{ position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4262FF', zIndex: 1 }} />
        )}
        <div className="flex items-center w-full gap-0.5 ml-2">
          {/* Row number / open-in-side-panel — swap in the same slot */}
          <div className="relative w-8 h-8 shrink-0">
            <div className="row-number w-8 h-8 flex items-center justify-center">
              {idx + 1}
            </div>
            <div className="row-dots absolute inset-0 flex items-center justify-center">
              <Tooltip>
                <Tooltip.Trigger asChild>
                  <IconButton
                    aria-label="Open in side panel"
                    variant="ghost"
                    size="medium"
                    onPress={() => onRowClick?.(row)}
                    css={{ borderRadius: 8, color: '#7D8297', '&:hover': { background: '#E9EAEF' } }}
                  >
                    <IconArrowsOutSimple />
                  </IconButton>
                </Tooltip.Trigger>
                <Tooltip.Portal><Tooltip.Content side="top" sideOffset={4} css={{ zIndex: 9999 }}>Open in side panel</Tooltip.Content></Tooltip.Portal>
              </Tooltip>
            </div>
          </div>

          {/* Comment button — hover only */}
          <Tooltip>
            <Tooltip.Trigger asChild>
              <button
                className="row-comment flex w-8 h-8 items-center justify-center rounded-lg hover:bg-[#E9EAEF] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <IconChatPlus size="small" color="icon-neutrals-subtle" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal><Tooltip.Content side="top" sideOffset={4} css={{ zIndex: 9999 }}>Add comment</Tooltip.Content></Tooltip.Portal>
          </Tooltip>

          {/* Three-dots menu — hover only */}
          <div className="row-menu flex items-center justify-center">
            <DropdownMenu onOpen={() => setIsMenuOpen(true)} onClose={() => setIsMenuOpen(false)}>
              <Tooltip>
                <Tooltip.Trigger asChild>
                  <DropdownMenu.Trigger asChild>
                    <IconButton
                      aria-label="More options"
                      variant="ghost"
                      size="medium"
                      css={isMenuOpen
                        ? { borderRadius: 8, background: '#E6E6E6', color: '#656B81', '&:hover': { background: '#E6E6E6' } }
                        : { borderRadius: 8, color: '#7D8297', '&:hover': { background: '#E9EAEF' } }
                      }
                    >
                      <IconDotsThreeVertical />
                    </IconButton>
                  </DropdownMenu.Trigger>
                </Tooltip.Trigger>
                <Tooltip.Portal><Tooltip.Content side="top" sideOffset={4} css={{ zIndex: 9999 }}>More options</Tooltip.Content></Tooltip.Portal>
              </Tooltip>
                <DropdownMenu.Content side="bottom" align="start" alignOffset={-12} css={{ minWidth: MENU_WIDTH }}>
                  <DropdownMenu.Item onSelect={() => onAddToBoard?.(row.id)}>
                    <DropdownMenu.IconSlot>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12.833 0.667C12.833 2.047 13.952 3.167 15.333 3.167V4.167C13.952 4.167 12.833 5.286 12.833 6.667H11.833C11.833 5.286 10.714 4.167 9.333 4.167V3.167C10.714 3.167 11.833 2.047 11.833 0.667H12.833Z" fill="currentColor"/><path d="M3.108 15.071L4.458 15.454C6.112 12.554 9.272 10.788 12.61 10.898L13.008 9.492L3.425 2.548L2.03 3.327L3.108 15.071ZM10.955 9.65C8.351 9.997 5.958 11.327 4.29 13.356L3.45 4.213L10.955 9.65Z" fill="currentColor"/></svg>
                    </DropdownMenu.IconSlot>
                    Work on this
                  </DropdownMenu.Item>
                  {showMoveToRoadmap && (
                    <DropdownMenu.Item onSelect={() => onMoveToRoadmap?.(row.id)}>
                      <DropdownMenu.IconSlot><IconRocket /></DropdownMenu.IconSlot>
                      Move to roadmap
                    </DropdownMenu.Item>
                  )}
                  <DropdownMenu.Item>
                    <DropdownMenu.IconSlot><IconLink /></DropdownMenu.IconSlot>
                    Copy link
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>
                      <DropdownMenu.IconSlot><IconPlus /></DropdownMenu.IconSlot>
                      Add item
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent css={{ minWidth: MENU_WIDTH }}>
                      <DropdownMenu.Item>
                        <DropdownMenu.IconSlot><IconAddLineTop /></DropdownMenu.IconSlot>
                        Add item above
                      </DropdownMenu.Item>
                      <DropdownMenu.Item>
                        <DropdownMenu.IconSlot><IconAddLineBottom /></DropdownMenu.IconSlot>
                        Add item below
                      </DropdownMenu.Item>
                      <DropdownMenu.Item>
                        <DropdownMenu.IconSlot><IconFilledBottomBox /></DropdownMenu.IconSlot>
                        Add sub-item
                      </DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item>
                    <DropdownMenu.IconSlot><IconSquaresTwoOverlap /></DropdownMenu.IconSlot>
                    Duplicate
                  </DropdownMenu.Item>
                  <DropdownMenu.Item variant="danger">
                    <DropdownMenu.IconSlot><IconTrash /></DropdownMenu.IconSlot>
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
          </div>
        </div>
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
              <Popover open={openFieldId === field.id} onOpen={() => setOpenFieldId(field.id)} onClose={() => setOpenFieldId(null)}>
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
                    onClick={(e) => { e.stopPropagation(); setOpenFieldId(null); onRowClick?.(row) }}
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
