import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@mirohq/design-system'
import type { SpaceRow } from '@spaces/shared'
import { JiraLogo } from '../JiraLogo'

const QUICK_PROMPTS = ['Write a PRD', 'Explore insights', 'Estimate with team']

interface AddToBoardPopoverProps {
  row: SpaceRow
  anchorRect: DOMRect
  onClose: () => void
  onConfirm: (rowId: string, prompt: string) => void
}

export function AddToBoardPopover({ row, anchorRect, onClose, onConfirm }: AddToBoardPopoverProps) {
  const [promptText, setPromptText] = useState('')
  const [activeQuickPrompt, setActiveQuickPrompt] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  // Auto-focus textarea on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
    })
    requestAnimationFrame(() => setEntered(true))
  }, [])

  // Click-outside to dismiss
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  // Escape to dismiss
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleQuickPrompt = useCallback((prompt: string) => {
    if (activeQuickPrompt === prompt) {
      setPromptText('')
      setActiveQuickPrompt(null)
    } else {
      setPromptText(prompt)
      setActiveQuickPrompt(prompt)
    }
    textareaRef.current?.focus()
  }, [activeQuickPrompt])

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptText(e.target.value)
    setActiveQuickPrompt(null)
  }, [])

  const handleConfirm = useCallback(() => {
    if (promptText.trim()) {
      onConfirm(row.id, promptText.trim())
    }
  }, [row.id, promptText, onConfirm])

  // Position: above or below the row, depending on space
  const popoverWidth = 300
  const popoverHeight = 260
  const spaceBelow = window.innerHeight - anchorRect.bottom - 16
  const placeBelow = spaceBelow >= popoverHeight
  const top = placeBelow
    ? anchorRect.bottom + 8
    : anchorRect.top - popoverHeight - 8
  const left = anchorRect.left + 56

  const clampedLeft = Math.max(8, Math.min(left, window.innerWidth - popoverWidth - 8))
  const clampedTop = Math.max(8, top)

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: clampedTop,
        left: clampedLeft,
        width: popoverWidth,
        zIndex: 100,
        background: '#fafafc',
        borderRadius: 16,
        paddingTop: 12,
        overflow: 'clip',
        boxShadow: '0px 0px 12px rgba(34,36,40,0.04), 0px 2px 8px rgba(34,36,40,0.12)',
        display: 'flex',
        flexDirection: 'column',
        opacity: entered ? 1 : 0,
        transform: entered ? 'scale(1)' : 'scale(0.96)',
        transition: 'opacity 150ms cubic-bezier(0.16, 1, 0.3, 1), transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Record reference tab — centered, narrower than container */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 'calc(100% - 24px)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 8px 6px',
          borderRadius: '8px 8px 0 0',
          background: '#f1f2f5',
          overflow: 'hidden',
          minWidth: 0,
        }}>
          {row.jiraKey && (
            <>
              <div style={{ flexShrink: 0 }}>
                <JiraLogo size={16} />
              </div>
              <span style={{ fontSize: 14, fontFamily: "'Noto Sans', sans-serif", color: '#656B81', whiteSpace: 'nowrap', flexShrink: 0 }}>{row.jiraKey}</span>
            </>
          )}
          <span style={{
            fontSize: 14,
            fontFamily: "'Noto Sans', sans-serif",
            color: '#222428',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0,
            flex: 1,
          }}>{row.title}</span>
        </div>
      </div>

      {/* Prompt area — full width, top border, same bg as container */}
      <div style={{
        borderTop: '1px solid #e9eaef',
        padding: '16px 8px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        {/* Textarea */}
        <div style={{ padding: '0 8px' }}>
          <textarea
            ref={textareaRef}
            value={promptText}
            onChange={handleTextChange}
            placeholder="What's your board for?"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleConfirm()
              }
            }}
            style={{
              width: '100%',
              height: 24,
              background: 'transparent',
              fontSize: 14,
              fontFamily: "'Noto Sans', sans-serif",
              border: 'none',
              outline: 'none',
              resize: 'none',
              color: '#222428',
              lineHeight: 1.4,
              padding: 0,
            }}
          />
        </div>

        {/* Pills + button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick prompt pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 4px' }}>
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                style={{
                  height: 32,
                  padding: '0 8px',
                  border: `1px solid ${activeQuickPrompt === prompt ? '#4262FF' : '#e0e2e8'}`,
                  borderRadius: 8,
                  background: activeQuickPrompt === prompt ? '#F2F4FC' : '#fafafc',
                  fontSize: 14,
                  fontFamily: "'Noto Sans', sans-serif",
                  color: '#222428',
                  cursor: 'pointer',
                  transition: 'border-color 150ms, background 150ms',
                  whiteSpace: 'nowrap',
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Button */}
          <Button variant="primary" size="large" onPress={handleConfirm} css={{ width: '100%', borderRadius: 8, justifyContent: 'center' }}>
            Add to board
          </Button>
        </div>
      </div>
    </div>
  )
}
