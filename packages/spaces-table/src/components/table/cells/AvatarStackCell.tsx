interface AvatarStackCellProps {
  values: string[]
}

export function AvatarStackCell({ values }: AvatarStackCellProps) {
  const visible = values.slice(0, 2)
  const overflow = values.length - 2

  return (
    <div className="flex items-center gap-1 flex-nowrap">
      {visible.map((name) => (
        <span
          key={name}
          className="inline-flex items-center px-[10px] py-[4px] rounded text-xs font-body font-medium"
          style={{
            backgroundColor: '#F0F0EE',
            color: '#1a1b1e',
            fontSize: '12px',
            lineHeight: '18px',
          }}
        >
          {name}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="text-[#656B81] font-body font-medium"
          style={{ fontSize: '12px' }}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
