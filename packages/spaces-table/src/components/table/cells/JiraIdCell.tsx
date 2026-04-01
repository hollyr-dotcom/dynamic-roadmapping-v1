import { JiraLogo } from '../../JiraLogo'

interface JiraIdCellProps {
  value: string
}

export function JiraIdCell({ value }: JiraIdCellProps) {
  if (!value) return null
  return (
    <span className="flex items-center font-body text-[#222428] whitespace-nowrap" style={{ fontSize: '14px', gap: 8 }}>
      <JiraLogo size={18} />
      {value}
    </span>
  )
}
