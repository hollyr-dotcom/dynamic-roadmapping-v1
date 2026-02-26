import React from 'react'
import { IconPen, IconDotsSixVertical } from '@mirohq/design-system'

interface FieldRowProps {
  icon: React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>
  label: string
  isPrimary?: boolean
}

export function FieldRow({ icon: Icon, label, isPrimary = false }: FieldRowProps) {
  return (
    <div className="group flex items-center justify-between pl-4 pr-2 py-4 bg-white rounded-xl w-full cursor-pointer transition-colors duration-150 hover:bg-[#F7F8FA]">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F1F2F5] text-[#222428] shrink-0 transition-colors duration-150 group-hover:bg-[#E9EAEF]">
          <Icon size="medium" />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span
            className="font-heading font-semibold text-[#222428] leading-[1.5]"
            style={{ fontSize: '16px' }}
          >
            {label}
          </span>
          {isPrimary && (
            <span
              className="font-body text-[#656B81] leading-none"
              style={{ fontSize: '12px' }}
            >
              Primary field
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[#6F7489]">
        <IconPen size="small" />
        <IconDotsSixVertical size="small" />
      </div>
    </div>
  )
}
