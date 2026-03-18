import { useEffect, useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Button } from '@mirohq/design-system'

interface InsightsToastProps {
  onDismiss: () => void
}

function AmazingReaction({ size = 80 }: { size?: number }) {
  return (
    <img
      src="/amazing-reaction.png"
      alt=""
      style={{ width: size, height: size, pointerEvents: 'none' }}
    />
  )
}

export function InsightsToast({ onDismiss }: InsightsToastProps) {
  const [exiting, setExiting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)

  const dismiss = () => {
    setExiting(true)
    setTimeout(onDismiss, 300)
  }

  useEffect(() => {
    const dismissTimer = setTimeout(dismiss, 4000)
    const confettiTimer = setTimeout(() => setShowConfetti(false), 4200)
    return () => { clearTimeout(dismissTimer); clearTimeout(confettiTimer) }
  }, [])

  return (
    <>
      {/* Confetti burst — sits behind the toast */}
      {showConfetti && (
        <div
          className="fixed pointer-events-none"
          style={{
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 520,
            height: 520,
            zIndex: 49,
            animation: exiting ? 'toastSlideDown 0.3s ease forwards' : undefined,
          }}
        >
          <DotLottieReact
            src="/confetti.json"
            autoplay
            loop={false}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      {/* Toast */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 rounded-[8px] px-4 py-4"
        style={{
          width: '480px',
          backgroundColor: '#1a1b1e',
          boxShadow: '0px 8px 32px 0px rgba(5,0,56,0.08)',
          fontFamily: 'Open Sans, sans-serif',
          overflow: 'visible',
          animation: exiting ? 'toastSlideDown 0.3s ease forwards' : 'toastSlideUp 0.25s ease',
        }}
      >
        {/* Reaction sticker — pops in at top-right corner */}
        <div
          className="reaction-pop absolute pointer-events-none"
          style={{ top: -84, right: -24, zIndex: 1 }}
        >
          <AmazingReaction size={160} />
        </div>

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded text-[#aeb2c0] hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Text */}
        <div className="flex flex-col gap-1 pb-1 pr-6">
          <p
            className="text-[16px] text-white leading-[1.5]"
            style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1" }}
          >
            Import successful
          </p>
          <p className="text-[14px] text-white leading-[1.4]">
            9,847 of 10,000 completed
          </p>
          <p className="text-[14px] text-[#aeb2c0] leading-[1.4]">
            Skipped 6 duplicates and 5 with special characters
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Button variant="primary" size="medium" onPress={dismiss}>Share with team</Button>
        </div>

      </div>
    </>
  )
}
