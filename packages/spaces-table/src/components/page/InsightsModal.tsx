import { Button } from '@mirohq/design-system'

// Local public assets for the Amazing reaction illustration
const imgBlob      = '/reaction-blob.png'
const imgCharacter = '/reaction-character.svg'
const imgBody      = '/reaction-body.svg'
const imgBubbles   = '/reaction-bubbles.svg'
const imgSparkL    = '/reaction-spark-l.svg'
const imgSparkR    = '/reaction-spark-r.svg'

interface InsightsModalProps {
  onEnable: () => void
  onSkip: () => void
}

export function InsightsModal({ onEnable, onSkip }: InsightsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onSkip} />

      {/* Modal */}
      <div
        className="relative bg-white border border-[#e0e2e8] rounded-[12px] flex flex-col overflow-hidden"
        style={{ width: '520px', boxShadow: '0px 4px 16px 0px rgba(5,0,56,0.12)', fontFamily: 'Open Sans, sans-serif' }}
      >
        {/* Close button */}
        <button
          onClick={onSkip}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f3f4f6] text-[#656b81] transition-colors z-10"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Hero illustration */}
        <div className="relative overflow-hidden shrink-0" style={{ height: 200, background: '#fce4f0' }}>
          {/* Bubbles background */}
          <img alt="" className="absolute pointer-events-none" src={imgBubbles}
            style={{ width: '100%', height: '100%', top: 0, left: 0, objectFit: 'cover', opacity: 0.5 }} />
          {/* Spark left */}
          <img alt="" className="absolute pointer-events-none" src={imgSparkL}
            style={{ width: 48, bottom: 56, left: '28%', transform: 'rotate(-15deg)' }} />
          {/* Spark right */}
          <img alt="" className="absolute pointer-events-none" src={imgSparkR}
            style={{ width: 48, bottom: 56, right: '26%', transform: 'rotate(15deg)' }} />
          {/* Blob */}
          <img alt="" className="absolute pointer-events-none" src={imgBlob}
            style={{ width: 140, bottom: 0, left: '50%', transform: 'translateX(-50%)' }} />
          {/* Body overlay */}
          <img alt="" className="absolute pointer-events-none" src={imgBody}
            style={{ width: 140, bottom: 0, left: '50%', transform: 'translateX(-50%)' }} />
          {/* Character face */}
          <img alt="" className="absolute pointer-events-none" src={imgCharacter}
            style={{ width: 160, bottom: 0, left: '50%', transform: 'translateX(-50%)' }} />
          {/* Amazing! text */}
          <p className="absolute pointer-events-none select-none"
            style={{
              fontFamily: "'Roobert PRO', sans-serif",
              fontWeight: 800,
              fontSize: 48,
              color: 'white',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%) rotate(-14deg)',
              whiteSpace: 'nowrap',
              WebkitTextStroke: '3px #7b1547',
              paintOrder: 'stroke fill',
              lineHeight: 1,
            }}
          >
            Amazing!
          </p>
        </div>

        {/* Top section */}
        <div className="flex flex-col gap-4 pt-8 px-12 pb-0">
          {/* Title */}
          <h2
            className="text-[24px] text-black leading-[1.35]"
            style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 500 }}
          >
            Enrich your backlog with Miro Insights
          </h2>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 pt-6 px-12">
          {/* Description */}
          <div className="text-[14px] text-[#222428] leading-[1.4]">
            <p className="mb-0">Your imported items will automatically be enriched with customer intelligence:</p>
            <ul className="list-disc mt-1 space-y-0" style={{ paddingLeft: '21px' }}>
              {['Mentions', 'Estimated revenue impact', 'Company coverage', '& more.'].map(item => (
                <li key={item} className="leading-[1.4]">{item}</li>
              ))}
            </ul>
          </div>

          {/* Callout */}
          <div className="relative bg-[#EEF3FF] border border-[#C6D4FF] rounded-xl px-4 py-3">
            <button
              onClick={onSkip}
              className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded hover:bg-[#dce6ff] text-[#656b81] transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="flex items-start gap-2 pr-5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
                <circle cx="8" cy="8" r="7" stroke="#4262FF" strokeWidth="1.5"/>
                <path d="M8 7v4.5" stroke="#4262FF" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="4.5" r="0.75" fill="#4262FF"/>
              </svg>
              <div>
                <p className="text-[14px] font-semibold text-[#222428] leading-[1.5] mb-0">Automatic refresh</p>
                <p className="text-[14px] text-[#222428] leading-[1.4] mt-0.5">
                  Data refreshes automatically as new insights flow in — no manual updates needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 pt-8 pb-[60px] px-12">
          <Button variant="primary" size="large" onPress={onEnable}>
            <Button.Label>Enable insights</Button.Label>
          </Button>
          <Button variant="ghost" size="large" onPress={onSkip}>
            <Button.Label>Skip for now</Button.Label>
          </Button>
        </div>
      </div>
    </div>
  )
}
