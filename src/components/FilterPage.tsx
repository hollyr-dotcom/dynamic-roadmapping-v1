import { DropdownMenu, IconDotsThreeVertical, IconPlus } from '@mirohq/design-system'

export type FilterField = 'Status' | 'Person' | 'Title' | 'Description'

export type FilterCondition = {
  id: string
  field: FilterField
  operator: string
  value: string
}

const FIELDS: FilterField[] = ['Status', 'Person', 'Title', 'Description']

const OPERATORS: Record<FilterField, string[]> = {
  Status:      ['is', 'is not'],
  Person:      ['is', 'is not', 'is empty', 'is not empty'],
  Title:       ['contains', 'does not contain', 'is empty', 'is not empty'],
  Description: ['contains', 'does not contain', 'is empty', 'is not empty'],
}

const STATUS_VALUES = ['Todo', 'In Progress', 'Done']
const NO_VALUE_OPS = new Set(['is empty', 'is not empty'])

export function defaultCondition(): FilterCondition {
  return { id: crypto.randomUUID(), field: 'Status', operator: 'is', value: '' }
}

interface FilterPageProps {
  conditions: FilterCondition[]
  onAdd: () => void
  onChange: (id: string, patch: Partial<FilterCondition>) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function FilterPage({ conditions, onAdd, onChange, onDuplicate, onDelete }: FilterPageProps) {
  if (conditions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 pt-8">
        <span
          className="font-body text-[#656B81]"
          style={{ fontSize: '14px', fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        >
          No filters applied
        </span>
        <AddFilterButton onClick={onAdd} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {conditions.map((c) => (
        <ConditionCard
          key={c.id}
          condition={c}
          onChange={(patch) => onChange(c.id, patch)}
          onDuplicate={() => onDuplicate(c.id)}
          onDelete={() => onDelete(c.id)}
        />
      ))}
      <div className="pt-1">
        <AddFilterButton onClick={onAdd} />
      </div>
    </div>
  )
}

function AddFilterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#222428] text-white hover:bg-[#3F4454] transition-colors duration-150"
    >
      <IconPlus size="small" />
      <span className="font-heading font-semibold" style={{ fontSize: '14px' }}>
        Add filter
      </span>
    </button>
  )
}

// Temporary placeholder — replaced in Task 2
function ConditionCard(_props: {
  condition: FilterCondition
  onChange: (patch: Partial<FilterCondition>) => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  return <div />
}
