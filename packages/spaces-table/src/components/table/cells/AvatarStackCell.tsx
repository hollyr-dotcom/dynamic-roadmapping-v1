import { CompanyLogo } from '../../CompanyLogo'

interface AvatarStackCellProps {
  values: string[]
  onChipClick?: (name: string) => void
}

export function AvatarStackCell({ values, onChipClick }: AvatarStackCellProps) {
  const visible = values.slice(0, 2)
  const overflow = values.length - 2

  return (
    <div className="flex items-center gap-2 flex-nowrap">
      {visible.map((name) => (
        <CompanyLogo key={name} name={name} size={28} onClick={onChipClick ? () => onChipClick(name) : undefined} />
      ))}
      {overflow > 0 && (
        <span className="text-[#656B81] font-body font-medium" style={{ fontSize: '14px' }}>
          +{overflow}
        </span>
      )}
    </div>
  )
}
