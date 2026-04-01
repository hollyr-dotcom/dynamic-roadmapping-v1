import { useLayoutEffect, useRef, useState } from 'react'
import { IconButton, IconArrowsOutSimple, IconChatLinesTwo, IconMap, IconDotsThreeVertical, IconSparksFilled, Tooltip } from '@mirohq/design-system'

interface KanbanCardToolbarProps {
  onOpenSidePanel: () => void
  onMoveToRoadmap?: () => void
  onOpenSidekick?: () => void
  cardColor?: string
}

export function KanbanCardToolbar({ onOpenSidePanel, onMoveToRoadmap, onOpenSidekick, cardColor }: KanbanCardToolbarProps) {
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

      {onMoveToRoadmap && (
        <Tooltip>
          <Tooltip.Trigger asChild>
            <IconButton aria-label="Move to roadmap" variant="ghost" size="medium" onPress={onMoveToRoadmap}>
              <IconMap />
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
