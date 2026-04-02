// Colourful board icons inspired by Miro's mds-Board Icons
// Each is a simple 24×24 SVG with a distinct colour and shape

function Paper() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 3h8l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#7DD3FC" />
      <path d="M14 3v5h5" fill="#38BDF8" />
      <rect x="7" y="11" width="6" height="1.5" rx=".75" fill="#fff" opacity=".7" />
      <rect x="7" y="14" width="4" height="1.5" rx=".75" fill="#fff" opacity=".7" />
    </svg>
  )
}

function Lightbulb() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2a7 7 0 00-3 13.33V17a1 1 0 001 1h4a1 1 0 001-1v-1.67A7 7 0 0012 2z" fill="#FCD34D" />
      <rect x="9" y="19" width="6" height="2" rx="1" fill="#FBBF24" />
      <path d="M10 12h4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
    </svg>
  )
}

function Rocket() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2c-3 4-4 8-4 12h8c0-4-1-8-4-12z" fill="#5EEAD4" />
      <circle cx="12" cy="10" r="2" fill="#fff" opacity=".6" />
      <path d="M8 14l-2 4h4v-4zM16 14l2 4h-4v-4z" fill="#2DD4BF" />
      <rect x="10" y="18" width="4" height="3" rx="1" fill="#F87171" />
    </svg>
  )
}

function Chart() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#86EFAC" />
      <rect x="6" y="12" width="3" height="6" rx="1" fill="#22C55E" />
      <rect x="10.5" y="9" width="3" height="9" rx="1" fill="#22C55E" />
      <rect x="15" y="6" width="3" height="12" rx="1" fill="#22C55E" />
    </svg>
  )
}

function Diagram() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="7" cy="7" r="4" fill="#FDBA74" />
      <circle cx="17" cy="7" r="4" fill="#FB923C" />
      <circle cx="12" cy="16" r="4" fill="#F97316" />
      <line x1="9" y1="9" x2="11" y2="13" stroke="#FDBA74" strokeWidth="2" />
      <line x1="15" y1="9" x2="13" y2="13" stroke="#FB923C" strokeWidth="2" />
    </svg>
  )
}

function Stars() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.4 5.2L20 8l-4 3.8 1 5.7L12 14.7 7 17.5l1-5.7L4 8l5.6-.8L12 2z" fill="#FBBF24" />
      <circle cx="19" cy="4" r="2" fill="#FDE68A" />
    </svg>
  )
}

export const BOARD_ICONS = [Lightbulb, Rocket, Chart, Stars] as const

export type BoardIconIndex = 0 | 1 | 2 | 3

export function BoardIcon({ index }: { index: number }) {
  const Icon = BOARD_ICONS[index % BOARD_ICONS.length]
  return <Icon />
}

export function getRandomBoardIconIndex(): BoardIconIndex {
  return Math.floor(Math.random() * BOARD_ICONS.length) as BoardIconIndex
}
