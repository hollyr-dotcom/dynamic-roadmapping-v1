import React from 'react'
import { IconChevronRight, IconChevronDown } from '@mirohq/design-system'

interface SettingCellProps {
  icon: React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>
  label: string
  subtitle: string
  iconBg: 'green' | 'blue' | 'gray'
}

// Cell background on hover
const hoverCellBg = {
  green: 'hover:bg-[#E3F7EA]',
  blue:  'hover:bg-[#E8ECFC]',
  gray:  'hover:bg-[#F1F2F5]',
} as const

// Icon container: idle bg + text color
const idleIconContainer = {
  green: 'bg-[#0FA83C] text-white',
  blue:  'bg-[#3859FF] text-white',
  gray:  'bg-[#F1F2F5] text-[#222428]',
} as const

// Icon container bg change on hover (gray only darkens)
const hoverIconContainer = {
  green: '',
  blue:  '',
  gray:  'group-hover:bg-[#E0E2E8]',
} as const

// Chevron color matches accent
const chevronColor = {
  green: 'text-[#0FA83C]',
  blue:  'text-[#3859FF]',
  gray:  'text-[#222428]',
} as const

export function SettingCell({ icon: Icon, label, subtitle, iconBg }: SettingCellProps) {
  const ChevronIcon = iconBg === 'green' ? IconChevronDown : IconChevronRight

  return (
    <div className={`group flex items-center gap-4 p-4 bg-white rounded-xl w-full cursor-pointer transition-colors duration-150 ${hoverCellBg[iconBg]}`}>
      <div className={`flex items-center p-2 rounded-lg shrink-0 transition-colors duration-150 ${idleIconContainer[iconBg]} ${hoverIconContainer[iconBg]}`}>
        <Icon size="medium" />
      </div>
      <div className="flex flex-col items-start justify-center pb-1 flex-1 min-w-0">
        <span
          className="font-heading font-semibold text-[#222428] leading-[1.5]"
          style={{ fontSize: '16px' }}
        >
          {label}
        </span>
        <span
          className="font-body text-[#656B81] leading-none"
          style={{ fontSize: '12px' }}
        >
          {subtitle}
        </span>
      </div>
      <div className={`shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${chevronColor[iconBg]}`}>
        <ChevronIcon size="small" />
      </div>
    </div>
  )
}
