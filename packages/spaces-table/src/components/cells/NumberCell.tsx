interface NumberCellProps {
  value: number
}

export function NumberCell({ value }: NumberCellProps) {
  return (
    <span className="tabular-nums text-[#222428]" style={{ fontSize: '14px' }}>
      {value.toLocaleString()}
    </span>
  )
}
