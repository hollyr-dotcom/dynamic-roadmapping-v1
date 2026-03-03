import { DropdownMenu, IconDotsThreeVertical, IconPlus } from '@mirohq/design-system'
import type { FilterField, FilterCondition } from '@spaces/shared'
import { FILTER_FIELDS, OPERATORS, STATUS_VALUES, NO_VALUE_OPS } from '@spaces/shared'

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
        New filter
      </span>
    </button>
  )
}

interface ConditionCardProps {
  condition: FilterCondition
  onChange: (patch: Partial<FilterCondition>) => void
  onDuplicate: () => void
  onDelete: () => void
}

function ConditionCard({ condition, onChange, onDuplicate, onDelete }: ConditionCardProps) {
  const needsValue = !NO_VALUE_OPS.has(condition.operator)

  const handleFieldChange = (field: string) => {
    const newField = field as FilterField
    onChange({ field: newField, operator: OPERATORS[newField][0], value: '' })
  }

  const handleOperatorChange = (operator: string) => {
    onChange({ operator, value: '' })
  }

  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#F7F8FA] border border-[#E8EAEE]">

      {/* Line 1: Field + Operator + ··· */}
      <div className="flex items-center gap-2">

        {/* Field dropdown */}
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <button className="h-8 px-3 rounded-lg bg-white border border-[#E8EAEE] text-[#222428] hover:bg-[#F1F2F5] transition-colors duration-150 shrink-0">
              <span className="font-body" style={{ fontSize: '14px', fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                {condition.field}
              </span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content css={{ zIndex: 200 }}>
              <DropdownMenu.RadioGroup value={condition.field} onChange={handleFieldChange}>
                {FILTER_FIELDS.map((f) => (
                  <DropdownMenu.RadioItem key={f} value={f} closeOnSelect>
                    {f}
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu>

        {/* Operator dropdown */}
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <button className="h-8 px-3 rounded-lg bg-white border border-[#E8EAEE] text-[#222428] hover:bg-[#F1F2F5] transition-colors duration-150 shrink-0">
              <span className="font-body" style={{ fontSize: '14px', fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
                {condition.operator}
              </span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content css={{ zIndex: 200 }}>
              <DropdownMenu.RadioGroup value={condition.operator} onChange={handleOperatorChange}>
                {OPERATORS[condition.field].map((op) => (
                  <DropdownMenu.RadioItem key={op} value={op} closeOnSelect>
                    {op}
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu>

        {/* ··· actions menu — right-aligned */}
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center justify-center w-8 h-8 rounded-lg text-[#656B81] hover:bg-[#F1F2F5] hover:text-[#222428] transition-colors duration-150">
                <IconDotsThreeVertical size="small" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content css={{ zIndex: 200 }}>
                <DropdownMenu.Item onSelect={() => onDuplicate()}>
                  Duplicate
                </DropdownMenu.Item>
                <DropdownMenu.Item variant="danger" onSelect={() => onDelete()}>
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        </div>
      </div>

      {/* Line 2: Value control */}
      {needsValue && (
        condition.field === 'Status' ? (
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center h-8 px-3 w-full rounded-lg bg-white border border-[#E8EAEE] text-left hover:bg-[#F1F2F5] transition-colors duration-150">
                <span
                  className={`font-body ${condition.value ? 'text-[#222428]' : 'text-[#9EA3B5]'}`}
                  style={{ fontSize: '14px', fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
                >
                  {condition.value || 'Select value…'}
                </span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content css={{ zIndex: 200 }}>
                <DropdownMenu.RadioGroup
                  value={condition.value}
                  onChange={(val) => onChange({ value: val })}
                >
                  {STATUS_VALUES.map((v) => (
                    <DropdownMenu.RadioItem key={v} value={v} closeOnSelect>
                      {v}
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        ) : (
          <input
            type="text"
            value={condition.value}
            onChange={(e) => onChange({ value: e.target.value })}
            placeholder="Enter value…"
            className="h-8 px-3 w-full rounded-lg bg-white border border-[#E8EAEE] font-body text-[#222428] placeholder:text-[#9EA3B5] focus:outline-none focus:ring-1 focus:ring-[#3859FF] transition-shadow duration-150"
            style={{ fontSize: '14px', fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          />
        )
      )}
    </div>
  )
}
