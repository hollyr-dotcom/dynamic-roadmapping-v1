import { describe, it, expect } from 'vitest'
import { fields, sampleData } from './index.ts'

describe('shared data model', () => {
  it('has exactly one primary field', () => {
    const primaries = fields.filter(f => f.isPrimary)
    expect(primaries).toHaveLength(1)
    expect(primaries[0].id).toBe('title')
  })

  it('sample data rows have all field keys', () => {
    const fieldIds = fields.map(f => f.id)
    for (const row of sampleData) {
      for (const id of fieldIds) {
        expect(row).toHaveProperty(id)
      }
    }
  })

  it('has at least 15 sample rows', () => {
    expect(sampleData.length).toBeGreaterThanOrEqual(15)
  })
})
