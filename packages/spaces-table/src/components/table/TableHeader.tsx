import type { FieldDefinition } from '@spaces/shared'

interface TableHeaderProps {
  fields: FieldDefinition[]
}

export function TableHeader({ fields }: TableHeaderProps) {
  return (
    <thead>
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
              width: field.isPrimary ? '480px' : field.type === 'avatars' ? '300px' : '208px',
              paddingLeft: '12px',
              paddingRight: '20px',
            }}
          >
            <span className="truncate">{field.label}</span>
          </th>
        ))}
        <th className="table-fill" aria-hidden="true" />
      </tr>
    </thead>
  )
}
