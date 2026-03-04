import React, { useState, useRef, useEffect } from 'react'
import {
  DropdownMenu,
  IconButton,
  IconDotsThree,
} from '@mirohq/design-system'

export function DatabaseTitle() {
  const [title, setTitle] = useState('Backlog')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const save = () => {
    const trimmed = draft.trim()
    if (trimmed) setTitle(trimmed)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') {
      setDraft(title)
      setEditing(false)
    }
  }

  return (
    <div className="flex items-center gap-2 px-14 py-3 shrink-0">
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={handleKeyDown}
          className="font-heading font-semibold text-[#222428] bg-transparent outline-none border-b-2 border-[#4262FF] leading-[1.4]"
          style={{ fontSize: '32px' }}
        />
      ) : (
        <h1
          className="font-heading font-semibold text-[#222428] leading-[1.4] cursor-text select-none"
          style={{ fontSize: '32px' }}
          onClick={() => {
            setDraft(title)
            setEditing(true)
          }}
        >
          {title}
        </h1>
      )}

      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton aria-label="More options" variant="ghost" size="medium">
            <IconDotsThree />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content side="bottom" align="start">
          <DropdownMenu.Item onSelect={() => { setDraft(title); setEditing(true) }}>
            Rename
          </DropdownMenu.Item>
          <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item variant="danger">Delete</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  )
}
