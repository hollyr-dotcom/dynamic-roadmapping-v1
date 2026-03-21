import React, { useState } from 'react'
import { InputSearch } from '@mirohq/design-system'
import { CompanyLogo } from '../CompanyLogo'

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
}

const AVATAR_NO_PHOTO = 'https://www.figma.com/api/mcp/asset/4d11fed8-3b68-4a90-b907-9999522076d0'
const AVATAR_VECTOR = 'https://www.figma.com/api/mcp/asset/2e063fe9-0a1a-4f85-a78f-1882b257cad9'

const GONG_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAppJREFUeAHVU1tIFFEYPmfmzF7GHMc1ArPLYisV9iBS6EKrq1kg9RAhQRckkHywJ4tKK0wIAo3Ey4MIGZgR9KrYg1AJWkEU9OCLBC5Wgqm7M3uZnd2dmXM6u66yLruLPfrBwJxz/u8/3//9/wFgt4NJXQzU+w2HrVHYMSEVw2ekQFfVz8HNuMF6VZdUH3PZ8WSIrmE2XtaDnhqvomoB3ooKMAuJEtQkKwtNrAUJYH5tsrUkv7zp/XL/ta/Lr7w7Uoggy0HIYggZNRST80QT/1LRVgbCmg8etTWMcIx5iiaTcirsrP74iMGiy4wKigngyvNNBfD2jMCc3He19NvqmyW73c09LHunji3csc39Gg5QipErIWw+NlZ9pLB2lgDC8sgGiqwCaJmGqTGIfnqSR0AGpHvIPqtZ/qDEoi4Lxz3vmD14P0lMJTPu/a02HYW21BnYCr/8GZXpL87YlKen/1KRBI8ttIoL6xPB9PM+d4gEY764GsJzeVDTV153fipvjl+M0hUP1SvYq65iM2u5R5OpmaoKRD1TAOw5rxjSaNfnQzfBRnMTVWzr8ui5sH89vIITtUPuQc3htrIMCcnk0tANek4EU1EV2LANb/mRGtkyzYuewNwlxJhIWA/YokSNBzNn7XcrkkR2pEEjVxw9izqJYTPDnwBpzcnkIex1rcscywrtM4Wwv072ShGvmIfIhEawHjPgxXzTXhTVI0DHEfI7+P3Wi/mm4U0yylQSHWbBH5Vwj2sNRzSVGi+qYU2+AAGHRHNxtH3GwtGZtBTF7PZSvjLr40jAXdJW0e1cJI+rPQZtkOE84LTSba6vTu7tq5X1+H3gf9Bx6sd4t9Nj0Hl8C7Z7jByORnOWqrJjoE5Rrh8frwQ53vnuxj/GfQLocTFXKgAAAABJRU5ErkJggg=='

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

export function CallTranscriptPanel({ author, company, date, transcript, onBack }: CallTranscriptPanelProps) {
  const [search, setSearch] = useState('')
  const [authorName, authorRole] = author.split(',').map(s => s.trim())

  const boxLines = transcript.filter(l => !l.section || l.section === 'box')
  const dimLines = transcript.filter(l => l.section === 'dim')
  const bubbleLines = transcript.filter(l => l.section === 'bubble-operator' || l.section === 'bubble-user')

  return (
    <div
      className="panel-scroll"
      style={{ height: '100%', overflowY: 'auto', padding: '8px 16px 32px', display: 'flex', flexDirection: 'column', fontFamily: "'Open Sans', sans-serif", color: '#222428' }}
    >
      {/* ← Feedback back button */}
      <button
        onClick={onBack}
        className="hover:bg-[#F1F2F5] transition-colors"
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, fontSize: 14, color: '#656b81', fontFamily: "'Open Sans', sans-serif", alignSelf: 'flex-start', marginBottom: 12, marginLeft: -8, fontWeight: 600 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12.5L5.5 8 10 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Feedback
      </button>

      {/* Caller info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#f1f2f5', position: 'relative', flexShrink: 0 }}>
          <img alt="" style={{ position: 'absolute', display: 'block', width: '100%', height: '100%', borderRadius: '50%' }} src={AVATAR_NO_PHOTO} />
          <div style={{ position: 'absolute', inset: '18.75% 14.44% 0 14.44%' }}>
            <img alt="" style={{ position: 'absolute', display: 'block', width: '100%', height: '100%' }} src={AVATAR_VECTOR} />
          </div>
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
          <div style={{ ...CHIP, padding: '0 6px' }}>
            <img src={GONG_PNG} width="14" height="14" alt="Gong" style={{ display: 'block' }} />
          </div>
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
      <div style={{ marginBottom: 16 }}>
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
        <div style={{ backgroundColor: '#f1f2f5', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
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
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: '#222428', fontWeight: line.highlighted ? 600 : 400, fontFamily: "'Open Sans', sans-serif" }}>
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
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: '#656b81', fontFamily: "'Open Sans', sans-serif" }}>
            {line.text}
          </p>
        </div>
      ))}

      {/* Chat bubbles */}
      {bubbleLines.map((line, i) => {
        const isUser = line.section === 'bubble-user'
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap: 4, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: 14, color: '#222428', fontFeatureSettings: "'ss01' 1" }}>
                {line.speaker}
              </span>
              {line.timeLabel && (
                <span style={{ fontSize: 11, color: isUser ? 'rgba(86,136,211,0.6)' : '#aeb2c0' }}>
                  {line.timeLabel}
                </span>
              )}
            </div>
            {!isUser && line.botLabel && (
              <span style={{ fontSize: 11, color: '#aeb2c0' }}>{line.botLabel}</span>
            )}
            <div style={{ backgroundColor: isUser ? '#edf5ff' : '#f8f8fa', borderRadius: isUser ? 8 : 10, padding: '12px 14px', maxWidth: 280 }}>
              {line.text.split('\n').map((t, j, arr) => (
                <p key={j} style={{ margin: j < arr.length - 1 ? '0 0 4px 0' : 0, fontSize: 13, lineHeight: 1.4, color: '#222428', fontFamily: "'Open Sans', sans-serif" }}>
                  {t}
                </p>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
