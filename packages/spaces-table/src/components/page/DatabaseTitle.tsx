import React, { useRef, useEffect, useState } from 'react'
import {
  IconButton,
  IconDotsThree,
  IconArrowsOutSimple,
  IconArrowUpRight,
  DropdownMenu,
  IconStar,
  IconLink,
  IconClockCounterClockwise,
  IconInformationMarkCircle,
  IconPen,
  IconSquaresTwoOverlap,
  IconTrash,
  Tooltip,
} from '@mirohq/design-system'
import { MENU_WIDTH } from './ViewTabsToolbar'

interface DatabaseTitleProps {
  opacity: number
  title: string
  onTitleChange: (title: string) => void
  variant?: 'page' | 'widget'
  onExitCanvas?: () => void
  syncCount?: number
}

export function DatabaseTitle({ opacity, title, onTitleChange, variant = 'page', onExitCanvas, syncCount = 0 }: DatabaseTitleProps) {
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

  const [isFocused, setIsFocused] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className={`group/title sticky left-0 z-30 flex items-center gap-1 pb-1 shrink-0 ${variant === 'widget' ? 'px-0' : 'px-14'}`}
      style={{ paddingTop: variant === 'widget' ? 0 : '48px', opacity }}
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
        onFocus={() => { setIsFocused(true); handleFocus() }}
        onBlur={() => { setIsFocused(false); save() }}
        onKeyDown={handleKeyDown}
        placeholder="Enter a title ..."
        style={{
          fontSize: '32px',
          width: inputWidth ? `${inputWidth}px` : 'auto',
        }}
        className="title-input font-heading font-semibold text-[#222428] leading-[1.4] px-0.5 rounded bg-transparent border-none outline-none cursor-default transition-colors duration-150 hover:bg-[#F1F2F5] hover:cursor-pointer focus:bg-white focus:cursor-text focus:shadow-[0_0_0_2px_white,0_0_0_4px_#2B4DF8]"
      />

      {/* Sync indicator — visible when multiple widgets share data */}
      {variant === 'widget' && syncCount > 1 && (
        <div
          className="-ml-0.5 animate-[sync-in_300ms_ease-out_both]"
        >
          <Tooltip>
            <Tooltip.Trigger asChild>
              <IconButton
                aria-label={`Synced with ${syncCount - 1} other view${syncCount > 2 ? 's' : ''}`}
                variant="ghost"
                size="medium"
                css={{ borderRadius: 8 }}
              >
                <IconArrowUpRight color="icon-neutrals-subtle" />
              </IconButton>
            </Tooltip.Trigger>
            <Tooltip.Content side="top" sideOffset={4}>
              Synced with {syncCount - 1} other view{syncCount > 2 ? 's' : ''}
            </Tooltip.Content>
          </Tooltip>
        </div>
      )}

      {variant === 'widget' && onExitCanvas && (
        <div className={`translate-y-1 transition-all duration-200 ease-out ${
          isFocused
            ? 'opacity-0 scale-[0.85] pointer-events-none'
            : menuOpen
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-[0.85] group-hover/title:opacity-100 group-hover/title:scale-100'
        }`}>
          <IconButton aria-label="Expand to full view" variant="ghost" size="medium" onPress={onExitCanvas} css={{ borderRadius: 8 }}>
            <IconArrowsOutSimple color="icon-neutrals-subtle" />
          </IconButton>
        </div>
      )}

      <div className={`translate-y-1 transition-all duration-200 ease-out ${
        isFocused
          ? 'opacity-0 scale-[0.85] pointer-events-none'
          : menuOpen
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-[0.85] group-hover/title:opacity-100 group-hover/title:scale-100'
      }`}>
        <DropdownMenu onOpen={() => setMenuOpen(true)} onClose={() => setMenuOpen(false)}>
          <DropdownMenu.Trigger asChild>
            <IconButton aria-label="More options" variant="ghost" size="medium" css={{ borderRadius: 8 }}>
              <IconDotsThree color="icon-neutrals-subtle" />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content side="bottom" align="start" alignOffset={-12} css={{ minWidth: MENU_WIDTH, zIndex: 30 }}>
            <DropdownMenu.Item>
              <DropdownMenu.IconSlot><IconStar /></DropdownMenu.IconSlot>
              Set as default view
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <DropdownMenu.IconSlot><IconLink /></DropdownMenu.IconSlot>
              Copy link
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>
              <DropdownMenu.IconSlot><IconClockCounterClockwise /></DropdownMenu.IconSlot>
              Version history
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <DropdownMenu.IconSlot><IconInformationMarkCircle /></DropdownMenu.IconSlot>
              Info
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>
              <DropdownMenu.IconSlot><IconPen /></DropdownMenu.IconSlot>
              Rename
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <DropdownMenu.IconSlot><IconSquaresTwoOverlap /></DropdownMenu.IconSlot>
              Duplicate
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <DropdownMenu.IconSlot><IconTrash /></DropdownMenu.IconSlot>
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    </div>
  )
}
