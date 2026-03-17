import type { FieldDefinition } from '@spaces/shared'

const STICKY_TOP = 64
const GAP_COVER = '0 -12px 0 0 white'

interface TableHeaderProps {
  fields: FieldDefinition[]
  className?: string
}

export function TableHeader({ fields, className }: TableHeaderProps) {
  return (
    <thead className={className}>
      <tr>
        <th
          className="pl-14 w-0 sticky z-10 bg-white"
          style={{ top: STICKY_TOP, boxShadow: GAP_COVER }}
          aria-hidden="true"
        />
        {fields.map((field) => (
          <th
            key={field.id}
            className="text-left font-body font-semibold text-[#656B81] h-14 sticky z-10 bg-white"
            style={{
              top: STICKY_TOP,
              boxShadow: GAP_COVER,
              fontSize: '14px',
              width: field.isPrimary ? '480px' : field.id === 'description' ? '320px' : field.type === 'avatars' ? '300px' : '208px',
              paddingLeft: '12px',
              paddingRight: '20px',
            }}
          >
            <span className="truncate">{field.label}</span>
          </th>
        ))}
        <th className="table-fill sticky z-10 bg-white" style={{ top: STICKY_TOP, boxShadow: GAP_COVER }} aria-hidden="true" />
      </tr>
    </thead>
  )
}
