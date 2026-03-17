import React, { useState } from 'react'
import {
  DropdownMenu,
  IconChevronLeft,
  IconKanban,
  IconTable,
  IconTimelineFormat,
  IconFunnel,
  IconArrowsDownUp,
  IconVerticalBlocks,
  IconHorizontalBlocks,
  IconTextT,
  IconNumber,
  IconDollarSignCurrency,
  IconOffice,
  IconTickCircle,
  IconButton,
  IconCross,
} from '@mirohq/design-system'
import { SectionHeader } from './SectionHeader'
import { SettingCell } from './SettingCell'
import { FieldRow } from './FieldRow'
import { FilterPage } from './FilterPage'
import type { FilterCondition, FieldDefinition, FieldType } from '@spaces/shared'
import { defaultCondition } from '@spaces/shared'
import { AiBar } from './AiBar'
import { parseFilterCommand } from '../../lib/filterParser'

type MiroIcon = React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>

type ActivePage = {
  name: string
  parent: string
  aiPrompt: string
} | null

const viewSettings: { label: string; subtitle: string; iconBg: 'green' | 'blue' | 'gray'; icon: MiroIcon; aiPrompt: string }[] = [
  { label: 'Layout',    subtitle: 'Kanban',             iconBg: 'green', icon: IconKanban,          aiPrompt: 'How can I adjust the layout?'   },
  { label: 'Filter',    subtitle: 'Filter',              iconBg: 'blue',  icon: IconFunnel,           aiPrompt: 'How can I filter this view?'    },
  { label: 'Sort',      subtitle: 'Sort',               iconBg: 'gray',  icon: IconArrowsDownUp,     aiPrompt: 'How can I sort this view?'      },
  { label: 'Columns',   subtitle: 'Group by',           iconBg: 'gray',  icon: IconVerticalBlocks,   aiPrompt: 'How can I group my columns?'    },
  { label: 'Swimlanes', subtitle: 'Swimlanes',           iconBg: 'gray',  icon: IconHorizontalBlocks, aiPrompt: 'How can I add swimlanes?'       },
]

const LAYOUT_ICONS: Record<string, MiroIcon> = {
  Table: IconTable,
  Kanban: IconKanban,
  Timeline: IconTimelineFormat,
}

const FIELD_TYPE_ICONS: Record<FieldType, MiroIcon> = {
  text:     IconTextT,
  number:   IconNumber,
  currency: IconDollarSignCurrency,
  avatars:  IconOffice,
  status:   IconTickCircle,
  person:   IconTextT,
  date:     IconTextT,
}


const DROPDOWN_WIDTH = 176 // approximate width of the layout dropdown in px

function filterSubtitle(conditions: FilterCondition[]): string {
  if (conditions.length === 0) return 'Filter'
  if (conditions.length === 1) return `Filtered by ${conditions[0].field}`
  return `${conditions.length} filters applied`
}

interface SidePanelProps {
  onClose: () => void
  fields: FieldDefinition[]
}

export function SidePanel({ onClose, fields }: SidePanelProps) {
  const [activePage, setActivePage] = useState<ActivePage>(null)
  const [selectedLayout, setSelectedLayout] = useState('Kanban')
  const [layoutAlignOffset, setLayoutAlignOffset] = useState(0)
  const [layoutOpen, setLayoutOpen] = useState(false)

  const [scrolled, setScrolled] = useState(false)
  const [hiddenFields, setHiddenFields] = useState<Set<string>>(new Set())

  const toggleFieldVisibility = (fieldId: string) => {
    setHiddenFields(prev => {
      const next = new Set(prev)
      if (next.has(fieldId)) next.delete(fieldId)
      else next.add(fieldId)
      return next
    })
  }

  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([])
  const [filterActivating, setFilterActivating] = useState(false)
  const [filterDeactivating, setFilterDeactivating] = useState(false)

  const handleFilterAdd = () =>
    setFilterConditions((prev) => [...prev, defaultCondition()])

  const handleFilterChange = (id: string, patch: Partial<FilterCondition>) =>
    setFilterConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    )

  const handleFilterDuplicate = (id: string) =>
    setFilterConditions((prev) => {
      const idx = prev.findIndex((c) => c.id === id)
      if (idx === -1) return prev
      const copy = { ...prev[idx], id: crypto.randomUUID() }
      return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)]
    })

  const handleFilterDelete = (id: string) =>
    setFilterConditions((prev) => prev.filter((c) => c.id !== id))

  const handleAiSubmit = (value: string) => {
    const result = parseFilterCommand(value, filterConditions)
    if (result !== null) {
      const turningOff = filterConditions.length > 0 && result.length === 0
      setFilterConditions(result)
      if (turningOff) {
        setFilterDeactivating(true)
        setTimeout(() => setFilterDeactivating(false), 600)
      } else {
        setFilterActivating(true)
        setTimeout(() => setFilterActivating(false), 700)
      }
    }
  }

  const handleLayoutMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const offset = Math.max(0, Math.min(clickX - DROPDOWN_WIDTH / 2, rect.width - DROPDOWN_WIDTH))
    setLayoutAlignOffset(offset)
  }

  const aiPrompt = activePage ? activePage.aiPrompt : 'How can I help set up this view?'

  return (
    <div className="relative flex flex-col bg-white h-full w-full overflow-hidden">

      {/* Backdrop — swallows the first outside click so it only closes the dropdown */}
      {layoutOpen && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 100 }}
          onClick={() => setLayoutOpen(false)}
        />
      )}

      {/* Header bar */}
      <div
        className="flex items-center justify-between shrink-0 bg-white z-10"
        style={{
          padding: '8px 8px 8px 16px',
          boxShadow: `inset 0 -1px 0 0 rgba(241, 242, 245, ${scrolled ? 1 : 0})`,
          transition: 'box-shadow 200ms',
        }}
      >
        {activePage ? (
          <button
            className="flex items-center gap-1 h-8 px-2 -ml-2 rounded-md text-[#222428] hover:bg-[#F1F2F5] transition-colors duration-150"
            onClick={() => setActivePage(null)}
          >
            <IconChevronLeft size="small" />
            <span className="font-heading font-semibold leading-none" style={{ fontSize: '14px' }}>
              {activePage.parent}
            </span>
          </button>
        ) : (
          <span className="font-heading font-semibold leading-none text-[#222428]" style={{ fontSize: '14px' }}>
            Settings
          </span>
        )}
        <IconButton aria-label="Close panel" variant="ghost" size="large" onPress={onClose}>
          <IconCross />
        </IconButton>
      </div>

      {/* Scrollable content */}
      <div className="flex flex-col gap-8 overflow-y-auto px-4 pt-14 pb-28 panel-scroll" onScroll={e => setScrolled(e.currentTarget.scrollTop > 0)}>

        {!activePage && (
          <>
            {/* View settings */}
            <div className="flex flex-col w-full item-enter" style={{ animationDelay: '240ms' }}>
              <SectionHeader label="View" />
              {viewSettings.map((item) =>
                item.label === 'Layout' ? (
                  <DropdownMenu key={item.label} open={layoutOpen} onOpen={() => setLayoutOpen(true)} onClose={() => setLayoutOpen(false)}>
                    <DropdownMenu.Trigger asChild>
                      <div onMouseDown={handleLayoutMouseDown}>
                        <SettingCell
                          icon={LAYOUT_ICONS[selectedLayout] || IconKanban}
                          label={item.label}
                          subtitle={selectedLayout}
                          iconBg={item.iconBg}
                          pressed={layoutOpen}
                        />
                      </div>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content side="bottom" align="start" alignOffset={layoutAlignOffset} css={{ zIndex: 200 }}>
                        <DropdownMenu.RadioGroup value={selectedLayout} onChange={setSelectedLayout}>
                          <DropdownMenu.RadioItem value="Table" closeOnSelect>
                            <DropdownMenu.IconSlot><IconTable /></DropdownMenu.IconSlot>
                            Table
                          </DropdownMenu.RadioItem>
                          <DropdownMenu.RadioItem value="Kanban" closeOnSelect>
                            <DropdownMenu.IconSlot><IconKanban /></DropdownMenu.IconSlot>
                            Kanban
                          </DropdownMenu.RadioItem>
                          <DropdownMenu.RadioItem value="Timeline" closeOnSelect>
                            <DropdownMenu.IconSlot><IconTimelineFormat /></DropdownMenu.IconSlot>
                            Timeline
                          </DropdownMenu.RadioItem>
                        </DropdownMenu.RadioGroup>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu>
                ) : (
                  <SettingCell
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    subtitle={item.label === 'Filter' ? filterSubtitle(filterConditions) : item.subtitle}
                    iconBg={
                      item.label === 'Filter'
                        ? filterConditions.length > 0 ? 'blue' : 'gray'
                        : item.iconBg
                    }
                    activating={item.label === 'Filter' ? filterActivating : undefined}
                    deactivating={item.label === 'Filter' ? filterDeactivating : undefined}
                    onClick={() => setActivePage({ name: item.label, parent: 'View settings', aiPrompt: item.aiPrompt })}
                  />
                )
              )}
            </div>

            {/* Fields */}
            <div className="flex flex-col w-full item-enter" style={{ animationDelay: '320ms' }}>
              <SectionHeader label="Fields" showActions />
              {[...fields].sort((a, b) => {
                const aHidden = hiddenFields.has(a.id) ? 1 : 0
                const bHidden = hiddenFields.has(b.id) ? 1 : 0
                return aHidden - bHidden
              }).map((field) => (
                <FieldRow
                  key={field.id}
                  icon={FIELD_TYPE_ICONS[field.type]}
                  label={field.label}
                  isPrimary={field.isPrimary}
                  visible={!hiddenFields.has(field.id)}
                  onToggleVisibility={() => toggleFieldVisibility(field.id)}
                  onEdit={() => setActivePage({ name: field.label, parent: 'Fields', aiPrompt: 'How can I customize this field?' })}
                />
              ))}
            </div>
          </>
        )}

        {activePage?.name === 'Filter' && (
          <div className="item-enter" style={{ animationDelay: '240ms' }}>
            <FilterPage
              conditions={filterConditions}
              onAdd={handleFilterAdd}
              onChange={handleFilterChange}
              onDuplicate={handleFilterDuplicate}
              onDelete={handleFilterDelete}
            />
          </div>
        )}

      </div>

      {/* AI bar */}
      <div className="absolute bottom-8 left-4 right-4">
        <AiBar placeholder={aiPrompt} onSubmit={handleAiSubmit} />
      </div>

    </div>
  )
}
