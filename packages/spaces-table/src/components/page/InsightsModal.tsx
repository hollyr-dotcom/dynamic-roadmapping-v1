import { Button } from '@mirohq/design-system'

// Figma asset URLs (valid 7 days)
const imgV0 = 'https://www.figma.com/api/mcp/asset/d9c857ac-c452-4281-8374-00cba8f8b02b'
const imgV1 = 'https://www.figma.com/api/mcp/asset/5bfeda60-2af9-427a-b118-a90fc38faafd'
const imgV2 = 'https://www.figma.com/api/mcp/asset/a9629d09-cda7-4d1f-b288-96be75878fc1'
const imgV3 = 'https://www.figma.com/api/mcp/asset/aa4e554f-cd8d-424e-87ea-2a867af074e6'
const imgV4 = 'https://www.figma.com/api/mcp/asset/9e0d3fa2-d46a-4cc1-897f-ec8481f38fcb'
const imgV5 = 'https://www.figma.com/api/mcp/asset/7e353235-596e-4aa6-8efa-cd991bfc2714'
const imgV6 = 'https://www.figma.com/api/mcp/asset/950312b0-2b10-4409-adbd-736830a52333'

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

        {/* Top section */}
        <div className="flex flex-col gap-4 pt-12 px-12 pb-0">
          {/* Insights icon — 48×48 composite */}
          <div className="relative w-12 h-12 shrink-0">
            <div className="absolute" style={{ inset: '20.03% 5.82% 14.96% 35.39%' }}><img alt="" className="absolute block max-w-none w-full h-full" src={imgV0} /></div>
            <div className="absolute" style={{ inset: '20.03% 5.82% 14.96% 35.39%' }}><img alt="" className="absolute block max-w-none w-full h-full" src={imgV1} /></div>
            <div className="absolute" style={{ inset: '17.17% 17.55% 18.16% 26.67%' }}><img alt="" className="absolute block max-w-none w-full h-full" src={imgV2} /></div>
            <div className="absolute" style={{ inset: '17.17% 17.55% 18.16% 26.67%' }}><img alt="" className="absolute block max-w-none w-full h-full" src={imgV3} /></div>
            <div className="absolute" style={{ inset: '16.47% 31.47% 22.88% 6.68%' }}><img alt="" className="absolute block max-w-none w-full h-full" src={imgV4} /></div>
            <div className="absolute" style={{ inset: '29.6% 44.63% 35.97% 19.92%' }}><img alt="" className="absolute block max-w-none w-full h-full" src={imgV5} /></div>
            <div className="absolute" style={{ inset: '16.47% 31.47% 22.87% 6.68%' }}><img alt="" className="absolute block max-w-none w-full h-full" src={imgV6} /></div>
          </div>

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
