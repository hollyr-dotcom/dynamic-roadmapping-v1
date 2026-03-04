import {
  IconButton,
  IconLinesThreeHorizontal,
  IconBell,
  IconSparksFilled,
} from '@mirohq/design-system'

const avatars = [
  { initials: 'MK', bg: '#4262FF' },
  { initials: 'AJ', bg: '#F24726' },
  { initials: 'TS', bg: '#12B76A' },
]

export function TopNavBar() {
  return (
    <div className="flex items-center justify-between h-16 pr-14 bg-white shrink-0" style={{ paddingLeft: '12px' }}>
      {/* Left: menu + logo + breadcrumb */}
      <div className="flex items-center gap-3">
        <IconButton aria-label="Menu" variant="ghost" size="medium">
          <IconLinesThreeHorizontal />
        </IconButton>

        <span
          className="font-heading font-semibold text-[#222428] leading-none select-none"
          style={{ fontSize: '14px' }}
        >
          Project Galaxy
        </span>
      </div>

      {/* Right: avatars + notifications + AI */}
      <div className="flex items-center gap-2">
        {/* Presence avatars */}
        <div className="flex items-center mr-1">
          {avatars.map((a, i) => (
            <div
              key={a.initials}
              className="flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-semibold border-2 border-white"
              style={{
                backgroundColor: a.bg,
                marginLeft: i > 0 ? '-6px' : 0,
                zIndex: avatars.length - i,
              }}
            >
              {a.initials}
            </div>
          ))}
          <div
            className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F1F2F5] text-[#656B81] text-xs font-semibold border-2 border-white"
            style={{ marginLeft: '-6px', zIndex: 0 }}
          >
            +4
          </div>
        </div>

        {/* Notifications */}
        <IconButton
          aria-label="Notifications"
          variant="ghost"
          size="medium"
          showBadge
          badgeContent="3"
          badgeAriaLabel="3 notifications"
        >
          <IconBell />
        </IconButton>

        {/* AI Sidekick */}
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full text-white"
          style={{
            background: 'linear-gradient(135deg, #4262FF 0%, #9B59B6 50%, #F97316 100%)',
          }}
          aria-label="AI Sidekick"
        >
          <IconSparksFilled size="small" />
        </button>
      </div>
    </div>
  )
}
