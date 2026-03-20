import type { FieldDefinition } from './types.ts'

export const fields: FieldDefinition[] = [
  { id: "jiraKey",     label: "ID",           type: "jiraId" },
  { id: "title",       label: "Title",        type: "text",     isPrimary: true },
  { id: "description", label: "Description",  type: "text"     },
  { id: "priority",   label: "Priority",      type: "priority" },
  { id: "mentions",    label: "Mentions",      type: "number"   },
  { id: "customers",  label: "Customers",     type: "number"   },
  { id: "estRevenue", label: "Est. revenue",  type: "currency" },
  { id: "companies",  label: "Companies",     type: "avatars"  },
]

export const roadmapFields: FieldDefinition[] = [
  { id: "title",      label: "Title",        type: "text",     isPrimary: true },
  { id: "status",     label: "Status",       type: "status"   },
  { id: "customers",  label: "Customers",    type: "number"   },
  { id: "estRevenue", label: "Est. revenue", type: "currency" },
  { id: "companies",  label: "Companies",    type: "avatars"  },
]
