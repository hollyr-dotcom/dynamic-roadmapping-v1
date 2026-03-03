export type FieldType = "text" | "number" | "currency" | "avatars" | "status" | "person" | "date"

export interface FieldDefinition {
  id: string
  label: string
  type: FieldType
  isPrimary?: boolean
}

export type FilterField = 'Status' | 'Person' | 'Title' | 'Description'

export interface FilterCondition {
  id: string
  field: FilterField
  operator: string
  value: string
}
