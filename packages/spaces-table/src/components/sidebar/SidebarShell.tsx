import { IconButton, IconCross } from '@mirohq/design-system'

interface SidebarShellProps {
  side: 'left' | 'right'
  onClose: () => void
  showClose?: boolean
  width?: number
  children: React.ReactNode
}

export function SidebarShell({ side, onClose, showClose = true, width = 320, children }: SidebarShellProps) {
  return (
    <div
      className={`relative flex flex-col shrink-0 h-full bg-white overflow-hidden ${
        side === 'right' ? 'border-l' : 'border-r'
      } border-[#F1F2F5]`}
      style={{ width }}
    >
      {showClose && (
        <div className="absolute top-2 right-2 z-10">
          <IconButton
            aria-label="Close panel"
            variant="ghost"
            size="large"
            onPress={onClose}
          >
            <IconCross />
          </IconButton>
        </div>
      )}
      {children}
    </div>
  )
}
