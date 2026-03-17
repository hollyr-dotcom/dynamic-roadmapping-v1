const JIRA_LOGO = 'https://www.figma.com/api/mcp/asset/f169e443-27f1-401b-994d-4f720c63f0c7'

interface JiraIdCellProps {
  value: string
}

export function JiraIdCell({ value }: JiraIdCellProps) {
  return (
    <span className="flex items-center font-body text-[#222428] whitespace-nowrap" style={{ fontSize: '14px', gap: 8 }}>
      <img src={JIRA_LOGO} alt="Jira" style={{ width: 20, height: 20, flexShrink: 0, objectFit: 'contain' }} />
      {value}
    </span>
  )
}
