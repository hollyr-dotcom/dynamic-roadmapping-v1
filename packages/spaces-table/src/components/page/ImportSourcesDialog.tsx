import { useState } from 'react'
import { Button, IconButton, IconCross, IconFileSpreadsheet, Checkbox, IconInsights, Tooltip } from '@mirohq/design-system'
import { JiraLogo } from '../JiraLogo'

interface ImportSourcesDialogProps {
  onImport: (source: 'jira' | 'csv') => void
  onSkip: () => void
}

const importSources: { source: 'jira' | 'csv'; icon: JSX.Element; label: string; description: string }[] = [
  { source: 'jira', icon: <JiraLogo size={24} />, label: 'Jira', description: 'Sync issues and epics from Jira' },
  { source: 'csv', icon: <IconFileSpreadsheet css={{ width: 24, height: 24 }} />, label: 'CSV', description: 'Import from a .csv file' },
]

export function ImportSourcesDialog({ onImport, onSkip }: ImportSourcesDialogProps) {
  const [selected, setSelected] = useState<'jira' | 'csv' | null>(null)
  const [enrichInsights, setEnrichInsights] = useState(true)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(99,107,130,0.55)' }}
      onClick={onSkip}
    >
      <div
        className="bg-white flex flex-col relative"
        style={{
          borderRadius: 16,
          width: 480,
          padding: 40,
          gap: 24,
          boxShadow: '0px 8px 24px 0px rgba(12,12,13,0.12), 0px 1px 4px 0px rgba(12,12,13,0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 z-10">
          <IconButton variant="ghost" size="large" aria-label="Close" onPress={onSkip}>
            <IconCross />
          </IconButton>
        </div>

        <h2 className="text-[22px] text-[#1a1b1e] leading-[40px] font-semibold" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>Import from</h2>

        <div className="flex flex-col gap-2">
          {importSources.map(({ source, icon, label, description }) => {
            const isSelected = selected === source
            return (
              <button
                key={label}
                className="flex items-center gap-4 w-full text-left rounded-xl transition-colors hover:bg-[#f1f2f5] active:bg-[#e9eaef]"
                style={{
                  padding: '16px 20px',
                  border: isSelected ? '1.5px solid #4262FF' : '1px solid #e9eaef',
                  background: isSelected ? '#f5f6ff' : 'transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setSelected(source)}
              >
                <div className="w-10 h-10 rounded-lg bg-[#f1f2f5] flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="text-[16px] font-semibold text-[#1a1b1e]" style={{ fontFamily: "'Roobert PRO', sans-serif" }}>{label}</span>
                  <span className="text-[13px] text-[#7D8297]" style={{ fontFamily: 'Open Sans, sans-serif' }}>{description}</span>
                </div>
                <div className="w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0" style={{ borderColor: isSelected ? '#4262FF' : '#c2c5cc' }}>
                  {isSelected && <div className="w-[10px] h-[10px] rounded-full bg-[#4262FF]" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Enrich records with */}
        <div className="flex flex-col gap-5 py-2">
          <span className="font-body font-semibold text-[16px] text-[#1a1b1e] leading-none">Enrich records with</span>
          <div className="flex">
            <Tooltip>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => setEnrichInsights(v => !v)}
                  className={`flex items-center gap-2 h-12 rounded-full transition-colors duration-150 ${
                    enrichInsights
                      ? 'border-[#4262FF] hover:border-[#3350e0] active:border-[#2b44c7]'
                      : 'border-[#e9eaef] hover:border-[#d5d8de] active:border-[#c2c5cc]'
                  } bg-white`}
                  style={{ borderWidth: '1.5px', borderStyle: 'solid', paddingLeft: 18, paddingRight: 12 }}
                >
                  <span className="shrink-0 -translate-y-px">
                    <IconInsights css={{ width: 20, height: 20 }} />
                  </span>
                  <span className="text-[16px] text-[#1a1b1e]" style={{ fontFamily: 'Open Sans, sans-serif', paddingBottom: 1 }}>Insights</span>
                  <div className="pointer-events-none shrink-0 pill-checkbox translate-y-0.5">
                    <Checkbox checked={enrichInsights} />
                  </div>
                </button>
              </Tooltip.Trigger>
              <Tooltip.Content side="top" sideOffset={4}>Enrich items with customer feedback and signals</Tooltip.Content>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button variant="primary" size="large" disabled={!selected} onPress={() => { if (selected) onImport(selected) }}>
            <Button.Label>Import</Button.Label>
          </Button>
          <Button variant="ghost" size="large" onPress={onSkip}>
            <Button.Label>Skip</Button.Label>
          </Button>
        </div>
      </div>
    </div>
  )
}
