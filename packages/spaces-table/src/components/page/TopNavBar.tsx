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
    tooltipTimer.current = setTimeout(() => setTooltipOpen(false), 2000)
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

        <div className="flex items-center mr-1">
          {([
            { bg: '#FFF0C2', fg: '#A07800' },
            { bg: '#EDE0FF', fg: '#7C3AED' },
            { bg: '#D1FAE5', fg: '#059669' },
          ]).map(({ bg, fg }, i) => (
            <div
              key={i}
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                border: '3px solid #FFFFFF',
                marginLeft: i > 0 ? '-8px' : 0,
                zIndex: 3 - i,
                position: 'relative',
                background: bg,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="8" r="4" fill={fg} />
                <path d="M3 21c0-4.418 3.582-8 8-8s8 3.582 8 8" fill={fg} />
              </svg>
            </div>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <Tooltip>
            <Tooltip.Trigger asChild>
              <Button size="medium">Share</Button>
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom">Share space with your team</Tooltip.Content>
          </Tooltip>
          {tooltipOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: 8,
              padding: '6px 12px',
              backgroundColor: '#050038',
              color: 'white',
              borderRadius: 6,
              fontSize: 13,
              fontFamily: 'Open Sans, sans-serif',
              whiteSpace: 'nowrap',
              zIndex: 9999,
              pointerEvents: 'none',
            }}>
              Share space with your team
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
