export function TimelinePlaceholder() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] item-enter" style={{ animationDelay: '80ms' }}>
      <div className="w-16 h-16 rounded-2xl bg-[#F1F2F5] flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#656B81" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <rect x="4" y="10" width="7" height="4" rx="1" />
          <rect x="9" y="16" width="8" height="4" rx="1" />
          <rect x="13" y="10" width="5" height="4" rx="1" />
        </svg>
      </div>
      <h3 className="font-heading font-semibold text-lg text-[#222428] mb-2">Timeline view</h3>
      <p className="font-body text-sm text-[#656B81] text-center max-w-[280px] leading-relaxed">
        Visualise initiatives on a timeline. This view is coming soon.
      </p>
    </div>
  )
}
