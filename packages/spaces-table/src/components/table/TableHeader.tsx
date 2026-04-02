import type { FieldDefinition } from '@spaces/shared'
import { IconSortDescending } from '@mirohq/design-system'

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
              width: field.type === 'jiraId' ? '130px' : field.isPrimary ? '480px' : field.id === 'description' ? '320px' : field.type === 'avatars' ? '300px' : '208px',
              minWidth: field.type === 'jiraId' ? '130px' : undefined,
              paddingLeft: '12px',
              paddingRight: '20px',
            }}
          >
            <span className="inline-flex items-center truncate" style={{ gap: field.type === 'priority' ? 4 : undefined }}>
              {/* @ts-expect-error -- MDS icon style prop */}
              {field.type === 'priority' && <IconSortDescending size="small" style={{ color: '#7D8297', flexShrink: 0 }} />}
              {field.label}
            </span>
          </th>
        ))}
        <th className="table-fill sticky z-10 bg-white" style={{ top: STICKY_TOP, boxShadow: GAP_COVER }} aria-hidden="true" />
      </tr>
    </thead>
  )
}
