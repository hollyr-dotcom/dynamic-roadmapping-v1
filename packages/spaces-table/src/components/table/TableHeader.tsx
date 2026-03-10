import type { FieldDefinition } from '@spaces/shared'
import { IconBookmark } from '@mirohq/design-system'

interface TableHeaderProps {
  fields: FieldDefinition[]
}

export function TableHeader({ fields }: TableHeaderProps) {
  return (
    <thead className="sticky top-16 bg-white z-10">
      <tr>
        <th
          className="pl-14 w-0"
          aria-hidden="true"
        />
        {fields.map((field) => (
          <th
            key={field.id}
            className="text-left font-body font-semibold text-[#656B81] h-14"
            style={{
              fontSize: '14px',
              width: field.isPrimary ? '480px' : '208px',
              paddingLeft: '12px',
              paddingRight: '20px',
            }}
          >
            <div className="flex items-center gap-2">
              {field.isPrimary && (
                <IconBookmark size="small" color="icon-neutrals-subtle" />
              )}
              <span className="truncate">{field.label}</span>
            </div>
          </th>
        ))}
        <th className="table-fill" aria-hidden="true" />
      </tr>
    </thead>
  )
}
