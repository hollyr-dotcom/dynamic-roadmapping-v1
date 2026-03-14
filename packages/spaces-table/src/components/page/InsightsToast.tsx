import { useEffect } from 'react'

interface InsightsToastProps {
  onDismiss: () => void
}

export function InsightsToast({ onDismiss }: InsightsToastProps) {
  // Auto-dismiss after 6 seconds
  useEffect(() => {
    const t = setTimeout(onDismiss, 6000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 rounded-[8px] px-4 py-4"
      style={{
        width: '480px',
        backgroundColor: '#1a1b1e',
        boxShadow: '0px 8px 32px 0px rgba(5,0,56,0.08)',
        fontFamily: 'Open Sans, sans-serif',
      }}
    >
      {/* Close */}
      <button
        onClick={onDismiss}
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

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onDismiss}
          className="h-10 px-5 bg-[#4262FF] hover:bg-[#2D4FE0] text-white text-[14px] font-semibold rounded-lg transition-colors"
        >
          Dismiss
        </button>
        <button
          onClick={onDismiss}
          className="h-10 px-4 text-[14px] text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          View upload
        </button>
      </div>
    </div>
  )
}
