import { useEffect, useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

interface InsightsToastProps {
  onDismiss: () => void
}

// Recreates the Figma "Amazing!" reaction sticker by compositing its layers.
// FRAME = logical Figma frame size; everything is scaled down to `size` px.
const FRAME = 648

function AmazingReaction({ size = 80 }: { size?: number }) {
  const scale = size / FRAME
  return (
    // Outer container defines the rendered size; overflow:visible lets bubbles peek out
    <div style={{ width: size, height: size, position: 'relative', overflow: 'visible', pointerEvents: 'none' }}>
      {/* Inner logical frame — all children use Figma coordinates, then scale down */}
      <div style={{
        width: FRAME,
        height: FRAME,
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}>
        {/* Layer 1: raster PNG — pink blob body + floating spheres (all baked in) */}
        <img
          src="/reaction-blob.png"
          alt=""
          style={{ position: 'absolute', left: -353, top: -111, width: 1354, height: 758 }}
        />

        {/* Layer 2: face SVG — heart eyes, pupils, mouth as vectors */}
        {/* Actual bounds derived from Figma inset: left:158, top:171, w:300, h:196 */}
        <img
          src="/reaction-body.svg"
          alt=""
          style={{ position: 'absolute', left: 158, top: 171, width: 300, height: 196 }}
        />
      </div>
    </div>
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
    const dismissTimer = setTimeout(dismiss, 2000)
    const confettiTimer = setTimeout(() => setShowConfetti(false), 2200)
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
            left: 0,
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
        className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 rounded-[8px] px-4 py-4"
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
          style={{ top: -40, right: -24, zIndex: 1 }}
        >
          <AmazingReaction size={80} />
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

      </div>
    </>
  )
}
