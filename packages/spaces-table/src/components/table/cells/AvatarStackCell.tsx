import { Chip } from '@mirohq/design-system'

interface AvatarStackCellProps {
  values: string[]
}

export function AvatarStackCell({ values }: AvatarStackCellProps) {
  const visible = values.slice(0, 2)
  const overflow = values.length - 2

  return (
    <div className="flex items-center gap-1 flex-nowrap">
      {visible.map((name) => (
        <Chip key={name} removable={false} css={{ fontSize: 14 }}>
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
