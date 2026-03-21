import { IconSocialJira } from '@mirohq/design-system'

interface JiraIdCellProps {
  value: string
}

export function JiraIdCell({ value }: JiraIdCellProps) {
  return (
    <span className="flex items-center font-body text-[#222428] whitespace-nowrap" style={{ fontSize: '14px', gap: 8 }}>
      <IconSocialJira css={{ width: 18, height: 18, flexShrink: 0 }} />
      {value}
    </span>
  )
}
