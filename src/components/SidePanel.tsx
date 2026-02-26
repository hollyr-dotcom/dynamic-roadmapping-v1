import React from 'react'
import {
  IconCross,
  IconKanban,
  IconFunnel,
  IconArrowsDownUp,
  IconVerticalBlocks,
  IconHorizontalBlocks,
  IconTextT,
  IconTextLinesThree,
  IconTickCircle,
  IconUser,
  IconSparks,
} from '@mirohq/design-system'
import { SectionHeader } from './SectionHeader'
import { SettingCell } from './SettingCell'
import { FieldRow } from './FieldRow'

type MiroIcon = React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>

const viewSettings: { label: string; subtitle: string; iconBg: 'green' | 'blue' | 'gray'; icon: MiroIcon }[] = [
  { label: 'Layout',    subtitle: 'Kanban',                 iconBg: 'green', icon: IconKanban          },
  { label: 'Filter',    subtitle: '24 of 48 items showing', iconBg: 'blue',  icon: IconFunnel           },
  { label: 'Sort',      subtitle: 'Sorted by Priority',     iconBg: 'blue',  icon: IconArrowsDownUp     },
  { label: 'Columns',   subtitle: 'Grouped by Status',      iconBg: 'blue',  icon: IconVerticalBlocks   },
  { label: 'Swimlanes', subtitle: 'Add a group',            iconBg: 'gray',  icon: IconHorizontalBlocks },
]

const fields: { label: string; icon: MiroIcon; isPrimary: boolean }[] = [
  { label: 'Title',       icon: IconTextT,        isPrimary: true  },
  { label: 'Description', icon: IconTextLinesThree, isPrimary: false },
  { label: 'Status',      icon: IconTickCircle,   isPrimary: false },
  { label: 'Person',      icon: IconUser,         isPrimary: false },
]

export function SidePanel() {
  return (
    <div className="relative flex flex-col bg-white rounded-xl h-full w-[400px] overflow-hidden shadow-[0px_12px_32px_0px_rgba(34,36,40,0.2),0px_0px_8px_0px_rgba(34,36,40,0.06)]">

      {/* Close button */}
      <button className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-md z-10 text-[#6F7489] hover:text-[#222428] hover:bg-[#F1F2F5] transition-colors duration-150">
        <IconCross size="medium" />
      </button>

      {/* Scrollable content */}
      <div className="flex flex-col gap-8 overflow-y-auto px-4 pt-16 pb-28 panel-scroll">

        {/* Header */}
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

        {/* View settings */}
        <div className="flex flex-col gap-2 w-full item-enter" style={{ animationDelay: '240ms' }}>
          <SectionHeader label="View settings" />
          {viewSettings.map((item) => (
            <SettingCell key={item.label} {...item} />
          ))}
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-2 w-full item-enter" style={{ animationDelay: '320ms' }}>
          <SectionHeader label="Fields" showActions />
          {fields.map((item) => (
            <FieldRow key={item.label} {...item} />
          ))}
        </div>

      </div>

      {/* AI bar */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-between pl-7 pr-6 bg-[#F7F7F7] rounded-full border-4 border-white h-16 w-[352px] shadow-[0px_12px_32px_0px_rgba(34,36,40,0.2),0px_0px_8px_0px_rgba(34,36,40,0.06)] item-enter cursor-text"
        style={{ animationDelay: '400ms' }}
      >
        <span
          className="font-body text-[#6F7489]"
          style={{ fontSize: '16px' }}
        >
          How can I help set up this view?
        </span>
        <div className="text-[#3859FF] shrink-0 sparks-pulse">
          <IconSparks size="medium" />
        </div>
      </div>

    </div>
  )
}
