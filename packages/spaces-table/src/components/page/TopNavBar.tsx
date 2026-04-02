import { useRef, useEffect, useState } from 'react'
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
  spaceName?: string
  isMenuOpen: boolean
  onToggleMenu: () => void
  showSharePopover?: boolean
  onDismissSharePopover?: () => void
}

export function TopNavBar({ borderOpacity, scrollFade, databaseTitle, spaceName, isMenuOpen, onToggleMenu, showSharePopover, onDismissSharePopover }: TopNavBarProps) {
  const shareBtnRef = useRef<HTMLSpanElement>(null)
  const [shareBtnRect, setShareBtnRect] = useState<{ x: number; y: number; right: number } | null>(null)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  useEffect(() => {
    if (showSharePopover && shareBtnRef.current) {
      const r = shareBtnRef.current.getBoundingClientRect()
      setShareBtnRect({ x: r.left + r.width / 2, y: r.bottom, right: r.right })
    }
    if (!showSharePopover) setShareBtnRect(null)
  }, [showSharePopover])

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
            {spaceName || 'Project Galaxy'}
          </span>

          {/* Breadcrumb: chevron + database title — fades in on scroll */}
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
        {/* Notifications */}
        <IconButton
          aria-label="Notifications"
          variant="ghost"
          size="large"
        >
          <IconBell />
        </IconButton>

        {/* Presence avatar */}
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=56&h=56&fit=crop&crop=face"
          alt="User"
          style={{ width: 32, height: 32, borderRadius: 999, border: '3px solid #FFFFFF', objectFit: 'cover', marginRight: '8px' }}
        />

        <span ref={shareBtnRef} className="inline-flex">
          {/* @ts-expect-error -- MDS Tooltip controlled props */}
          <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
            <Tooltip.Trigger asChild>
              <Button size="medium" onPress={() => { if (showSharePopover) onDismissSharePopover?.() }}>Share</Button>
            </Tooltip.Trigger>
            <Tooltip.Content side="left">Share space with your team</Tooltip.Content>
          </Tooltip>
        </span>
      </div>

      {/* Share popover */}
      {showSharePopover && shareBtnRect && (
        <div
          className="import-popover-tip"
          style={{
            position: 'fixed',
            top: shareBtnRect.y + 4,
            right: 12,
            zIndex: 9999,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: shareBtnRect.right ? `${window.innerWidth - shareBtnRect.x - 12 - 2 - 4}px` : 0, marginLeft: 'auto', width: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#44464F' }} />
            <div style={{ width: 1, height: 16, background: '#44464F' }} />
          </div>
          <div
            style={{
              position: 'relative',
              background: '#2B2D33',
              borderRadius: 8,
              padding: '14px 40px 16px 16px',
              color: '#fff',
              width: 280,
              boxShadow: '0 2px 8px rgba(34,36,40,0.12), 0 0 12px rgba(34,36,40,0.04)',
            }}
          >
            <button
              onClick={onDismissSharePopover}
              style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 0, color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <p className="font-heading font-semibold text-[16px] leading-snug mb-1">Share your space</p>
            <p className="font-body text-[14px] leading-snug text-white/60">Invite your team to collaborate.</p>
          </div>
        </div>
      )}
    </div>
  )
}
