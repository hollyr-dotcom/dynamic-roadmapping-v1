import { useEffect, useState } from 'react'
import { IconCheckMark } from '@mirohq/design-system'

interface AgentAddedSnackbarProps {
  agentName: string
  spaceName: string
  onDismiss: () => void
}

const LINGER_MS = 4000
const EXIT_MS = 300

export function AgentAddedSnackbar({ agentName, spaceName, onDismiss }: AgentAddedSnackbarProps) {
  const [exiting, setExiting] = useState(false)

  const dismiss = () => {
    if (exiting) return
    setExiting(true)
    setTimeout(onDismiss, EXIT_MS)
  }

  useEffect(() => {
    const timer = setTimeout(dismiss, LINGER_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      style={{
        animation: exiting
          ? `toastSlideDown ${EXIT_MS}ms ease forwards`
          : 'toastSlideUp 0.25s ease',
      }}
    >
      <div
        className="flex items-center gap-2"
        style={{
          height: 48,
          paddingLeft: 14,
          paddingRight: 16,
          backgroundColor: '#2B2D33',
          border: '1px solid #3D3F47',
          borderRadius: 8,
          boxShadow: '0px 0px 12px 0px rgba(34,36,40,0.04), 0px 2px 8px 0px rgba(34,36,40,0.12)',
        }}
      >
        <IconCheckMark size="small" color="icon-neutrals-inverted" />
        <span
          className="text-[14px] text-white whitespace-nowrap"
          style={{ fontFamily: "'Noto Sans', sans-serif" }}
        >
          <span className="font-semibold">{agentName}</span> agent added to {spaceName}
        </span>
      </div>
    </div>
  )
}
