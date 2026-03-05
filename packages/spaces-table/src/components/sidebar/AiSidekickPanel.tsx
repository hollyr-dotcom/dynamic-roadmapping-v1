import { IconSparksFilled } from '@mirohq/design-system'

export function AiSidekickPanel() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-8">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F2F4FC] text-[#2B4DF8]">
        <IconSparksFilled size="large" />
      </div>
      <span
        className="font-heading font-semibold text-[#222428] leading-[1.4]"
        style={{ fontSize: '20px', fontFeatureSettings: "'ss01' 1" }}
      >
        AI Sidekick
      </span>
      <span
        className="font-body text-[#656B81] text-center leading-[1.5]"
        style={{ fontSize: '14px' }}
      >
        Ask me anything about your data
      </span>
    </div>
  )
}
