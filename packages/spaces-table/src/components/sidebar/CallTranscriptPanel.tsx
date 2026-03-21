import React, { useState } from 'react'
import { InputSearch, IconUser } from '@mirohq/design-system'
import { CompanyLogo } from '../CompanyLogo'
import { SourceLogoChip } from './SourceLogoChip'

export interface TranscriptLine {
  speaker: string
  timestamp: string
  text: string
  highlighted?: boolean
  section?: 'box' | 'dim' | 'bubble-operator' | 'bubble-user'
  botLabel?: string
  timeLabel?: string
}

interface CallTranscriptPanelProps {
  author: string
  company: string
  date: string
  transcript: TranscriptLine[]
  onBack: () => void
  highlightColor?: string
  avatarColor?: string
}

const AVATAR_NO_PHOTO = 'https://www.figma.com/api/mcp/asset/4d11fed8-3b68-4a90-b907-9999522076d0'
const AVATAR_VECTOR = 'https://www.figma.com/api/mcp/asset/2e063fe9-0a1a-4f85-a78f-1882b257cad9'

const LABEL: React.CSSProperties = {
  fontSize: 14,
  color: '#656b81',
  width: 140,
  flexShrink: 0,
  fontFamily: "'Open Sans', sans-serif",
  lineHeight: 1.4,
}

const CHIP: React.CSSProperties = {
  backgroundColor: '#f1f2f5',
  borderRadius: 6,
  padding: '0 8px',
  height: 28,
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: 14,
  color: '#222428',
  fontFamily: "'Open Sans', sans-serif",
}

export function CallTranscriptPanel({ author, company, date, transcript, onBack, highlightColor = '#f1f2f5', avatarColor }: CallTranscriptPanelProps) {
  const [search, setSearch] = useState('')
  const [authorName, authorRole] = author.split(',').map(s => s.trim())

  const boxLines = transcript.filter(l => !l.section || l.section === 'box')
  const dimLines = transcript.filter(l => l.section === 'dim')
  const bubbleLines = transcript.filter(l => l.section === 'bubble-operator' || l.section === 'bubble-user')

  return (
    <div
      className="panel-scroll"
      style={{ height: '100%', overflowY: 'auto', padding: '0 16px 32px', display: 'flex', flexDirection: 'column', fontFamily: "'Open Sans', sans-serif", color: '#222428' }}
    >
      {/* ── Sticky header: back button only ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'white', margin: '0 -16px', padding: '0 16px 8px' }}>
        {/* ← Feedback back button */}
        <button
          onClick={onBack}
          className="hover:bg-[#F1F2F5] transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0 8px 4px', borderRadius: 6, fontSize: 14, color: '#656b81', fontFamily: "'Open Sans', sans-serif", alignSelf: 'flex-start', marginBottom: 0, marginLeft: -8, marginTop: 0, fontWeight: 600 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12.5L5.5 8 10 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Feedback
        </button>
      </div>

      {/* Caller info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, paddingBottom: 20, marginTop: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: avatarColor ?? '#f1f2f5', position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {avatarColor
              ? <IconUser css={{ width: 20, height: 20, color: 'rgba(0,0,0,0.35)' }} />
              : <>
                  <img alt="" style={{ position: 'absolute', display: 'block', width: '100%', height: '100%', borderRadius: '50%' }} src={AVATAR_NO_PHOTO} />
                  <div style={{ position: 'absolute', inset: '18.75% 14.44% 0 14.44%' }}>
                    <img alt="" style={{ position: 'absolute', display: 'block', width: '100%', height: '100%' }} src={AVATAR_VECTOR} />
                  </div>
                </>
            }
          </div>
          <div>
            <p style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: 16, color: '#222428', fontFeatureSettings: "'ss01' 1", margin: 0, lineHeight: 1.5 }}>
              {authorName}
            </p>
            {authorRole && (
              <p style={{ fontSize: 12, color: '#656b81', margin: 0, lineHeight: 1.4, marginTop: 1 }}>
                {authorRole}
              </p>
            )}
          </div>
        </div>

      {/* Metadata fields */}
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
        {/* Source */}
        <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
          <span style={LABEL}>Source</span>
          <SourceLogoChip source="Gong" />
        </div>

        {/* Company */}
        <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
          <span style={LABEL}>Company</span>
          <CompanyLogo name={company} size={24} />
        </div>

        {/* Participants */}
        <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
          <span style={LABEL}>Participants</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, backgroundColor: '#f1f2f5', borderRadius: 6, padding: '0 8px 0 5px', height: 28 }}>
              <img
                src="https://i.pravatar.cc/32?img=15"
                alt="James Watson"
                style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
              <span style={{ fontSize: 14, color: '#222428', fontFamily: "'Open Sans', sans-serif" }}>James Watson</span>
            </div>
            <div style={CHIP}>+2</div>
          </div>
        </div>

        {/* Feedback date */}
        <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
          <span style={LABEL}>Feedback date</span>
          <div style={CHIP}>{date}</div>
        </div>
      </div>

      {/* Keyword search */}
      <div style={{ marginBottom: 12 }}>
        <InputSearch
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search keywords..."
          size="medium"
          css={{ width: '100%' }}
        />
      </div>

      {/* Grey box: highlighted conversation */}
      {boxLines.length > 0 && (
        <div style={{ backgroundColor: highlightColor, borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
          {boxLines.map((line, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: 14, color: '#222428', fontFeatureSettings: "'ss01' 1" }}>
                  {line.speaker}
                </span>
                <span style={{ fontSize: 13, color: '#656b81' }}>{line.timestamp}</span>
                {i === 0 && (
                  <span style={{ marginLeft: 'auto' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="5" width="8" height="9" rx="1.5" stroke="#aeb2c0" strokeWidth="1.3" />
                      <path d="M5 5V3.5A1.5 1.5 0 016.5 2H12A1.5 1.5 0 0113.5 3.5V9A1.5 1.5 0 0112 10.5h-1.5" stroke="#aeb2c0" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#222428', fontWeight: line.highlighted ? 600 : 400, fontFamily: "'Open Sans', sans-serif" }}>
                {line.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Dim lines (outside grey box) */}
      {dimLines.map((line, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: 14, color: '#222428', fontFeatureSettings: "'ss01' 1" }}>
              {line.speaker}
            </span>
            <span style={{ fontSize: 13, color: '#aeb2c0' }}>{line.timestamp}</span>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#222428', fontFamily: "'Open Sans', sans-serif" }}>
            {line.text}
          </p>
        </div>
      ))}

      {/* Chat bubbles — same treatment as dim lines */}
      {bubbleLines.map((line, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: 14, color: '#222428', fontFeatureSettings: "'ss01' 1" }}>
              {line.speaker}
            </span>
            {(line.timeLabel ?? line.timestamp) && (
              <span style={{ fontSize: 13, color: '#aeb2c0' }}>{line.timeLabel ?? line.timestamp}</span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#222428', fontFamily: "'Open Sans', sans-serif" }}>
            {line.text}
          </p>
        </div>
      ))}
    </div>
  )
}
