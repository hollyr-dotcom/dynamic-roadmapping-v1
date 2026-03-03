import { describe, it, expect } from 'vitest'
import { parseFilterCommand } from './filterParser'
import type { FilterCondition } from '../components/FilterPage'

const empty: FilterCondition[] = []

function cond(field: FilterCondition['field'], operator: string, value: string): FilterCondition {
  return { id: 'test-id', field, operator, value }
}

describe('parseFilterCommand', () => {

  // ── CREATE ──────────────────────────────────────────────
  it('creates a Status is filter from "show only in progress items"', () => {
    const result = parseFilterCommand('show only in progress items', empty)
    expect(result).toHaveLength(1)
    expect(result![0]).toMatchObject({ field: 'Status', operator: 'is', value: 'In Progress' })
  })

  it('creates a Status is filter from "Show only Todo items"', () => {
    const result = parseFilterCommand('Show only Todo items', empty)
    expect(result![0]).toMatchObject({ field: 'Status', operator: 'is', value: 'Todo' })
  })

  it('creates a Status is filter from "show only done items"', () => {
    const result = parseFilterCommand('show only done items', empty)
    expect(result![0]).toMatchObject({ field: 'Status', operator: 'is', value: 'Done' })
  })

  it('creates a Title contains filter', () => {
    const result = parseFilterCommand("filter where title contains 'bug'", empty)
    expect(result![0]).toMatchObject({ field: 'Title', operator: 'contains', value: 'bug' })
  })

  it('strips quotes from contains value', () => {
    const result = parseFilterCommand('filter where title contains "feature"', empty)
    expect(result![0]).toMatchObject({ field: 'Title', operator: 'contains', value: 'feature' })
  })

  it('works without quotes on contains value', () => {
    const result = parseFilterCommand('filter where description contains sprint', empty)
    expect(result![0]).toMatchObject({ field: 'Description', operator: 'contains', value: 'sprint' })
  })

  it('creates a Description is empty filter', () => {
    const result = parseFilterCommand('only show items with no description', empty)
    expect(result![0]).toMatchObject({ field: 'Description', operator: 'is empty', value: '' })
  })

  it('creates a Title is empty filter', () => {
    const result = parseFilterCommand('only show items with no title', empty)
    expect(result![0]).toMatchObject({ field: 'Title', operator: 'is empty', value: '' })
  })

  it('appends a new filter to existing ones', () => {
    const existing = [cond('Status', 'is', 'Todo')]
    const result = parseFilterCommand('filter where title contains bug', existing)
    expect(result).toHaveLength(2)
  })

  // ── EDIT ────────────────────────────────────────────────
  it('edits existing status filter value', () => {
    const existing = [cond('Status', 'is', 'Todo')]
    const result = parseFilterCommand('change the status filter to Done', existing)
    expect(result).toHaveLength(1)
    expect(result![0]).toMatchObject({ field: 'Status', operator: 'is', value: 'Done' })
  })

  it('creates status filter if none exists when editing', () => {
    const result = parseFilterCommand('change the status filter to In Progress', empty)
    expect(result).toHaveLength(1)
    expect(result![0]).toMatchObject({ field: 'Status', operator: 'is', value: 'In Progress' })
  })

  // ── DELETE ──────────────────────────────────────────────
  it('removes status filter with "remove the status filter"', () => {
    const existing = [cond('Status', 'is', 'Todo'), cond('Title', 'contains', 'bug')]
    const result = parseFilterCommand('remove the status filter', existing)
    expect(result).toHaveLength(1)
    expect(result![0].field).toBe('Title')
  })

  it('removes status filter with "delete the status filter"', () => {
    const existing = [cond('Status', 'is', 'Todo')]
    const result = parseFilterCommand('delete the status filter', existing)
    expect(result).toHaveLength(0)
  })

  it('clears all with "clear all filters"', () => {
    const existing = [cond('Status', 'is', 'Todo'), cond('Title', 'contains', 'bug')]
    const result = parseFilterCommand('clear all filters', existing)
    expect(result).toHaveLength(0)
  })

  it('clears all with "remove all filters"', () => {
    const existing = [cond('Status', 'is', 'Todo')]
    const result = parseFilterCommand('remove all filters', existing)
    expect(result).toHaveLength(0)
  })

  it('clears all with "delete all filters"', () => {
    const existing = [cond('Status', 'is', 'Todo')]
    const result = parseFilterCommand('delete all filters', existing)
    expect(result).toHaveLength(0)
  })

  // ── UNRECOGNISED ─────────────────────────────────────────
  it('returns null for unrecognised input', () => {
    expect(parseFilterCommand('hello', empty)).toBeNull()
    expect(parseFilterCommand('what is the status', empty)).toBeNull()
  })

})
