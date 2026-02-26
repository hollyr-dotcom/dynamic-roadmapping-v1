import { type LucideIcon } from 'lucide-react'

interface SettingCellProps {
  icon: LucideIcon
  label: string
  subtitle: string
  iconBg: 'green' | 'blue' | 'gray'
}

const iconBgClass = {
  green: 'bg-[#0FA83C]',
  blue:  'bg-[#3859FF]',
  gray:  'bg-[#F1F2F5]',
} as const

const iconColorClass = {
  green: 'text-white',
  blue:  'text-white',
  gray:  'text-[#222428]',
} as const

export function SettingCell({ icon: Icon, label, subtitle, iconBg }: SettingCellProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl w-full">
      <div className={`flex items-center p-2 rounded-lg shrink-0 ${iconBgClass[iconBg]}`}>
        <Icon size={24} className={iconColorClass[iconBg]} />
      </div>
      <div className="flex flex-col items-start justify-center pb-1">
        <span
          className="font-heading font-semibold text-[#222428] leading-[1.5]"
          style={{ fontSize: '16px' }}
        >
          {label}
        </span>
        <span
          className="font-body text-[#222428] leading-none"
          style={{ fontSize: '12px' }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  )
}
