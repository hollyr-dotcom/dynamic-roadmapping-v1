import React, { useState } from 'react'
import {
  DropdownMenu,
  IconCross,
  IconChevronLeft,
  IconKanban,
  IconTable,
  IconTimelineFormat,
  IconFunnel,
  IconArrowsDownUp,
  IconVerticalBlocks,
  IconHorizontalBlocks,
  IconTextT,
  IconTextLinesThree,
  IconTickCircle,
  IconUser,
} from '@mirohq/design-system'
import { SectionHeader } from './SectionHeader'
import { SettingCell } from './SettingCell'
import { FieldRow } from './FieldRow'
import { FilterPage, defaultCondition } from './FilterPage'
import type { FilterCondition } from './FilterPage'
import { AiBar } from './AiBar'
import { parseFilterCommand } from '../lib/filterParser'

type MiroIcon = React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>

type ActivePage = {
  name: string
  parent: string
  aiPrompt: string
} | null

const viewSettings: { label: string; subtitle: string; iconBg: 'green' | 'blue' | 'gray'; icon: MiroIcon; aiPrompt: string }[] = [
  { label: 'Layout',    subtitle: 'Kanban',                 iconBg: 'green', icon: IconKanban,          aiPrompt: 'How can I adjust the layout?'   },
  { label: 'Filter',    subtitle: 'Add a filter',           iconBg: 'blue',  icon: IconFunnel,           aiPrompt: 'How can I filter this view?'    },
  { label: 'Sort',      subtitle: 'Sorted by Priority',     iconBg: 'blue',  icon: IconArrowsDownUp,     aiPrompt: 'How can I sort this view?'      },
  { label: 'Columns',   subtitle: 'Grouped by Status',      iconBg: 'blue',  icon: IconVerticalBlocks,   aiPrompt: 'How can I group my columns?'    },
  { label: 'Swimlanes', subtitle: 'Add a group',            iconBg: 'gray',  icon: IconHorizontalBlocks, aiPrompt: 'How can I add swimlanes?'       },
]

const fields: { label: string; icon: MiroIcon; isPrimary: boolean; aiPrompt: string }[] = [
  { label: 'Title',       icon: IconTextT,          isPrimary: true,  aiPrompt: 'How can I customize this field?' },
  { label: 'Description', icon: IconTextLinesThree, isPrimary: false, aiPrompt: 'How can I customize this field?' },
  { label: 'Status',      icon: IconTickCircle,     isPrimary: false, aiPrompt: 'How can I customize this field?' },
  { label: 'Person',      icon: IconUser,           isPrimary: false, aiPrompt: 'How can I customize this field?' },
]


const DROPDOWN_WIDTH = 176 // approximate width of the layout dropdown in px

function filterSubtitle(conditions: FilterCondition[]): string {
  if (conditions.length === 0) return 'Add a filter'
  if (conditions.length === 1) return `Filtered by ${conditions[0].field}`
  return `${conditions.length} filters applied`
}

export function SidePanel() {
  const [activePage, setActivePage] = useState<ActivePage>(null)
  const [selectedLayout, setSelectedLayout] = useState('Kanban')
  const [layoutAlignOffset, setLayoutAlignOffset] = useState(0)
  const [layoutOpen, setLayoutOpen] = useState(false)

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
    <div className="relative flex flex-col bg-white rounded-xl h-full w-[400px] overflow-hidden shadow-[0px_12px_32px_0px_rgba(34,36,40,0.2),0px_0px_8px_0px_rgba(34,36,40,0.06)]">

      {/* Backdrop — swallows the first outside click so it only closes the dropdown */}
      {layoutOpen && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 100 }}
          onClick={() => setLayoutOpen(false)}
        />
      )}

      {/* Back button (detail page only) */}
      {activePage && (
        <button
          className="absolute top-2 left-2 flex items-center gap-1 h-8 px-2 rounded-md z-10 text-[#222428] hover:bg-[#F1F2F5] transition-colors duration-150"
          onClick={() => setActivePage(null)}
        >
          <IconChevronLeft size="small" />
          <span className="font-heading font-semibold leading-none" style={{ fontSize: '14px' }}>
            {activePage.parent}
          </span>
        </button>
      )}

      {/* Close button */}
      <button className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-md z-10 text-[#222428] hover:bg-[#F1F2F5] transition-colors duration-150">
        <IconCross size="small" />
      </button>

      {/* Scrollable content */}
      <div className="flex flex-col gap-8 overflow-y-auto px-4 pt-16 pb-28 panel-scroll">

        {/* Header — always visible */}
        <div className="flex flex-col gap-1 px-4 item-enter" style={{ animationDelay: '180ms' }}>
          <span
            className="font-heading font-semibold text-[#656B81] leading-[1.4]"
            style={{ fontSize: '14px', fontFeatureSettings: "'ss01' 1" }}
          >
            FlexAI
          </span>
          <span
            className="font-heading font-semibold text-[#222428] leading-[1.4]"
            style={{ fontSize: '20px', fontFeatureSettings: "'ss01' 1" }}
          >
            Backlog
          </span>
        </div>

        {!activePage && (
          <>
            {/* View settings */}
            <div className="flex flex-col w-full item-enter" style={{ animationDelay: '240ms' }}>
              <SectionHeader label="View settings" />
              {viewSettings.map((item) =>
                item.label === 'Layout' ? (
                  <DropdownMenu key={item.label} open={layoutOpen} onOpen={() => setLayoutOpen(true)} onClose={() => setLayoutOpen(false)}>
                    <DropdownMenu.Trigger asChild>
                      <div onMouseDown={handleLayoutMouseDown}>
                        <SettingCell
                          icon={item.icon}
                          label={item.label}
                          subtitle={selectedLayout}
                          iconBg={item.iconBg}
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
              {fields.map((item) => (
                <FieldRow
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  isPrimary={item.isPrimary}
                  onClick={() => setActivePage({ name: item.label, parent: 'Fields', aiPrompt: item.aiPrompt })}
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[352px]">
        <AiBar placeholder={aiPrompt} onSubmit={handleAiSubmit} />
      </div>

    </div>
  )
}
