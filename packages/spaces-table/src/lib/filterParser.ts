import type { FilterCondition } from '@spaces/shared'

const STATUS_MAP: Record<string, string> = {
  'todo':        'Todo',
  'in progress': 'In Progress',
  'done':        'Done',
}

const FIELD_MAP: Record<string, FilterCondition['field']> = {
  'status':      'Status',
  'title':       'Title',
  'description': 'Description',
  'person':      'Person',
}

function newCond(field: FilterCondition['field'], operator: string, value: string): FilterCondition {
  return { id: crypto.randomUUID(), field, operator, value }
}

export function parseFilterCommand(
  input: string,
  current: FilterCondition[]
): FilterCondition[] | null {
  const s = input.trim().toLowerCase()

  // ── CLEAR ALL ──────────────────────────────────────────
  if (
    s === 'clear all filters' ||
    s === 'remove all filters' ||
    s === 'delete all filters'
  ) {
    return []
  }

  // ── DELETE FIELD FILTER ────────────────────────────────
  // "remove the {field} filter" | "delete the {field} filter"
  const deleteMatch = s.match(/^(?:remove|delete) the (\w+) filter$/)
  if (deleteMatch) {
    const field = FIELD_MAP[deleteMatch[1]]
    if (field) return current.filter((c) => c.field !== field)
  }

  // ── EDIT STATUS FILTER ─────────────────────────────────
  // "change the status filter to {status}"
  const editMatch = s.match(/^change the status filter to (.+)$/)
  if (editMatch) {
    const statusValue = STATUS_MAP[editMatch[1].trim()]
    if (statusValue) {
      const existingIdx = current.findIndex((c) => c.field === 'Status')
      if (existingIdx !== -1) {
        const updated = [...current]
        updated[existingIdx] = { ...updated[existingIdx], value: statusValue }
        return updated
      }
      return [...current, newCond('Status', 'is', statusValue)]
    }
  }

  // ── CREATE: show only {status} items ──────────────────
  const showOnlyMatch = s.match(/^show only (.+?) items?$/)
  if (showOnlyMatch) {
    const statusValue = STATUS_MAP[showOnlyMatch[1].trim()]
    if (statusValue) {
      return [...current, newCond('Status', 'is', statusValue)]
    }
  }

  // ── CREATE: filter where {field} contains {text} ──────
  const containsMatch = s.match(/^filter where (\w+) contains ['"]?(.+?)['"]?$/)
  if (containsMatch) {
    const field = FIELD_MAP[containsMatch[1]]
    const value = containsMatch[2].trim()
    if (field && value) {
      return [...current, newCond(field, 'contains', value)]
    }
  }

  // ── CREATE: only show items with no {field} ───────────
  const emptyMatch = s.match(/^only show items with no (\w+)$/)
  if (emptyMatch) {
    const field = FIELD_MAP[emptyMatch[1]]
    if (field) {
      return [...current, newCond(field, 'is empty', '')]
    }
  }

  return null
}
