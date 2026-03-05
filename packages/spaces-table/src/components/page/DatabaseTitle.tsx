import React, { useRef, useEffect, useState } from 'react'

interface DatabaseTitleProps {
  opacity: number
  title: string
  onTitleChange: (title: string) => void
}

export function DatabaseTitle({ opacity, title, onTitleChange }: DatabaseTitleProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [draft, setDraft] = useState(title)
  const [inputWidth, setInputWidth] = useState<number | undefined>(undefined)
  const savedTitle = useRef(title)

  // Sync draft when title prop changes externally
  useEffect(() => {
    setDraft(title)
    savedTitle.current = title
  }, [title])

  // Measure text width and size input to fit
  useEffect(() => {
    if (measureRef.current) {
      setInputWidth(measureRef.current.scrollWidth + 4)
    }
  }, [draft])

  const save = () => {
    const trimmed = draft.trim()
    if (trimmed) {
      onTitleChange(trimmed)
      savedTitle.current = trimmed
    } else {
      setDraft(savedTitle.current)
    }
  }

  const handleFocus = () => {
    // Select all text on focus for easy replacement
    requestAnimationFrame(() => inputRef.current?.select())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      inputRef.current?.blur()
    }
    if (e.key === 'Escape') {
      setDraft(savedTitle.current)
      // Blur after reverting — setTimeout so the reverted value renders first
      setTimeout(() => inputRef.current?.blur(), 0)
    }
  }

  return (
    <div
      className="sticky left-0 flex items-center gap-2 px-14 pb-3 shrink-0"
      style={{ paddingTop: '48px', opacity }}
    >
      {/* Hidden span to measure text width */}
      <span
        ref={measureRef}
        aria-hidden
        className="font-heading font-semibold leading-[1.4] absolute invisible whitespace-pre"
        style={{ fontSize: '32px', padding: '0 2px' }}
      >
        {draft || 'Enter a title ...'}
      </span>

      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={handleFocus}
        onBlur={save}
        onKeyDown={handleKeyDown}
        placeholder="Enter a title ..."
        style={{
          fontSize: '32px',
          width: inputWidth ? `${inputWidth}px` : 'auto',
        }}
        className="title-input font-heading font-semibold text-[#222428] leading-[1.4] px-0.5 rounded bg-transparent border-none outline-none cursor-default transition-colors duration-150 hover:bg-[#F1F2F5] hover:cursor-pointer focus:bg-white focus:cursor-text focus:shadow-[0_0_0_2px_white,0_0_0_4px_#2B4DF8]"
      />
    </div>
  )
}
