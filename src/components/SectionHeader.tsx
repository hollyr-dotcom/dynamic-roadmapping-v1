import { Plus, MoreVertical } from 'lucide-react'

interface SectionHeaderProps {
  label: string
  showActions?: boolean
}

export function SectionHeader({ label, showActions = false }: SectionHeaderProps) {
  return (
    <div className="flex h-10 items-center justify-between w-full">
      <div className="flex flex-1 items-center h-full rounded-lg">
        <span
          className="font-heading font-semibold text-[#222428] leading-[1.4]"
          style={{ fontSize: '14px' }}
        >
          {label}
        </span>
      </div>
      {showActions && (
        <div className="flex items-center">
          <button className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 text-[#222428]">
            <Plus size={16} />
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 text-[#222428]">
            <MoreVertical size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
