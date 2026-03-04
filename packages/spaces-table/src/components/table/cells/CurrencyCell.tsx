interface CurrencyCellProps {
  value: number
}

export function CurrencyCell({ value }: CurrencyCellProps) {
  return (
    <span className="font-body tabular-nums text-[#222428]" style={{ fontSize: '14px' }}>
      {value === 0 ? '—' : `$${value}K`}
    </span>
  )
}
