import {
  Button,
  IconButton,
  IconLinesThreeHorizontal,
  IconBell,
  IconChevronRightSmall,
} from '@mirohq/design-system'

const avatars = [
  { name: 'MK', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=56&h=56&fit=crop&crop=face' },
  { name: 'AJ', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=56&h=56&fit=crop&crop=face' },
  { name: 'TS', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=56&h=56&fit=crop&crop=face' },
]

interface TopNavBarProps {
  borderOpacity: number
  scrollFade: number
  databaseTitle: string
  isMenuOpen: boolean
  onToggleMenu: () => void
}

export function TopNavBar({ borderOpacity, scrollFade, databaseTitle, isMenuOpen, onToggleMenu }: TopNavBarProps) {
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

        {/* Presence avatars */}
        <div className="flex items-center mr-1">
          {avatars.map((a, i) => (
            <img
              key={a.name}
              src={a.img}
              alt={a.name}
              className="w-7 h-7 rounded-full border-2 border-white object-cover"
              style={{
                marginLeft: i > 0 ? '-6px' : 0,
                zIndex: avatars.length - i,
              }}
            />
          ))}
        </div>

        <Button size="medium">Share</Button>
      </div>
    </div>
  )
}
