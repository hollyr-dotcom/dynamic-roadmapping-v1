import type { FieldDefinition, SpaceRow } from '@spaces/shared'
import { TextCell } from './cells/TextCell'
import { NumberCell } from './cells/NumberCell'
import { CurrencyCell } from './cells/CurrencyCell'
import { AvatarStackCell } from './cells/AvatarStackCell'

interface CellRendererProps {
  field: FieldDefinition
  row: SpaceRow
}

export function CellRenderer({ field, row }: CellRendererProps) {
  const value = row[field.id as keyof SpaceRow]

  switch (field.type) {
    case 'text':
      return <TextCell value={value as string} isPrimary={field.isPrimary} />
    case 'number':
      return <NumberCell value={value as number} />
    case 'currency':
      return <CurrencyCell value={value as number} />
    case 'avatars':
      return <AvatarStackCell values={value as string[]} />
    default:
      return <span className="text-sm text-[#656B81]">{String(value)}</span>
  }
}
