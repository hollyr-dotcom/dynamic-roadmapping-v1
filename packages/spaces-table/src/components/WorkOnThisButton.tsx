import { useState, useRef, useCallback } from 'react'
import { IconCursor } from '@mirohq/design-system'

type ButtonPhase = 'idle' | 'hovered' | 'pressed' | 'released'

const CURSOR_COLORS = {
  yellow: '#FFDD33',
  blue: '#68D3F8',
  orange: '#FE9F4D',
}

const TRANSITION_HOVER = 'all 350ms cubic-bezier(0.16, 1, 0.3, 1)'
const TRANSITION_PRESS = 'all 150ms cubic-bezier(0.2, 0, 0, 1)'
const TRANSITION_RELEASE = 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)'

function getCursorStyles(phase: ButtonPhase) {
  const main = (() => {
    switch (phase) {
      case 'idle':
        return { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }
      case 'hovered':
        return { x: 6, y: 0, rotate: -45, opacity: 1, scale: 1 }
      case 'pressed':
        return { x: 3, y: 0, rotate: -45, opacity: 1, scale: 1 }
      case 'released':
        return { x: 24, y: 0, rotate: -45, opacity: 0, scale: 1 }
    }
  })()

  const blue = (() => {
    switch (phase) {
      case 'idle':
        return { x: 8, y: -20, rotate: 90, opacity: 0, scale: 0.8 }
      case 'hovered':
        return { x: -2, y: -14, rotate: -90, opacity: 1, scale: 1 }
      case 'pressed':
        return { x: -2, y: -11, rotate: -90, opacity: 1, scale: 1 }
      case 'released':
        return { x: 24, y: -11, rotate: -90, opacity: 0, scale: 1 }
    }
  })()

  const orange = (() => {
    switch (phase) {
      case 'idle':
        return { x: 4, y: 20, rotate: -90, opacity: 0, scale: 0.8 }
      case 'hovered':
        return { x: -2, y: 14, rotate: 2, opacity: 1, scale: 1 }
      case 'pressed':
        return { x: -2, y: 11, rotate: 2, opacity: 1, scale: 1 }
      case 'released':
        return { x: 24, y: 11, rotate: 2, opacity: 0, scale: 1 }
    }
  })()

  return { main, blue, orange }
}

function getTextStyle(phase: ButtonPhase) {
  switch (phase) {
    case 'idle':
      return { x: 0, opacity: 1 }
    case 'hovered':
      return { x: 3, opacity: 1 }
    case 'pressed':
      return { x: 6, opacity: 1 }
    case 'released':
      return { x: -40, opacity: 0 }
  }
}

function getTransition(phase: ButtonPhase, prevPhase: ButtonPhase) {
  if (phase === 'idle' && prevPhase === 'released') return 'none'
  switch (phase) {
    case 'idle': return TRANSITION_HOVER
    case 'hovered': return TRANSITION_HOVER
    case 'pressed': return TRANSITION_PRESS
    case 'released': return TRANSITION_RELEASE
  }
}

const SIZE_CONFIG = {
  medium: { height: 32, fontSize: 14, padding: '0 10px', iconSize: 16, secondaryIconSize: 15, minWidth: 130 },
  large:  { height: 40, fontSize: 16, padding: '0 12px', iconSize: 20, secondaryIconSize: 18, minWidth: 151 },
}

interface WorkOnThisButtonProps {
  onPress?: () => void
  label?: string
  size?: 'medium' | 'large'
}

export function WorkOnThisButton({ onPress, label = 'Work on this', size = 'medium' }: WorkOnThisButtonProps) {
  const config = SIZE_CONFIG[size]
  const [phase, setPhase] = useState<ButtonPhase>('idle')
  const prevPhaseRef = useRef<ButtonPhase>('idle')
  const releaseTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const changePhase = useCallback((next: ButtonPhase) => {
    prevPhaseRef.current = phase
    setPhase(next)
  }, [phase])

  const handleMouseEnter = useCallback(() => {
    if (releaseTimer.current) clearTimeout(releaseTimer.current)
    changePhase('hovered')
  }, [changePhase])

  const handleMouseLeave = useCallback(() => {
    if (releaseTimer.current) clearTimeout(releaseTimer.current)
    changePhase('idle')
  }, [changePhase])

  const handleMouseDown = useCallback(() => {
    if (releaseTimer.current) clearTimeout(releaseTimer.current)
    changePhase('pressed')
  }, [changePhase])

  const handleMouseUp = useCallback(() => {
    releaseTimer.current = setTimeout(() => {
      changePhase('released')
      onPress?.()
      releaseTimer.current = setTimeout(() => {
        changePhase('idle')
      }, 1500)
    }, 220)
  }, [changePhase, onPress])

  const cursors = getCursorStyles(phase)
  const text = getTextStyle(phase)
  const transition = getTransition(phase, prevPhaseRef.current)

  return (
    <button
      className="relative flex items-center justify-center gap-1 overflow-hidden cursor-pointer border-0"
      style={{
        background: '#2A2923',
        borderRadius: 8,
        height: config.height,
        padding: config.padding,
        minWidth: config.minWidth,
        width: '100%',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <span
        className="font-body font-semibold text-white whitespace-nowrap select-none"
        style={{
          fontSize: config.fontSize,
          lineHeight: 1,
          transform: `translateX(${text.x}px)`,
          opacity: text.opacity,
          transition,
        }}
      >
        {label}
      </span>

      <div className="relative" style={{ width: config.iconSize + 4, height: config.iconSize + 4, marginLeft: 4 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translate(${cursors.main.x}px, ${cursors.main.y}px) rotate(${cursors.main.rotate}deg) scale(${cursors.main.scale})`,
            opacity: cursors.main.opacity,
            transition,
            color: phase === 'idle' ? 'white' : CURSOR_COLORS.yellow,
          }}
        >
          <IconCursor css={{ width: config.iconSize, height: config.iconSize }} />
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translate(${cursors.blue.x}px, ${cursors.blue.y}px) rotate(${cursors.blue.rotate}deg) scale(${cursors.blue.scale})`,
            opacity: cursors.blue.opacity,
            transition,
            color: CURSOR_COLORS.blue,
          }}
        >
          <IconCursor css={{ width: config.secondaryIconSize, height: config.secondaryIconSize }} />
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translate(${cursors.orange.x}px, ${cursors.orange.y}px) rotate(${cursors.orange.rotate}deg) scale(${cursors.orange.scale})`,
            opacity: cursors.orange.opacity,
            transition,
            color: CURSOR_COLORS.orange,
          }}
        >
          <IconCursor css={{ width: config.secondaryIconSize, height: config.secondaryIconSize }} />
        </div>
      </div>
    </button>
  )
}
