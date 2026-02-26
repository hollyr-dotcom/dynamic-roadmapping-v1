import {
  X,
  LayoutGrid,
  Filter,
  ArrowDownUp,
  Columns2,
  Rows3,
  Type,
  AlignLeft,
  CheckCircle,
  User,
  Sparkles,
} from 'lucide-react'
import { SectionHeader } from './SectionHeader'
import { SettingCell } from './SettingCell'
import { FieldRow } from './FieldRow'

const viewSettings = [
  { label: 'Layout',    subtitle: 'Kanban',                 iconBg: 'green' as const, icon: LayoutGrid  },
  { label: 'Filter',    subtitle: '24 of 48 items showing', iconBg: 'blue'  as const, icon: Filter       },
  { label: 'Sort',      subtitle: 'Sorted by Priority',     iconBg: 'blue'  as const, icon: ArrowDownUp  },
  { label: 'Columns',   subtitle: 'Grouped by Status',      iconBg: 'blue'  as const, icon: Columns2     },
  { label: 'Swimlanes', subtitle: 'Add a group',            iconBg: 'gray'  as const, icon: Rows3        },
]

const fields = [
  { label: 'Title',       icon: Type,        isPrimary: true  },
  { label: 'Description', icon: AlignLeft,   isPrimary: false },
  { label: 'Status',      icon: CheckCircle, isPrimary: false },
  { label: 'Person',      icon: User,        isPrimary: false },
]

export function SidePanel() {
  return (
    <div className="relative flex flex-col bg-white rounded-xl h-full w-[400px] overflow-hidden shadow-[0px_12px_32px_0px_rgba(34,36,40,0.2),0px_0px_8px_0px_rgba(34,36,40,0.06)]">

      {/* Close button */}
      <button className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 z-10 text-[#222428]">
        <X size={20} />
      </button>

      {/* Scrollable content */}
      <div className="flex flex-col gap-8 overflow-y-auto px-4 pt-16 pb-28">

        {/* Header */}
        <div className="flex flex-col gap-1 px-4">
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
        <div className="flex flex-col gap-2 w-full">
          <SectionHeader label="View settings" />
          {viewSettings.map((item) => (
            <SettingCell key={item.label} {...item} />
          ))}
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-2 w-full">
          <SectionHeader label="Fields" showActions />
          {fields.map((item) => (
            <FieldRow key={item.label} {...item} />
          ))}
        </div>

      </div>

      {/* AI bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-between pl-7 pr-6 bg-[#F7F7F7] rounded-full border-4 border-white h-16 w-[352px] shadow-[0px_12px_32px_0px_rgba(34,36,40,0.2),0px_0px_8px_0px_rgba(34,36,40,0.06)]">
        <span
          className="font-body text-[#6F7489]"
          style={{ fontSize: '16px' }}
        >
          How can I help set up this view?
        </span>
        <Sparkles size={22} className="text-[#222428] shrink-0" />
      </div>

    </div>
  )
}
