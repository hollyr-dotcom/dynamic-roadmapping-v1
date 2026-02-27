import React, { useRef, useState } from 'react'
import { IconTickCircle } from '@mirohq/design-system'

type BarState = 'idle' | 'typing' | 'loading' | 'success'

const AiIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.1472 3.80786C13.2845 3.80836 14.2484 6.31429 14.6101 9.81567C15.017 7.17722 15.9354 5.33618 17.0046 5.33618C18.451 5.33633 19.6237 8.70471 19.6238 12.8596C19.6238 17.0147 18.4511 20.3829 17.0046 20.3831C15.9353 20.3831 15.017 18.5423 14.6101 15.9036C14.2484 19.4052 13.2845 21.9119 12.1472 21.9124C10.9773 21.9124 9.98622 19.2609 9.65015 15.6018C9.22866 17.7458 8.33139 19.2278 7.28882 19.2278C5.84254 19.2273 4.66968 16.376 4.66968 12.8596C4.66974 9.34334 5.84258 6.49295 7.28882 6.49243C8.3313 6.49243 9.22862 7.97377 9.65015 10.1174C9.98626 6.45859 10.9773 3.80786 12.1472 3.80786Z" fill="black"/>
  </svg>
)

const UpArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 13V3M8 3L3 8M8 3L13 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

interface AiBarProps {
  placeholder: string
}

export function AiBar({ placeholder }: AiBarProps) {
  const [state, setState] = useState<BarState>('idle')
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const hasContent = value.trim().length > 0
  const showSubmitButton = state === 'typing' && hasContent
  const isLoading = state === 'loading'
  const isSuccess = state === 'success'
  const isIdle = state === 'idle'
  const isInteractive = state === 'idle' || state === 'typing'

  const handleSubmit = () => {
    if (!hasContent || state !== 'typing') return
    setState('loading')
    setValue('')
    setTimeout(() => {
      setState('success')
      setTimeout(() => {
        setState('idle')
      }, 1500)
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') {
      setValue('')
      setState('idle')
      inputRef.current?.blur()
    }
  }

  return (
    <div
      className="item-enter relative flex items-center justify-between pl-6 pr-3 bg-[#F7F7F7] rounded-full border-4 border-white h-16 w-full shadow-[0px_12px_32px_0px_rgba(34,36,40,0.2),0px_0px_8px_0px_rgba(34,36,40,0.06)]"
      style={{ animationDelay: '400ms' }}
      onClick={() => {
        if (isInteractive) inputRef.current?.focus()
      }}
    >
      {/* Left: input + loading shimmer text + success text */}
      <div className="flex-1 min-w-0 relative flex items-center cursor-text">
        {/* Loading shimmer text */}
        <span
          className={`absolute left-0 font-body whitespace-nowrap transition-opacity duration-200 pointer-events-none select-none text-shimmer ${isLoading ? 'opacity-100' : 'opacity-0'}`}
          style={{ fontSize: '16px', fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        >
          Working on it&hellip;
        </span>

        {/* Success text */}
        <span
          className={`absolute left-0 font-body text-[#222428] whitespace-nowrap transition-opacity duration-200 pointer-events-none select-none ${isSuccess ? 'opacity-100' : 'opacity-0'}`}
          style={{ fontSize: '16px', fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        >
          Done. I&apos;ve made those changes.
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          value={value}
          onChange={e => { if (isInteractive) setValue(e.target.value) }}
          onFocus={() => { if (state === 'idle') setState('typing') }}
          onKeyDown={handleKeyDown}
          readOnly={!isInteractive}
          placeholder={placeholder}
          className={`w-full bg-transparent outline-none font-body text-[#222428] placeholder:text-[#6F7489] transition-opacity duration-200 ${(isLoading || isSuccess) ? 'opacity-0' : 'opacity-100'}`}
          style={{ fontSize: '16px', fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        />
      </div>

      {/* Right: AI icon / submit button / checkmark */}
      <div className="relative shrink-0 flex items-center justify-center ml-3" style={{ width: 32, height: 32 }}>

        {/* AI icon — idle, typing-empty, loading */}
        <div
          className={`absolute transition-opacity duration-200 ${(showSubmitButton || isSuccess) ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${isLoading ? 'ai-spin' : (isIdle ? 'sparks-pulse' : '')}`}
        >
          <AiIcon />
        </div>

        {/* Submit button — typing with content */}
        <button
          className={`absolute flex items-center justify-center w-8 h-8 rounded-full bg-[#4262FF] cursor-pointer transition-opacity duration-200 ${showSubmitButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={e => { e.stopPropagation(); handleSubmit() }}
          onMouseDown={e => e.preventDefault()}
          tabIndex={showSubmitButton ? 0 : -1}
          aria-label="Submit prompt"
        >
          <UpArrowIcon />
        </button>

        {/* Checkmark — success */}
        <div
          className={`absolute transition-opacity duration-200 text-[#1BA672] ${isSuccess ? 'opacity-100' : 'opacity-0'}`}
        >
          <IconTickCircle size="medium" />
        </div>
      </div>
    </div>
  )
}
