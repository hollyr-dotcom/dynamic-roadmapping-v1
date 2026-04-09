import { useState, useRef, useCallback } from 'react'
import { IconCursor, IconCursorFilled, IconRocket } from '@mirohq/design-system'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

/* ─── Rocket body SVG in 16px container (purple) ─── */
function RocketShipSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M12.8495 1.97393C13.0158 1.97675 13.1512 1.98365 13.2467 1.99021C13.2943 1.99348 13.3323 1.99687 13.3593 1.99932C13.3728 2.00055 13.3839 2.00178 13.3918 2.00258C13.3958 2.00297 13.3991 2.00297 13.4016 2.00323L13.4049 2.00388H13.4062L13.9947 2.58396L13.9954 2.58591V2.58917C13.9957 2.59166 13.9962 2.59518 13.9967 2.59893C13.9975 2.60656 13.9986 2.61692 13.9999 2.62953C14.0025 2.65485 14.0057 2.69018 14.009 2.73435C14.0158 2.82272 14.0231 2.9477 14.026 3.10219C14.0317 3.41058 14.0203 3.84138 13.9524 4.33982C13.8173 5.33062 13.4525 6.63135 12.5123 7.75974L12.4713 7.80466L12.0566 8.21872L12.6536 11.2024L12.4713 11.8047L9.80461 14.4713L8.67961 14.1308L8.052 10.9948L5.00448 7.94724L1.86906 7.32029L1.52856 6.19529L4.19523 3.52862L4.79744 3.34633L7.78052 3.94268L8.19523 3.52862L8.38403 3.35089C9.34679 2.49874 10.5843 2.17137 11.539 2.04685C12.0575 1.97924 12.518 1.96832 12.8495 1.97393ZM9.38989 10.8854L9.74211 12.6478L11.276 11.1139L10.9237 9.35154L9.38989 10.8854ZM12.6926 3.30662C12.4251 3.30686 12.0845 3.32038 11.7109 3.36912C10.8689 3.47897 9.94326 3.75261 9.26945 4.34763L9.13794 4.47133L6.27596 7.33331L8.66659 9.72393L11.4999 6.88995C12.2167 6.02175 12.5166 4.99684 12.6308 4.15948C12.6754 3.83222 12.6903 3.53994 12.6926 3.30662ZM3.35148 6.25714L5.11385 6.60935L6.64771 5.0755L4.88534 4.72328L3.35148 6.25714Z" fill="#8F7FEE"/>
    </svg>
  )
}

/* ─── Rocket flame SVG in 16px container (orange) ─── */
function RocketFlameSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4.47127 10.4713C3.9502 10.9924 3.71389 11.2402 3.56502 11.5677C3.45794 11.8034 3.38374 12.1144 3.35148 12.6478C3.88521 12.6155 4.19641 12.542 4.43221 12.4349C4.7597 12.286 5.00746 12.0497 5.52856 11.5286L6.47127 12.4713C5.99252 12.9501 5.57331 13.3806 4.98429 13.6484C4.38999 13.9186 3.68614 14 2.66659 14L1.99992 13.3333C1.99992 12.3138 2.08135 11.6099 2.35148 11.0156C2.61927 10.4266 3.0498 10.0074 3.52856 9.52862L4.47127 10.4713Z" fill="#FE9F4D"/>
    </svg>
  )
}

/* ─── Work on canvas — cursor collaboration hover ─── */
export function WorkOnCanvasButton({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [companionsIn, setCompanionsIn] = useState(false)
  const companionTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const handleEnter = useCallback(() => {
    setHovered(true)
    if (companionTimer.current) clearTimeout(companionTimer.current)
    companionTimer.current = setTimeout(() => setCompanionsIn(true), 50)
  }, [])

  const handleLeave = useCallback(() => {
    setHovered(false)
    setCompanionsIn(false)
    if (companionTimer.current) clearTimeout(companionTimer.current)
  }, [])

  return (
    <button
      className="relative flex items-center cursor-pointer"
      style={{
        border: '1px solid',
        borderColor: hovered ? '#d5d5d2' : '#e0e2e8',
        borderRadius: 8,
        padding: '0 10px 0 6px',
        height: 32,
        background: '#fff',
        fontSize: 14,
        fontWeight: 500,
        color: '#222428',
        fontFamily: 'var(--font-noto)',
        overflow: 'hidden',
        transition: `border-color 200ms ${EASE}`,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
    >
      <div style={{ position: 'relative', width: 20, height: 32, flexShrink: 0, marginRight: 4 }}>
        {/* Companion 1 (purple) */}
        <div style={{
          position: 'absolute', top: '50%', left: 1, color: '#8F7FEE',
          transition: `transform 600ms ${EASE}, opacity 400ms ${EASE}`,
          transform: companionsIn ? 'translate(5px, calc(-50% - 5px))' : 'translate(0px, -50%)',
          opacity: companionsIn ? 1 : 0,
        }}>
          <div style={{ display: 'flex', animation: companionsIn ? 'cursor-wave-2 3.1s ease-in-out infinite' : 'none' }}>
            <IconCursorFilled css={{ width: 16, height: 16 }} />
          </div>
        </div>
        {/* Companion 2 (blue) */}
        <div style={{
          position: 'absolute', top: '50%', left: 1, color: '#659DF2',
          transition: `transform 600ms ${EASE} 80ms, opacity 400ms ${EASE} 80ms`,
          transform: companionsIn ? 'translate(-2px, calc(-50% + 6px))' : 'translate(0px, -50%)',
          opacity: companionsIn ? 1 : 0,
        }}>
          <div style={{ display: 'flex', animation: companionsIn ? 'cursor-wave-3 2.8s ease-in-out infinite' : 'none' }}>
            <IconCursorFilled css={{ width: 16, height: 16 }} />
          </div>
        </div>
        {/* Main cursor — outline → filled orange */}
        <div style={{
          position: 'absolute', top: '50%', left: 1,
          transition: `transform 600ms ${EASE}`,
          transform: hovered ? 'translate(-2px, calc(-50% - 2px))' : 'translate(0px, -50%)',
        }}>
          <div style={{ display: 'flex', position: 'absolute', top: 0, left: 0, color: '#222428', transition: `opacity 250ms ${EASE}`, opacity: hovered ? 0 : 1 }}>
            <IconCursor css={{ width: 16, height: 16 }} />
          </div>
          <div style={{ display: 'flex', color: '#FE9F4D', transition: `opacity 250ms ${EASE}`, opacity: hovered ? 1 : 0, animation: hovered ? 'cursor-wave-1 2.5s ease-in-out infinite' : 'none' }}>
            <IconCursorFilled css={{ width: 16, height: 16 }} />
          </div>
        </div>
      </div>
      <span style={{ lineHeight: 1, whiteSpace: 'nowrap' }}>Work on canvas</span>
    </button>
  )
}

/* ─── Move to roadmap — rocket split hover ─── */
export function MoveToRoadmapButton({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      className="relative flex items-center cursor-pointer"
      style={{
        border: '1px solid',
        borderColor: hovered ? '#d5d5d2' : '#e0e2e8',
        borderRadius: 8,
        padding: '0 10px 0 6px',
        height: 32,
        background: '#fff',
        fontSize: 14,
        fontWeight: 500,
        color: '#222428',
        fontFamily: 'var(--font-noto)',
        overflow: 'hidden',
        transition: `border-color 200ms ${EASE}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={{ position: 'relative', width: 20, height: 32, flexShrink: 0, marginRight: 4 }}>
        {/* Outline icon — fades out on hover */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#222428', transition: `opacity 200ms ${EASE}`, opacity: hovered ? 0 : 1,
        }}>
          <IconRocket css={{ width: 16, height: 16 }} />
        </div>
        {/* Coloured ship — fades in, rumbles */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: `opacity 200ms ${EASE}`, opacity: hovered ? 1 : 0,
          animation: hovered ? 'rocket-rumble-ship 1.8s ease-in-out infinite' : 'none',
        }}>
          <RocketShipSvg />
        </div>
        {/* Flame — separates down-left, rumbles independently */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: `transform 350ms ${EASE}, opacity 250ms ${EASE}`,
          transform: hovered ? 'translate(-2px, 2px)' : 'translate(0px, 0px)',
          opacity: hovered ? 1 : 0,
          animation: hovered ? 'rocket-rumble-flame 1.4s ease-in-out infinite' : 'none',
        }}>
          <RocketFlameSvg />
        </div>
      </div>
      <span style={{ lineHeight: 1, whiteSpace: 'nowrap' }}>Move to roadmap</span>
    </button>
  )
}
