import React from 'react'
import { IconPen, IconDotsSixVertical } from '@mirohq/design-system'

interface FieldRowProps {
  icon: React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>
  label: string
  isPrimary?: boolean
}

export function FieldRow({ icon: Icon, label, isPrimary = false }: FieldRowProps) {
  return (
    <div className="flex items-center justify-between pl-4 pr-2 py-4 bg-white rounded-xl w-full">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F1F2F5] text-[#222428] shrink-0">
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
              className="font-body text-[#222428] leading-none"
              style={{ fontSize: '12px' }}
            >
              Primary field
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 opacity-0 text-[#222428]">
        <IconPen size="small" />
        <IconDotsSixVertical size="small" />
      </div>
    </div>
  )
}
