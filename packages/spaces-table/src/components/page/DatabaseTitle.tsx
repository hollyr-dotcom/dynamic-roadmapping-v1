import React, { useRef, useEffect, useState } from 'react'
import {
  IconButton,
  IconDotsThree,
  IconArrowsOutSimple,
  IconArrowUpRight,
  IconFileSpreadsheet,
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
import { JiraLogo } from '../JiraLogo'

function RobotIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M72,104a16,16,0,1,1,16,16A16,16,0,0,1,72,104Zm96,16a16,16,0,1,0-16-16A16,16,0,0,0,168,120Zm68-40V192a36,36,0,0,1-36,36H56a36,36,0,0,1-36-36V80A36,36,0,0,1,56,44h60V16a12,12,0,0,1,24,0V44h60A36,36,0,0,1,236,80Zm-24,0a12,12,0,0,0-12-12H56A12,12,0,0,0,44,80V192a12,12,0,0,0,12,12H200a12,12,0,0,0,12-12Zm-12,82a30,30,0,0,1-30,30H86a30,30,0,0,1,0-60h84A30,30,0,0,1,200,162Zm-80-6v12h16V156ZM86,168H96V156H86a6,6,0,0,0,0,12Zm90-6a6,6,0,0,0-6-6H160v12h10A6,6,0,0,0,176,162Z" /></svg>
  )
}

interface DatabaseTitleProps {
  opacity: number
  scrollFade?: number
  title: string
  onTitleChange: (title: string) => void
  variant?: 'page' | 'widget'
  onExitCanvas?: () => void
  syncCount?: number
  syncing?: boolean
  onImportSource?: (source: 'jira' | 'miro' | 'csv') => void
  showImportPopover?: boolean
  onDismissImportPopover?: () => void
  disableControls?: boolean
}

export function DatabaseTitle({ opacity, scrollFade = 0, title, onTitleChange, variant = 'page', onExitCanvas, syncCount = 0, syncing = false, onImportSource, showImportPopover, onDismissImportPopover, disableControls }: DatabaseTitleProps) {
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
  const [isImportMenuOpen, setIsImportMenuOpen] = useState(false)
  const importBtnRef = useRef<HTMLSpanElement>(null)
  const [importBtnRect, setImportBtnRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (showImportPopover && importBtnRef.current) {
      const r = importBtnRef.current.getBoundingClientRect()
      setImportBtnRect(r)
    }
    if (!showImportPopover) setImportBtnRect(null)
  }, [showImportPopover])

  return (
    <div
      className={`group/title sticky left-0 z-30 flex items-center gap-1 pb-1 shrink-0 ${variant === 'widget' ? 'px-0' : 'px-14'}`}
      style={{ paddingTop: variant === 'widget' ? 0 : '28px', opacity: variant === 'widget' ? opacity : 1 - scrollFade }}
    >
      {/* Hidden span to measure text width */}
      <span
        ref={measureRef}
        aria-hidden
        className="font-heading font-semibold leading-[1.4] absolute invisible whitespace-pre"
        style={{ fontSize: '48px', padding: '0 2px' }}
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
          fontSize: '48px',
          width: inputWidth ? `${inputWidth}px` : 'auto',
        }}
        className="title-input font-heading font-semibold text-[#222428] leading-[1.4] px-0.5 rounded bg-transparent border-none outline-none cursor-default transition-colors duration-150 hover:bg-[#F1F2F5] hover:cursor-pointer focus:bg-white focus:cursor-text focus:shadow-[0_0_0_2px_white,0_0_0_4px_#2B4DF8]"
      />

      {/* Sync indicator — visible when multiple widgets share data */}
      {variant === 'widget' && syncCount > 1 && (
        <div
          className="-ml-0.5 mt-[6px] animate-[sync-in_300ms_ease-out_both]"
        >
          <Tooltip>
            <Tooltip.Trigger asChild>
              <span className={syncing ? 'sync-pulse' : ''}>
              <IconButton
                aria-label={`Synced with ${syncCount - 1} other view${syncCount > 2 ? 's' : ''}`}
                variant="ghost"
                size="medium"
                css={{ borderRadius: 8 }}
              >
                <IconArrowUpRight color="icon-neutrals-subtle" />
              </IconButton>
              </span>
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

      {/* Import agents button */}
      {variant === 'page' && (
        <div className={`translate-y-1 transition-all duration-200 ease-out ${
          isFocused
            ? 'opacity-0 scale-[0.85] pointer-events-none'
            : menuOpen || isImportMenuOpen || showImportPopover
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-[0.85] group-hover/title:opacity-100 group-hover/title:scale-100'
        }`}>
          <span ref={importBtnRef} className="inline-flex">
            <DropdownMenu onOpen={() => { setIsImportMenuOpen(true); if (showImportPopover) onDismissImportPopover?.() }} onClose={() => setIsImportMenuOpen(false)}>
              <Tooltip>
                <Tooltip.Trigger asChild>
                  <DropdownMenu.Trigger asChild>
                    <IconButton aria-label="Import agents" variant="ghost" size="medium" css={isImportMenuOpen ? { borderRadius: 8, background: '#F1F2F5' } : { borderRadius: 8 }}>
                      <RobotIcon />
                    </IconButton>
                  </DropdownMenu.Trigger>
                </Tooltip.Trigger>
                <Tooltip.Content side="top" sideOffset={4}>
                  Import agents
                </Tooltip.Content>
              </Tooltip>
              <DropdownMenu.Content side="bottom" align="start" alignOffset={-12} css={{ minWidth: MENU_WIDTH, zIndex: 30 }}>
                <DropdownMenu.Item onSelect={() => onImportSource?.('jira')}>
                  <DropdownMenu.IconSlot><JiraLogo size={20} /></DropdownMenu.IconSlot>
                  Jira
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => onImportSource?.('csv')}>
                  <DropdownMenu.IconSlot><IconFileSpreadsheet /></DropdownMenu.IconSlot>
                  CSV
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </span>
        </div>
      )}

      <div className={`translate-y-1 transition-all duration-200 ease-out ${
        isFocused
          ? 'opacity-0 scale-[0.85] pointer-events-none'
          : menuOpen || isImportMenuOpen || showImportPopover
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

      {/* Import agents popover */}
      {showImportPopover && importBtnRect && (
        <div
          className="import-popover-tip-center"
          data-import-popover
          style={{
            position: 'fixed',
            top: importBtnRect.y + 10,
            left: importBtnRect.x,
            zIndex: 9999,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#44464F' }} />
            <div style={{ width: 1, height: 16, background: '#44464F' }} />
          </div>
          <div
            style={{
              position: 'relative',
              background: '#2B2D33',
              borderRadius: 8,
              padding: '14px 40px 16px 16px',
              color: '#fff',
              width: 260,
              boxShadow: '0 2px 8px rgba(34,36,40,0.12), 0 0 12px rgba(34,36,40,0.04)',
            }}
          >
            <button
              onClick={onDismissImportPopover}
              style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 0, color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <p className="font-heading font-semibold text-[16px] leading-snug mb-1">Import agents</p>
            <p className="font-body text-[14px] leading-snug text-white/60">Add agents that automatically sync and import records from your tools.</p>
          </div>
        </div>
      )}
    </div>
  )
}
