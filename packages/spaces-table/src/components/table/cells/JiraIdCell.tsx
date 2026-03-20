const JIRA_LOGO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='98.03%25' x2='58.89%25' y1='0.22%25' y2='40.77%25'%3E%3Cstop offset='18%25' stop-color='%230052CC' stop-opacity='0'/%3E%3Cstop offset='100%25' stop-color='%232684FF'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' x1='100.17%25' x2='55.76%25' y1='0.45%25' y2='44.73%25'%3E%3Cstop offset='18%25' stop-color='%230052CC' stop-opacity='0'/%3E%3Cstop offset='100%25' stop-color='%232684FF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='%232684FF' d='M15.52 1.643h-1.393c0 4.153-3.373 7.527-7.527 7.527v1.393c0 4.153-3.373 7.526-7.527 7.526v1.394c8.58 0 16.447-6.473 16.447-17.84z'/%3E%3Cpath fill='url(%23a)' d='M10.88 6.317H9.487c0 4.153-3.373 7.526-7.527 7.526v1.394c0 4.153-3.373 7.526-7.527 7.526v1.394c8.58 0 16.447-6.473 16.447-17.84z' transform='translate(5.333 5.333)'/%3E%3Cpath fill='url(%23b)' d='M21.16 10.99h-1.393c0 4.154-3.373 7.527-7.527 7.527V19.91c0 4.154-3.373 7.527-7.527 7.527v1.393c8.58 0 16.447-6.473 16.447-17.84z'/%3E%3C/svg%3E"

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
