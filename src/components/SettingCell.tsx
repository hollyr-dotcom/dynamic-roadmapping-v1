import React from 'react'

interface SettingCellProps {
  icon: React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>
  label: string
  subtitle: string
  iconBg: 'green' | 'blue' | 'gray'
}

const iconBgClass = {
  green: 'bg-[#0FA83C] text-white',
  blue:  'bg-[#3859FF] text-white',
  gray:  'bg-[#F1F2F5] text-[#222428]',
} as const

export function SettingCell({ icon: Icon, label, subtitle, iconBg }: SettingCellProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl w-full cursor-pointer transition-colors duration-150 hover:bg-[#F7F8FA]">
      <div className={`flex items-center p-2 rounded-lg shrink-0 transition-transform duration-150 hover:scale-105 ${iconBgClass[iconBg]}`}>
        <Icon size="medium" />
      </div>
      <div className="flex flex-col items-start justify-center pb-1">
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
    </div>
  )
}
