import type { FieldDefinition } from '@spaces/shared'
import { IconBookmark } from '@mirohq/design-system'

interface TableHeaderProps {
  fields: FieldDefinition[]
}

export function TableHeader({ fields }: TableHeaderProps) {
  return (
    <thead className="sticky top-[120px] bg-white z-10"> {/* 56px nav + 64px toolbar */}
      <tr>
        <th
          className="pl-14"
          aria-hidden="true"
        />
        {fields.map((field) => (
          <th
            key={field.id}
            className="text-left font-body font-semibold text-[#656B81] h-14"
            style={{
              fontSize: '14px',
              minWidth: field.isPrimary ? '320px' : '128px',
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
        <th className="w-8 min-w-[32px]" aria-hidden="true" />
      </tr>
    </thead>
  )
}
