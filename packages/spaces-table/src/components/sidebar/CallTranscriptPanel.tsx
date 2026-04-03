import React, { useState } from 'react'
import { InputSearch } from '@mirohq/design-system'

const AVATAR_COLORS: Record<string, { bg: string; fg: string }> = {
  '#D1F09F': { bg: '#ADF0C7', fg: '#067429' },
  '#d4bbff': { bg: '#E8DFFF', fg: '#5936B0' },
  '#ffd4b2': { bg: '#FFE5CC', fg: '#A0522D' },
}
const AVATAR_DEFAULT = { bg: '#F1F2F5', fg: '#656B81' }

function MdsAvatar({ color }: { color?: string }) {
  const { bg, fg } = (color ? AVATAR_COLORS[color] : undefined) ?? AVATAR_DEFAULT
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z" fill={bg}/>
      <path d="M34.2234 34.0607C30.5968 37.7289 25.564 40.0001 19.9992 40.0001C14.4344 40.0001 9.40161 37.7266 5.77734 34.0584C7.01242 28.6557 11.2473 24.4001 16.6363 23.128C13.7984 21.8444 11.8232 18.9927 11.8232 15.6761C11.8232 11.1591 15.4845 7.50024 19.9992 7.50024C24.5162 7.50024 28.1752 11.1591 28.1752 15.6761C28.1752 18.9927 26.2 21.8444 23.3644 23.128C28.7534 24.4001 32.9883 28.658 34.2234 34.0607Z" fill={fg}/>
    </svg>
  )
}
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
      style={{ height: '100%', overflowY: 'auto', padding: '0px 16px 32px', display: 'flex', flexDirection: 'column', fontFamily: "'Open Sans', sans-serif", color: '#222428' }}
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
          <MdsAvatar color={avatarColor} />
          <div>
            <p style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: 16, color: '#222428', fontFeatureSettings: "'ss01' 1", margin: 0, lineHeight: 1.5 }}>
              {authorName}
            </p>
            {authorRole && (
              <p style={{ fontSize: 14, color: '#656b81', margin: 0, lineHeight: 1.4, marginTop: 1 }}>
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
      <div style={{ marginBottom: 28 }}>
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
