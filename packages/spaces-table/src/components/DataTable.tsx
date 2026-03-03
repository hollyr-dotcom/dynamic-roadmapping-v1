import { fields, sampleData } from '@spaces/shared'
import type { FieldDefinition, SpaceRow } from '@spaces/shared'
import { TextCell } from './cells/TextCell'
import { NumberCell } from './cells/NumberCell'
import { CurrencyCell } from './cells/CurrencyCell'
import { AvatarStackCell } from './cells/AvatarStackCell'

function CellRenderer({ field, row }: { field: FieldDefinition; row: SpaceRow }) {
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

export function DataTable() {
  return (
    <div className="flex-1 overflow-auto table-scroll">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="border-b border-[#E8EAEE]">
            <th
              className="text-left font-semibold text-[#9EA3B5] px-3"
              style={{ fontSize: '12px', width: '56px', minWidth: '56px' }}
            >
              #
            </th>
            {fields.map((field) => (
              <th
                key={field.id}
                className="text-left font-semibold text-[#9EA3B5] px-3 py-2"
                style={{
                  fontSize: '12px',
                  minWidth: field.isPrimary ? '320px' : '140px',
                }}
              >
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sampleData.map((row, idx) => (
            <tr
              key={row.id}
              className="border-b border-[#F1F2F5] hover:bg-[#FAFBFC] transition-colors"
              style={{ height: '56px' }}
            >
              <td
                className="px-3 text-[#9EA3B5]"
                style={{ fontSize: '12px' }}
              >
                {idx + 1}
              </td>
              {fields.map((field) => (
                <td key={field.id} className="px-3">
                  <CellRenderer field={field} row={row} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
