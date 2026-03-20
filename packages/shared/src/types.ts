export type FieldType = "text" | "number" | "currency" | "avatars" | "status" | "priority" | "person" | "date" | "jiraId"

export interface FieldDefinition {
  id: string
  label: string
  type: FieldType
  isPrimary?: boolean
}

export type Priority = 'triage' | 'now' | 'next' | 'later' | 'icebox'

export type Status = 'planning' | 'in-progress' | 'done'

export type FilterField = 'Status' | 'Person' | 'Title' | 'Description'

export interface FilterCondition {
  id: string
  field: FilterField
  operator: string
  value: string
}
