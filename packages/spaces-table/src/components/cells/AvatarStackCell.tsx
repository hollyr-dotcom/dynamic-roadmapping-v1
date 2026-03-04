const COLORS = [
  '#4262FF', '#F24726', '#12B76A', '#F79009', '#9B59B6',
  '#E91E63', '#00BCD4', '#8BC34A', '#FF5722', '#607D8B',
]

function hashColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

interface AvatarStackCellProps {
  values: string[]
}

export function AvatarStackCell({ values }: AvatarStackCellProps) {
  const visible = values.slice(0, 3)
  const overflow = values.length - 3

  return (
    <div className="flex items-center">
      {visible.map((initials, i) => (
        <div
          key={initials}
          className="flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-body font-semibold border-2 border-white"
          style={{
            backgroundColor: hashColor(initials),
            marginLeft: i > 0 ? '-6px' : 0,
            zIndex: visible.length - i,
          }}
        >
          {initials}
        </div>
      ))}
      {overflow > 0 && (
        <span
          className="text-[#656B81] font-body font-semibold ml-1"
          style={{ fontSize: '12px' }}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
