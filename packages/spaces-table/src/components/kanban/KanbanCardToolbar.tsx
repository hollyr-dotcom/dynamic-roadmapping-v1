import { useLayoutEffect, useRef, useState } from 'react'
import { IconButton, IconArrowsOutSimple, IconChatLinesTwo, IconRocket, IconPlusBox, IconDotsThreeVertical, IconSparksFilled, Tooltip } from '@mirohq/design-system'

interface KanbanCardToolbarProps {
  onOpenSidePanel: () => void
  onAddToBoard?: () => void
  onMoveToRoadmap?: () => void
  onOpenSidekick?: () => void
  cardColor?: string
}

export function KanbanCardToolbar({ onOpenSidePanel, onAddToBoard, onMoveToRoadmap, onOpenSidekick, cardColor }: KanbanCardToolbarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offsetX, setOffsetX] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const margin = 8
    if (rect.left < margin) {
      setOffsetX(margin - rect.left)
    } else if (rect.right > window.innerWidth - margin) {
      setOffsetX(window.innerWidth - margin - rect.right)
    }
  }, [])

  return (
    <div
      ref={ref}
      data-card-toolbar
      className="absolute z-50 flex items-center gap-1 p-1"
      style={{
        bottom: 'calc(100% + 16px)',
        left: '50%',
        transform: `translateX(calc(-50% + ${offsetX}px))`,
        backgroundColor: 'white',
        borderRadius: 8,
        boxShadow: '0px 2px 8px rgba(34,36,40,0.12)',
        animation: 'toolbarEnter 150ms ease',
        pointerEvents: 'auto',
      }}
      onClick={e => e.stopPropagation()}
      onPointerDown={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
    >
      <Tooltip>
        <Tooltip.Trigger asChild>
          <IconButton aria-label="Open in side panel" variant="ghost" size="medium" onPress={onOpenSidePanel}>
            <IconArrowsOutSimple />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" sideOffset={4}>Open in side panel</Tooltip.Content>
      </Tooltip>

      <Tooltip>
        <Tooltip.Trigger asChild>
          <IconButton aria-label="Open comments" variant="ghost" size="medium">
            <IconChatLinesTwo />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" sideOffset={4}>Open comments</Tooltip.Content>
      </Tooltip>

      {onOpenSidekick && (
        <Tooltip>
          <Tooltip.Trigger asChild>
            <IconButton aria-label="Ask Sidekick" variant="ghost" size="medium" onPress={onOpenSidekick}>
              <IconSparksFilled />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content side="top" sideOffset={4}>Ask Sidekick</Tooltip.Content>
        </Tooltip>
      )}

      {onAddToBoard && (
        <Tooltip>
          <Tooltip.Trigger asChild>
            <IconButton aria-label="Work on this" variant="ghost" size="medium" onPress={onAddToBoard}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12.833 0.667C12.833 2.047 13.952 3.167 15.333 3.167V4.167C13.952 4.167 12.833 5.286 12.833 6.667H11.833C11.833 5.286 10.714 4.167 9.333 4.167V3.167C10.714 3.167 11.833 2.047 11.833 0.667H12.833Z" fill="currentColor"/><path d="M3.108 15.071L4.458 15.454C6.112 12.554 9.272 10.788 12.61 10.898L13.008 9.492L3.425 2.548L2.03 3.327L3.108 15.071ZM10.955 9.65C8.351 9.997 5.958 11.327 4.29 13.356L3.45 4.213L10.955 9.65Z" fill="currentColor"/></svg>
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content side="top" sideOffset={4}>Work on this</Tooltip.Content>
        </Tooltip>
      )}

      {onMoveToRoadmap && (
        <Tooltip>
          <Tooltip.Trigger asChild>
            <IconButton aria-label="Move to roadmap" variant="ghost" size="medium" onPress={onMoveToRoadmap}>
              <IconRocket />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content side="top" sideOffset={4}>Move to roadmap</Tooltip.Content>
        </Tooltip>
      )}

      <Tooltip>
        <Tooltip.Trigger asChild>
          <IconButton aria-label="Card color" variant="ghost" size="medium">
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: cardColor ?? 'linear-gradient(135deg, #FF8C82, #FFB74D)', border: '1.5px solid rgba(0,0,0,0.12)' }} />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" sideOffset={4}>Card color</Tooltip.Content>
      </Tooltip>

      <Tooltip>
        <Tooltip.Trigger asChild>
          <IconButton aria-label="More" variant="ghost" size="medium">
            <IconDotsThreeVertical />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" sideOffset={4}>More</Tooltip.Content>
      </Tooltip>
    </div>
  )
}
