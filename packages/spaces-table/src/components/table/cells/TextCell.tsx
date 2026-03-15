interface TextCellProps {
  value: string
  isPrimary?: boolean
  isUpdated?: boolean
}

export function TextCell({ value, isPrimary }: TextCellProps) {
  return (
    <span
      className={`truncate block font-body text-[#222428] ${isPrimary ? 'font-bold' : 'font-normal'}`}
      style={{ fontSize: '14px' }}
    >
      {value}
    </span>
  )
}
