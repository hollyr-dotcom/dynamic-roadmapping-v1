import { IconPlus, IconDotsThreeVertical } from '@mirohq/design-system'

interface SectionHeaderProps {
  label: string
  showActions?: boolean
}

export function SectionHeader({ label, showActions = false }: SectionHeaderProps) {
  return (
    <div className={`flex h-10 items-center justify-between w-full pl-4 ${showActions ? 'pr-2' : 'pr-4'}`}>
      <div className="flex flex-1 items-center h-full rounded-lg">
        <span
          className="font-heading font-semibold text-[#7D8297] leading-[1.4]"
          style={{ fontSize: '14px' }}
        >
          {label}
        </span>
      </div>
      {showActions && (
        <div className="flex items-center text-[#222428]">
          <button className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[#F1F2F5]">
            <IconPlus size="small" />
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[#F1F2F5]">
            <IconDotsThreeVertical size="small" />
          </button>
        </div>
      )}
    </div>
  )
}
