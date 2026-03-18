import { useState, useEffect, useRef } from 'react'
import {
  Button,
  IconButton,
  IconLinesThreeHorizontal,
  IconBell,
  IconChevronRightSmall,
  Tooltip,
} from '@mirohq/design-system'


interface TopNavBarProps {
  borderOpacity: number
  scrollFade: number
  databaseTitle: string
  isMenuOpen: boolean
  onToggleMenu: () => void
  showShareTooltip?: boolean
}

export function TopNavBar({ borderOpacity, scrollFade, databaseTitle, isMenuOpen, onToggleMenu, showShareTooltip = false }: TopNavBarProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!showShareTooltip) return
    setTooltipOpen(true)
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current)
    tooltipTimer.current = setTimeout(() => setTooltipOpen(false), 6000)
  }, [showShareTooltip])

  return (
    <div
      className="flex items-center justify-between bg-white shrink-0"
      style={{
        paddingLeft: '8px',
        paddingRight: '12px',
        paddingTop: '8px',
        paddingBottom: '8px',
        boxShadow: `inset 0 -1px 0 0 rgba(241, 242, 245, ${borderOpacity})`,
      }}
    >
      {/* Left: menu + breadcrumb */}
      <div className="flex items-center gap-2">
        <div
          className="transition-opacity duration-200"
          style={{ opacity: isMenuOpen ? 0 : 1, pointerEvents: isMenuOpen ? 'none' : 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton aria-label="Menu" variant="ghost" size="large" onPress={onToggleMenu}>
            <IconLinesThreeHorizontal />
          </IconButton>
        </div>

        <div
          className="flex items-center transition-opacity duration-200"
          style={{ gap: '2px', opacity: isMenuOpen ? scrollFade : 1, marginLeft: '2px' }}
        >
          <span
            className="font-heading font-semibold text-[#222428] leading-none select-none"
            style={{ fontSize: '14px' }}
          >
            Project Galaxy
          </span>

          <span
            className="flex items-center transition-opacity duration-200"
            style={{ opacity: scrollFade, gap: '2px', color: '#B3B9C4' }}
          >
            <IconChevronRightSmall size="small" />
            <span
              className="font-heading font-semibold text-[#222428] leading-none select-none"
              style={{ fontSize: '14px' }}
            >
              {databaseTitle}
            </span>
          </span>
        </div>
      </div>

      {/* Right: notifications + avatars */}
      <div className="flex items-center gap-2">
        <IconButton
          aria-label="Notifications"
          variant="ghost"
          size="large"
        >
          <IconBell />
        </IconButton>

        <img
          src="/james-rodriguez.png"
          alt="James Rodriguez"
          style={{ width: 32, height: 32, borderRadius: 999, border: '3px solid #FFFFFF', objectFit: 'cover', marginRight: '8px' }}
        />

        {/* @ts-ignore - Tooltip open/onOpenChange props work at runtime */}
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
          <Tooltip.Trigger asChild>
            <Button size="medium">Share</Button>
          </Tooltip.Trigger>
          <Tooltip.Content side="left">Share space with your team</Tooltip.Content>
        </Tooltip>
      </div>
    </div>
  )
}
