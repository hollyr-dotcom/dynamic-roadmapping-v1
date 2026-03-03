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
    <div className="flex items-center justify-between h-16 px-4 bg-white shrink-0">
      {/* Left: menu + logo + breadcrumb */}
      <div className="flex items-center gap-3">
        <IconButton aria-label="Menu" variant="ghost" size="medium">
          <IconLinesThreeHorizontal />
        </IconButton>

        {/* Miro logotype */}
        <svg width="72" height="24" viewBox="0 0 72 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M54.416 4.48h4.448v15.04h-4.448V4.48ZM40.544 4.48h4.448v15.04h-4.448V4.48Zm-6.048 0L38.8 19.52h-4.576l-2.816-9.152L28.4 19.52h-4.576l4.304-15.04h4.016l2.352 8.736 2.352-8.736h1.648ZM63.296 12c0-4.416 3.36-7.84 7.84-7.84V8.4A3.571 3.571 0 0 0 67.6 12a3.571 3.571 0 0 0 3.536 3.6v4.24c-4.48 0-7.84-3.424-7.84-7.84Z" fill="#050038"/>
        </svg>

        <span className="text-[#9EA3B5] text-sm select-none">/</span>

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
