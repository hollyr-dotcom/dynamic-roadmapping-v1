import { useState, useCallback, useRef } from 'react'
import {
  Button,
  Checkbox,
  IconButton,
  IconCross,
  IconInsights,
  IconTable,
  IconFileSpreadsheet,
  Tooltip,
  Input,
} from '@mirohq/design-system'
import { JiraLogo } from '../JiraLogo'

interface NameSpaceModalProps {
  initialName: string
  onSubmit: (name: string, importSource: 'jira' | 'miro' | 'csv' | null) => void
  onCancel: () => void
}

export function NameSpaceModal({ initialName, onSubmit, onCancel }: NameSpaceModalProps) {
  const [spaceName, setSpaceName] = useState('')
  const [importJira, setImportJira] = useState(false)
  const [importTables, setImportTables] = useState(false)
  const [importCsv, setImportCsv] = useState(false)
  const [enrichInsights, setEnrichInsights] = useState(true)
  const [isClosing, setIsClosing] = useState(false)
  const pendingAction = useRef<(() => void) | null>(null)

  const importSource = importJira ? 'jira' as const : importTables ? 'miro' as const : importCsv ? 'csv' as const : null

  const animateOut = useCallback((callback: () => void) => {
    pendingAction.current = callback
    setIsClosing(true)
    setTimeout(callback, 220)
  }, [])

  const handleSubmit = useCallback(() => {
    animateOut(() => onSubmit(spaceName, importSource))
  }, [animateOut, onSubmit, spaceName, importSource])

  const handleCancel = useCallback(() => {
    animateOut(onCancel)
  }, [animateOut, onCancel])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isClosing ? 'center-overlay-exit' : 'center-overlay-enter'}`}
      style={{ backgroundColor: 'rgba(99,107,130,0.55)' }}
      onClick={handleCancel}
    >
      <div
        className={`bg-white flex flex-col relative ${isClosing ? 'center-panel-exit' : 'center-panel-enter'}`}
        style={{
          width: 560,
          maxWidth: 560,
          padding: 40,
          gap: 16,
          borderRadius: 8,
          isolation: 'isolate',
          filter: 'drop-shadow(0px 6px 16px rgba(34, 36, 40, 0.12)) drop-shadow(0px 0px 8px rgba(34, 36, 40, 0.06))',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <div className="absolute top-4 right-4 z-10">
          <IconButton
            variant="ghost"
            size="large"
            aria-label="Close"
            onPress={handleCancel}
          >
            <IconCross />
          </IconButton>
        </div>

        {/* Title */}
        <h2 className="text-[22px] text-[#1a1b1e] leading-[40px] font-semibold" style={{ fontFamily: "'Roobert PRO', sans-serif", minHeight: 40 }}>Name your space</h2>

        {/* Space name */}
        <Input
          autoFocus
          size="x-large"
          placeholder={initialName}
          value={spaceName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpaceName(e.target.value)}
        />

        {/* Import records from */}
        <div className="flex flex-col gap-5 py-2">
          <span className="font-body font-semibold text-[16px] text-[#1a1b1e] leading-none">Import records from</span>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: <JiraLogo size={20} />, label: 'Jira', tooltip: 'Import issues and epics from your Jira projects', checked: importJira, toggle: () => { setImportJira(v => !v); setImportTables(false); setImportCsv(false) } },
              { icon: <IconTable css={{ width: 20, height: 20 }} />, label: 'Tables', tooltip: 'Pull in items from your Miro tables', checked: importTables, toggle: () => { setImportTables(v => !v); setImportJira(false); setImportCsv(false) } },
              { icon: <IconFileSpreadsheet css={{ width: 20, height: 20 }} />, label: 'CSV', tooltip: 'Upload a spreadsheet of work items', checked: importCsv, toggle: () => { setImportCsv(v => !v); setImportJira(false); setImportTables(false) } },
            ].map(({ icon, label, tooltip, checked, toggle }) => (
              <Tooltip key={label}>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={toggle}
                    className={`flex items-center gap-2 h-12 rounded-full transition-colors duration-150 ${
                      checked
                        ? 'border-[#4262FF] hover:border-[#3350e0] active:border-[#2b44c7]'
                        : 'border-[#e9eaef] hover:border-[#d5d8de] active:border-[#c2c5cc]'
                    } bg-white`}
                    style={{ borderWidth: '1.5px', borderStyle: 'solid', paddingLeft: 18, paddingRight: 12 }}
                  >
                    <span className="shrink-0 -translate-y-px">{icon}</span>
                    <span className="text-[16px] text-[#1a1b1e]" style={{ fontFamily: 'Open Sans, sans-serif', paddingBottom: 1 }}>{label}</span>
                    <div className="pointer-events-none shrink-0 pill-checkbox translate-y-0.5">
                      <Checkbox checked={checked} />
                    </div>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content side="top" sideOffset={4}>{tooltip}</Tooltip.Content>
              </Tooltip>
            ))}
          </div>
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

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <Button
            variant="primary"
            size="large"
            onPress={handleSubmit}
            disabled={!spaceName.trim()}
          >
            <Button.Label>{importSource ? 'Create and import' : 'Create'}</Button.Label>
          </Button>
          <Button
            variant="ghost"
            size="large"
            onPress={handleCancel}
          >
            <Button.Label>Cancel</Button.Label>
          </Button>
        </div>
      </div>
    </div>
  )
}
