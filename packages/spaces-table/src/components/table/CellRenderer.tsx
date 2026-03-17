import type { FieldDefinition, SpaceRow, Status } from '@spaces/shared'
import { TextCell } from './cells/TextCell'
import { NumberCell } from './cells/NumberCell'
import { CurrencyCell } from './cells/CurrencyCell'
import { AvatarStackCell } from './cells/AvatarStackCell'
import { StatusCell } from './cells/StatusCell'
import { JiraIdCell } from './cells/JiraIdCell'

interface CellRendererProps {
  field: FieldDefinition
  row: SpaceRow
  onAvatarChipClick?: (name: string) => void
  isUpdated?: boolean
}

export function CellRenderer({ field, row, onAvatarChipClick, isUpdated: _isUpdated }: CellRendererProps) {
  const value = row[field.id as keyof SpaceRow]

  switch (field.type) {
    case 'text':
      return <TextCell value={value as string} isPrimary={field.isPrimary} />
    case 'number':
      return <NumberCell value={value as number} />
    case 'currency':
      return <CurrencyCell value={value as number} />
    case 'avatars':
      return <AvatarStackCell values={value as string[]} onChipClick={onAvatarChipClick} />
    case 'status':
      return <StatusCell value={value as Status | undefined} />
    case 'jiraId':
      return <JiraIdCell value={value as string} />
    default:
      return <span className="text-sm text-[#656B81]">{String(value)}</span>
  }
}
