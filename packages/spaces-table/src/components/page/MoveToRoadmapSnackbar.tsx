import { useEffect, useState } from 'react'
import { IconCheckMark } from '@mirohq/design-system'

interface MoveToRoadmapSnackbarProps {
  onAction: () => void
  onDismiss: () => void
}

const LINGER_MS = 6000
const EXIT_MS = 300

export function MoveToRoadmapSnackbar({ onAction, onDismiss }: MoveToRoadmapSnackbarProps) {
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

  const handleAction = () => {
    onAction()
    dismiss()
  }

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
        className="relative flex items-center overflow-hidden"
        style={{
          height: 48,
          paddingLeft: 12,
          paddingRight: 4,
          backgroundColor: '#2B2D33',
          border: '1px solid #7D8297',
          borderRadius: 8,
          boxShadow: '0px 0px 12px 0px rgba(34,36,40,0.04), 0px 2px 8px 0px rgba(34,36,40,0.12)',
        }}
      >
        {/* Content row */}
        <div className="flex items-center gap-2 pr-3">
          <IconCheckMark size="small" color="icon-neutrals-inverted" />
          <span
            className="text-[14px] text-white whitespace-nowrap"
            style={{ fontFamily: "'Noto Sans', sans-serif" }}
          >
            Record moved to roadmap
          </span>
        </div>

        <button
          onClick={handleAction}
          className="shrink-0 px-3 h-8 rounded text-[14px] font-semibold text-white whitespace-nowrap hover:bg-white/10 transition-colors"
          style={{ fontFamily: "'Noto Sans', sans-serif" }}
        >
          Open roadmap
        </button>

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 h-1"
          style={{
            backgroundColor: '#3859FF',
            borderBottomLeftRadius: 7,
            animation: `snackbarProgress ${LINGER_MS}ms linear forwards`,
          }}
        />
      </div>
    </div>
  )
}
