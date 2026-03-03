import type { FieldDefinition } from './types.ts'

export const fields: FieldDefinition[] = [
  { id: "title",      label: "Title",        type: "text",     isPrimary: true },
  { id: "mentions",   label: "Mentions",      type: "number"   },
  { id: "customers",  label: "Customers",     type: "number"   },
  { id: "estRevenue", label: "Est. revenue",  type: "currency" },
  { id: "companies",  label: "Companies",     type: "avatars"  },
]
