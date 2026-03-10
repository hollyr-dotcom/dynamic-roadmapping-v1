import { Button, IconArrowsOutSimple, IconArrowsInSimple } from '@mirohq/design-system'

interface CanvasPillButtonProps {
  canvasOpen: boolean
  onToggle: () => void
  leftWidth: number
  rightWidth: number
  visible: boolean
  onHoverChange: (hovered: boolean) => void
  pageTitle: string
}

export function CanvasPillButton({ canvasOpen, onToggle, leftWidth, rightWidth, visible, onHoverChange, pageTitle }: CanvasPillButtonProps) {
  return (
    <div
      className="fixed top-3 flex justify-center pointer-events-none transition-[left,right] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        zIndex: 110,
        left: leftWidth,
        right: rightWidth,
      }}
    >
      <div
        className="pointer-events-auto transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
      >
        <Button
          variant="ghost"
          size="medium"
          rounded
          onPress={onToggle}
          css={{
            background: canvasOpen ? '#FFFFFF' : '#F1F2F5',
            boxShadow: canvasOpen ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
            transition: 'background 150ms ease, box-shadow 150ms ease',
            '&:hover': {
              background: canvasOpen ? '#F7F8FA' : '#E6E9EF',
            },
          }}
        >
          <Button.IconSlot>
            {canvasOpen ? <IconArrowsOutSimple /> : <IconArrowsInSimple />}
          </Button.IconSlot>
          <Button.Label>{canvasOpen ? `Go to ${pageTitle}` : 'Go to canvas'}</Button.Label>
        </Button>
      </div>
    </div>
  )
}
