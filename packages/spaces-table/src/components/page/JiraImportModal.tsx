import { useState, useEffect } from 'react'
import {
  Button,
  IconButton,
  IconCross,
  IconWand,
  IconCard,
  IconEyeOpen,
  IconSquarePencil,
} from '@mirohq/design-system'

interface JiraImportModalProps {
  onImport: () => void
  onClose: () => void
}

const jiraIssues = [
  { key: 'SE-397', type: 'bug', summary: "Manual resize of sidebar after expand button doesn't work", assignee: 'Chance Curtis', priority: null, status: 'To Do' },
  { key: 'ENTS-1', type: 'story', summary: '[FE] Come up with contracts for Custom Roles based on e...', assignee: 'Petar Grchev...', priority: 'high', status: 'To Do' },
  { key: 'UR-349', type: 'task', summary: 'Test all Password dumpers', assignee: '-', priority: null, status: 'Backlog' },
  { key: 'UR-348', type: 'task', summary: 'Create User Password Reader', assignee: '-', priority: null, status: 'Backlog' },
  { key: 'SE-396', type: 'bug', summary: 'Last scrolled item is not visible', assignee: '-', priority: null, status: 'Backlog' },
  { key: 'UR-347', type: 'task', summary: 'Create User Password Writer', assignee: '-', priority: null, status: 'To Do' },
  { key: 'UR-346', type: 'task', summary: 'Implement migration write strategies for Password', assignee: '-', priority: null, status: 'Backlog' },
  { key: 'UR-345', type: 'task', summary: 'Implement migration read strategies for Password', assignee: '-', priority: null, status: 'Backlog' },
  { key: 'ENTS-2', type: 'story', summary: 'Migrate miro-site-sso from Lokalise to Phrase', assignee: 'Kostya Teplo...', priority: null, status: 'Review/Testing' },
  { key: 'UR-344', type: 'task', summary: 'Create dumper to clear all Passwords from DDB', assignee: '-', priority: null, status: 'Backlog' },
] as const

export function JiraImportModal({ onImport, onClose }: JiraImportModalProps) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['UR-348', 'UR-347']))
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)))
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: entered ? 'rgba(99,107,130,0.55)' : 'rgba(99,107,130,0)',
        transition: 'background-color 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onClick={onClose}
    >
      <div
        className="bg-white flex flex-col relative"
        style={{
          width: 1200,
          maxWidth: 1200,
          height: 752,
          borderRadius: 8,
          isolation: 'isolate',
          filter: 'drop-shadow(0px 6px 16px rgba(34, 36, 40, 0.12)) drop-shadow(0px 0px 8px rgba(34, 36, 40, 0.06))',
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          transition: 'opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <div className="absolute top-4 right-4 z-10">
          <IconButton variant="ghost" size="large" aria-label="Close" onPress={onClose}>
            <IconCross />
          </IconButton>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 72px 0 32px', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 400, fontSize: 24, lineHeight: '135%', color: '#222428', margin: 0 }}>Select issues</h2>
            <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13, color: '#656b81', margin: '2px 0 0 0' }}>Company URL</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {([
              { label: 'Settings', Icon: IconWand },
              { label: 'Configure cards', Icon: IconCard },
              { label: 'Show imported', Icon: IconEyeOpen },
              { label: 'Create issue', Icon: IconSquarePencil },
            ] as Array<{ label: string; Icon: (props: { css?: Record<string, unknown> }) => React.JSX.Element }>).map(({ label, Icon }) => (
              <button key={label} className="hover:bg-[#f1f2f5] transition-colors" style={{ height: 32, padding: '0 10px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif', fontSize: 16, color: '#222428', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon css={{ width: 16, height: 16, minWidth: 16, minHeight: 16, color: '#222428', flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '16px 32px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e0e2e8', borderRadius: 6, height: 40, padding: '0 12px', background: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#9da3b4" strokeWidth="1.5"/><path d="M10.5 10.5L14 14" stroke="#9da3b4" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 14, color: '#9da3b4' }}>Basic search</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13, color: '#222428' }}>Advanced search</span>
              <div style={{ width: 36, height: 20, borderRadius: 10, backgroundColor: '#4262FF', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
                <div style={{ position: 'absolute', right: 3, top: 3, width: 14, height: 14, borderRadius: '50%', backgroundColor: 'white' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '12px 32px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '32px 24px 100px 1fr 140px 32px 120px', gap: 8, alignItems: 'center', padding: '0 8px', height: 36, borderBottom: '1px solid #e0e2e8', flexShrink: 0 }}>
            <div />
            <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13, color: '#656b81', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 11 }}>≡</span> Rank
            </span>
            {[
              { label: 'Key', prefix: 'T' },
              { label: 'Summary', prefix: null },
              { label: 'Assignee', prefix: null },
              { label: 'P', prefix: null },
              { label: 'Status', prefix: null },
            ].map(({ label, prefix }) => (
              <span key={label} style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13, color: '#656b81', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                {prefix && <span style={{ fontSize: 11, fontStyle: 'italic' }}>{prefix}</span>}
                {label}
              </span>
            ))}
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {jiraIssues.map((issue) => {
              const checked = selectedKeys.has(issue.key)
              const typeColor = issue.type === 'bug' ? '#FF5630' : issue.type === 'story' ? '#65BA43' : '#4BADE8'
              const statusBg = issue.status === 'Review/Testing' ? '#FFD02F' : 'transparent'
              const statusTxt = issue.status === 'Review/Testing' ? '#1a1b1e' : '#656b81'
              return (
                <div
                  key={issue.key}
                  className="hover:bg-[#f9f9fb] transition-colors"
                  style={{ display: 'grid', gridTemplateColumns: '32px 24px 100px 1fr 140px 32px 120px', gap: 8, alignItems: 'center', padding: '0 8px', height: 44, borderBottom: '1px solid #f1f2f5', cursor: 'pointer' }}
                  onClick={() => setSelectedKeys(prev => { const next = new Set(prev); if (next.has(issue.key)) next.delete(issue.key); else next.add(issue.key); return next })}
                >
                  <div style={{ width: 16, height: 16, borderRadius: 3, border: checked ? 'none' : '1.5px solid #9da3b4', backgroundColor: checked ? '#4262FF' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {checked && <svg width="10" height="7" viewBox="0 0 10 7" fill="none"><path d="M1 3.5l2.5 2.5 5.5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 12, color: '#9da3b4' }}>…</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 2, backgroundColor: typeColor, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13, color: '#4262FF', whiteSpace: 'nowrap' }}>{issue.key}</span>
                  </div>
                  <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13, color: '#222428', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.summary}</span>
                  <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 13, color: '#656b81', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.assignee}</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {issue.priority === 'high'
                      ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v8M4 5l3-3 3 3" stroke="#FF5630" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid #9da3b4' }} />
                    }
                  </div>
                  <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: 12, color: statusTxt, backgroundColor: statusBg, borderRadius: 3, padding: statusBg !== 'transparent' ? '2px 6px' : 0, whiteSpace: 'nowrap' }}>{issue.status}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 32px 32px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Button
            variant="primary"
            size="large"
            onPress={onImport}
          >
            <Button.Label>Import</Button.Label>
          </Button>
        </div>
      </div>
    </div>
  )
}
