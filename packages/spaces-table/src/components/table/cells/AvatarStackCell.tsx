import { Chip } from '@mirohq/design-system'

interface AvatarStackCellProps {
  values: string[]
  onChipClick?: (name: string) => void
}

export function AvatarStackCell({ values, onChipClick }: AvatarStackCellProps) {
  const visible = values.slice(0, 2)
  const overflow = values.length - 2

  return (
    <div className="flex items-center gap-1 flex-nowrap">
      {visible.map((name) => (
        <Chip
          key={name}
          removable={false}
          css={{ fontSize: 14, '&:hover': { backgroundColor: '#000', color: '#fff', cursor: 'pointer' } }}
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onChipClick?.(name) }}
        >
          {name}
        </Chip>
      ))}
      {overflow > 0 && (
        <span className="text-[#656B81] font-body font-medium" style={{ fontSize: '14px' }}>
          +{overflow}
        </span>
      )}
    </div>
  )
}
