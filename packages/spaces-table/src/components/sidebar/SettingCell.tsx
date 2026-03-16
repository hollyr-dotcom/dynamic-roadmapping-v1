import React, { useRef } from 'react'
import { IconChevronRight, IconChevronDown } from '@mirohq/design-system'

interface SettingCellProps {
  icon: React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>
  label: string
  subtitle: string
  iconBg: 'green' | 'blue' | 'gray'
  activating?: boolean
  deactivating?: boolean
  pressed?: boolean
  onClick?: () => void
}

// Icon container: idle bg + text color
const idleIconContainer = {
  green: 'text-[#2B4DF8]',
  blue:  'text-[#2B4DF8]',
  gray:  'text-[#222428]',
} as const

const idleIconBg = {
  green: '#F2F4FC',
  blue:  '#F2F4FC',
  gray:  '#F1F2F5',
} as const

const hoverIconBg = {
  green: '#E8ECFC',
  blue:  '#E8ECFC',
  gray:  '#E6E6E6',
} as const

const pressedIconBg = {
  green: '#D9DFFC',
  blue:  '#D9DFFC',
  gray:  '#E6E6E6',
} as const

export function SettingCell({ icon: Icon, label: _label, subtitle, iconBg, activating, deactivating, pressed, onClick }: SettingCellProps) {
  const ChevronIcon = iconBg === 'green' ? IconChevronDown : IconChevronRight
  const iconRef = useRef<HTMLDivElement>(null)

  const setIconBg = (color: string) => {
    if (iconRef.current) iconRef.current.style.backgroundColor = color
  }

  const bg = pressed ? pressedIconBg[iconBg] : idleIconBg[iconBg]

  return (
    <div
      className="group relative overflow-hidden flex items-center gap-4 pl-4 pr-2 py-3 rounded-xl w-full cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => { if (!pressed) setIconBg(hoverIconBg[iconBg]) }}
      onMouseLeave={() => { if (!pressed) setIconBg(idleIconBg[iconBg]) }}
      onMouseDown={() => { setIconBg(pressedIconBg[iconBg]) }}
      onMouseUp={() => { setIconBg(hoverIconBg[iconBg]) }}
    >
      {activating && (
        <div
          className="absolute inset-0 pointer-events-none filter-cell-wash"
          style={{ background: 'rgba(66, 98, 255, 0.08)' }}
        />
      )}
      <div
        ref={iconRef}
        className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 transition-colors duration-150 ${idleIconContainer[iconBg]}`}
        style={{
          backgroundColor: bg,
          transition: `background-color ${(activating || deactivating) ? '500ms' : '150ms'} ease, color ${deactivating ? '500ms' : '150ms'} ease`,
        }}
      >
        <div style={{ width: 20, height: 20 }} className="flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
          <Icon size="medium" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <span
          className="font-heading font-semibold text-[#222428] leading-[1.5]"
          style={{ fontSize: '14px' }}
        >
          {subtitle}
        </span>
      </div>
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[#7D8297] flex items-center justify-center w-8 h-8" style={{ marginTop: iconBg === 'green' ? '-1px' : '0px' }}>
        <ChevronIcon size="small" />
      </div>
    </div>
  )
}
