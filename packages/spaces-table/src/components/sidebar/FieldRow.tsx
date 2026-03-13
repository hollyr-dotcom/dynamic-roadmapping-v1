import React from 'react'
import { IconPen, IconDotsSixVertical, IconEyeOpen, IconEyeClosed, IconButton } from '@mirohq/design-system'

interface FieldRowProps {
  icon: React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>
  label: string
  isPrimary?: boolean
  visible?: boolean
  onToggleVisibility?: () => void
  onEdit?: () => void
  onClick?: () => void
}

export function FieldRow({ icon: Icon, label, isPrimary = false, visible = true, onToggleVisibility, onEdit, onClick }: FieldRowProps) {
  return (
    <div className="group flex items-center justify-between pl-4 pr-2 py-3 rounded-xl w-full cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-4">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 transition-colors duration-150 ${
            visible
              ? 'bg-[#F2F4FC] text-[#2B4DF8] group-hover:bg-[#E8ECFC] group-active:bg-[#D9DFFC]'
              : 'bg-[#F1F2F5] text-[#7D8297] group-hover:bg-[#E6E6E6]'
          }`}
        >
          <div style={{ width: 20, height: 20 }} className="flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
            <Icon size="medium" />
          </div>
        </div>
        <div className="flex flex-col items-start justify-center gap-[2px]">
          <span
            className={`font-heading font-semibold leading-[1.5] ${visible ? 'text-[#222428]' : 'text-[#7D8297]'}`}
            style={{ fontSize: '14px' }}
          >
            {label}
          </span>
          {isPrimary && (
            <span
              className="font-body text-[#656B81] leading-none"
              style={{ fontSize: '12px', fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
            >
              Primary field
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div className="text-[#222428] flex items-center justify-center w-8 h-8">
            <IconDotsSixVertical size="small" />
          </div>
          <IconButton
            aria-label="Edit field"
            variant="ghost"
            size="medium"
            onPress={() => {
              onEdit?.()
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <IconPen />
          </IconButton>
        </div>
        <div className={`${!visible ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-150`}>
          <IconButton
            aria-label={visible ? 'Hide field' : 'Show field'}
            variant="ghost"
            size="medium"
            onPress={() => {
              onToggleVisibility?.()
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {visible ? <IconEyeOpen /> : <IconEyeClosed />}
          </IconButton>
        </div>
      </div>
    </div>
  )
}
