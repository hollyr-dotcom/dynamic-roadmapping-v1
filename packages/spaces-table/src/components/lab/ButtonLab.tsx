import { useState } from 'react'
import { WorkOnCanvasButton, MoveToRoadmapButton, WorkOnThisButtonSketch } from '../PromptButtons'

/* ─── Tab bar ─── */
const TABS = ['Work on this', 'Work on canvas', 'Move to roadmap'] as const
type Tab = (typeof TABS)[number]

export function ButtonLab() {
  const [active, setActive] = useState<Tab>('Work on canvas')

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      {/* Tab bar */}
      <div
        className="flex items-center shrink-0"
        style={{
          borderBottom: '1px solid #E9EAEF',
          padding: '0 32px',
          gap: 0,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className="cursor-pointer"
            style={{
              border: 'none',
              background: 'none',
              padding: '14px 16px 12px',
              fontSize: 13,
              fontWeight: active === tab ? 600 : 400,
              fontFamily: 'var(--font-noto)',
              color: active === tab ? '#222428' : '#7D8297',
              borderBottom: active === tab ? '2px solid #222428' : '2px solid transparent',
              transition: 'all 150ms ease',
              marginBottom: -1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {active === 'Work on this' && <WorkOnThisButtonSketch />}
        {active === 'Work on canvas' && <WorkOnCanvasButton />}
        {active === 'Move to roadmap' && <MoveToRoadmapButton />}
      </div>
    </div>
  )
}
