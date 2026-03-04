import React, { useRef, useEffect, useState } from 'react'

interface DatabaseTitleProps {
  opacity: number
  title: string
  onTitleChange: (title: string) => void
}

export function DatabaseTitle({ opacity, title, onTitleChange }: DatabaseTitleProps) {
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
    if (trimmed) onTitleChange(trimmed)
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
    <div
      className="flex items-center gap-2 px-14 pb-3 shrink-0"
      style={{ paddingTop: '48px', opacity }}
    >
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

    </div>
  )
}
