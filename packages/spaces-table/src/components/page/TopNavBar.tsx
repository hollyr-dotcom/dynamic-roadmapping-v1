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
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!showShareTooltip) return
    setTooltipVisible(true)
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current)
    tooltipTimer.current = setTimeout(() => setTooltipVisible(false), 2000)
    return () => { if (tooltipTimer.current) clearTimeout(tooltipTimer.current) }
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
        <IconButton variant="ghost" size="large" aria-label="Menu" onPress={onToggleMenu}>
          <IconLinesThreeHorizontal />
        </IconButton>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 font-body text-[#222428]" style={{ fontSize: '14px' }}>
          <span style={{ opacity: scrollFade }}>Mirage</span>
          <IconChevronRightSmall css={{ width: 14, height: 14, opacity: scrollFade }} />
          <span>{isMenuOpen ? 'Spaces' : databaseTitle}</span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[
            { label: 'Adam', url: 'https://randomuser.me/api/portraits/men/75.jpg' },
            { label: 'Beth', url: 'https://randomuser.me/api/portraits/women/68.jpg' },
            { label: 'Carl', url: 'https://randomuser.me/api/portraits/men/32.jpg' },
          ].map((a) => (
            <div
              key={a.label}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid white',
                marginLeft: -6,
                flexShrink: 0,
              }}
            >
              <img
                src={a.url}
                alt={a.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>

        <IconButton variant="ghost" size="medium" aria-label="Notifications">
          <IconBell />
        </IconButton>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[
            { icon: (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="3" width="6" height="6" rx="1" stroke="#050038" strokeWidth="1.5"/>
                <rect x="11" y="3" width="6" height="6" rx="1" stroke="#050038" strokeWidth="1.5"/>
                <rect x="3" y="11" width="6" height="6" rx="1" stroke="#050038" strokeWidth="1.5"/>
                <rect x="11" y="11" width="6" height="6" rx="1" stroke="#050038" strokeWidth="1.5"/>
              </svg>
            )},
            { icon: (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="#050038" strokeWidth="1.5"/>
                <path d="M10 6v4l3 2" stroke="#050038" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )},
          ].map((item, i) => (
            <div key={i} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 6 }} className="hover:bg-[#f1f2f5]">
              {item.icon}
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
          {tooltipVisible && (
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
