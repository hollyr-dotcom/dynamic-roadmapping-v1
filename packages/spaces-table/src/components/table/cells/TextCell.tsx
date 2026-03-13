interface TextCellProps {
  value: string
  isPrimary?: boolean
}

export function TextCell({ value }: TextCellProps) {
  return (
    <span
      className="truncate block font-body text-[#222428]"
      style={{ fontSize: '14px' }}
    >
      {value}
    </span>
  )
}
