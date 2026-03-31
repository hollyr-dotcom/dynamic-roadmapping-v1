import { Button, IconButton, IconCross, IconChevronRight, IconLink, Input } from '@mirohq/design-system'

interface ShareSpaceDialogProps {
  spaceName: string
  onContinue: () => void
}

export function ShareSpaceDialog({ spaceName, onContinue }: ShareSpaceDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center dialog-backdrop-enter"
      style={{ backgroundColor: 'rgba(99,107,130,0.55)' }}
      onClick={onContinue}
    >
      <div
        className="bg-white flex flex-col relative dialog-card-enter"
        style={{
          borderRadius: 16,
          width: 560,
          padding: 40,
          gap: 24,
          boxShadow: '0px 8px 24px 0px rgba(12,12,13,0.12), 0px 1px 4px 0px rgba(12,12,13,0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 z-10">
          <IconButton variant="ghost" size="large" aria-label="Close" onPress={onContinue}>
            <IconCross />
          </IconButton>
        </div>

        <h2 className="text-[22px] text-[#1a1b1e] leading-[40px] font-semibold" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>
          Share space "{spaceName || 'Project Galaxy'}"
        </h2>

        {/* Email input */}
        <div className="relative">
          <Input
            size="x-large"
            placeholder="Enter emails or invite from the team"
          />
        </div>

        {/* Space access */}
        <div className="flex flex-col gap-4">
          <span className="font-body font-semibold text-[16px] text-[#1a1b1e] leading-none">Space access</span>

          {/* Owner */}
          <div className="flex items-center gap-3">
            <img
              src="/james-rodriguez.png"
              alt="You"
              style={{ width: 40, height: 40, borderRadius: 999, objectFit: 'cover' }}
            />
            <span className="text-[15px] text-[#1a1b1e]" style={{ fontFamily: 'Open Sans, sans-serif' }}>You're the space owner</span>
          </div>

          {/* Team */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFD02F] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 17L6.5 7L12 12L17.5 7L20 17H4Z" fill="#1a1b1e" stroke="#1a1b1e" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="flex-1 text-[15px] text-[#1a1b1e]" style={{ fontFamily: 'Open Sans, sans-serif' }}>Miro team (1864)</span>
            <button
              className="flex items-center gap-1 text-[14px] text-[#7D8297] hover:text-[#1a1b1e] transition-colors"
              style={{ fontFamily: 'Open Sans, sans-serif', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              No access
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #f1f2f5' }}>
          <button
            className="flex items-center gap-2 text-[14px] font-semibold text-[#4262FF] hover:text-[#3350e0] transition-colors"
            style={{ fontFamily: 'Open Sans, sans-serif', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0' }}
          >
            <IconLink css={{ width: 16, height: 16 }} />
            Copy Space link
          </button>
          <Button variant="ghost" size="large" onPress={onContinue}>
            <Button.Label>Continue without inviting</Button.Label>
            <Button.IconSlot placement="end"><IconChevronRight /></Button.IconSlot>
          </Button>
        </div>
      </div>
    </div>
  )
}
