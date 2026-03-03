import type { FilterField, FilterCondition } from './types.ts'

export const FILTER_FIELDS: FilterField[] = ['Status', 'Person', 'Title', 'Description']

export const OPERATORS: Record<FilterField, string[]> = {
  Status:      ['is', 'is not'],
  Person:      ['is', 'is not', 'is empty', 'is not empty'],
  Title:       ['contains', 'does not contain', 'is empty', 'is not empty'],
  Description: ['contains', 'does not contain', 'is empty', 'is not empty'],
}

export const STATUS_VALUES = ['Todo', 'In Progress', 'Done'] as const

export const NO_VALUE_OPS = new Set(['is empty', 'is not empty'])

export function defaultCondition(): FilterCondition {
  return { id: crypto.randomUUID(), field: 'Status', operator: 'is', value: '' }
}
