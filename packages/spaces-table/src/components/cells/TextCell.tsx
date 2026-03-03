interface TextCellProps {
  value: string
  isPrimary?: boolean
}

export function TextCell({ value, isPrimary }: TextCellProps) {
  return (
    <span
      className={`truncate block ${
        isPrimary
          ? 'font-heading font-semibold text-[#222428]'
          : 'text-[#222428]'
      }`}
      style={{ fontSize: isPrimary ? '16px' : '14px' }}
    >
      {value}
    </span>
  )
}
