import { useState, useRef, useEffect } from 'react'
import {
  IconCross,
  IconSlidersX,
  IconStickyNote,
  IconArrowUp,
  IconInsights,
} from '@mirohq/design-system'

interface InsightsChatPanelProps {
  onClose: () => void
}

interface Message {
  role: 'user' | 'ai'
  text: string
}

const AI_RESPONSES: string[] = [
  "Based on your backlog, the top 3 items by estimated revenue impact are the AI portfolio advisor ($425K), real-time transaction categorisation ($917K), and tax-loss harvesting ($921K). These also have the highest customer mention counts.",
  "I can see 9,873 unique customers have requested improvements to transaction categorisation. Companies like Spotify, Stripe, and Linear are most affected. Would you like me to pull the latest feedback signals for this item?",
  "Looking at your 'Now' priority items, the multi-currency wallet has the broadest customer base (8,532 accounts). Atlassian and Notion have flagged FX conversion delays as a top renewal blocker.",
]

export function InsightsChatPanel({ onClose }: InsightsChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const responseIndex = useRef(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const response = AI_RESPONSES[responseIndex.current % AI_RESPONSES.length]
      responseIndex.current++
      setMessages(m => [...m, { role: 'ai', text: response }])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full bg-white" style={{ fontFamily: 'Open Sans, sans-serif' }}>

      {/* Header */}
      <div className="flex items-center gap-2 h-14 px-4 shrink-0">
        <span
          className="text-[16px] text-[#222428] leading-[1.4]"
          style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontFeatureSettings: "'ss01' 1" }}
        >
          Miro Insights
        </span>
        <span
          className="inline-flex items-center rounded-[4px] px-[6px] h-[20px] text-[11px] font-semibold text-[#3C3F4A] shrink-0"
          style={{ backgroundColor: '#E9EAEF', letterSpacing: '0.02em' }}
        >
          Beta
        </span>
        <div className="flex-1" />
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors shrink-0"
          aria-label="Close"
        >
          <IconCross css={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto panel-scroll px-4 py-4 flex flex-col gap-3">

        {/* Static intro block */}
        <div className="flex flex-col gap-3 pb-2 my-auto">
          <img src="/miro-insights-icon.svg" alt="Miro Insights" style={{ width: 24, height: 20 }} />
          <div className="flex flex-col gap-3">
            <p
              className="text-[#222428] leading-[1.4]"
              style={{ fontFamily: "'Roobert PRO', sans-serif", fontWeight: 600, fontSize: 20, fontFeatureSettings: "'ss01' 1" }}
            >
              Hey Richard
            </p>
            <p className="text-[14px] text-[#222428] leading-[1.5]">
              Easily surface customer feedback across all of your{' '}
              <span style={{ textDecoration: 'underline' }}>connected tools</span>{' '}
              in your organization with Miro Insights.
            </p>
            <p className="text-[14px] text-[#222428] leading-[1.5]">
              The AI uses your team's ownership and goals to find the most relevant signals in customer feedback and surface high-confidence insights.
            </p>
            <p className="text-[14px] text-[#222428] leading-[1.5]">
              Can you provide context on ownership & goals?
            </p>
          </div>
        </div>

        {/* Chat messages */}
        {messages.map((msg, i) => (
          msg.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <div
                className="max-w-[85%] rounded-lg px-4 py-3 text-[14px] leading-[1.57] text-[#3C3F4A] whitespace-pre-wrap"
                style={{ backgroundColor: '#F1F2F5', fontFamily: 'Open Sans, sans-serif' }}
              >
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start">
              <p className="text-[14px] leading-[1.57] text-[#222428] whitespace-pre-wrap" style={{ fontFamily: 'Open Sans, sans-serif' }}>{msg.text}</p>
            </div>
          )
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Thinking indicator — 16px above input */}
      {typing && (
        <div className="shrink-0 flex items-center gap-2 px-4 text-[#656B81]" style={{ paddingBottom: 16 }}>
          <IconInsights css={{ width: 16, height: 16 }} />
          <span className="text-[13px]">Thinking…</span>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 px-3 pb-4" style={{ paddingTop: typing ? 0 : 8 }}>
        <div
          className="flex flex-col rounded-xl bg-white"
          style={{ border: '1px solid #E0E2E8', boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' }}
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask anything..."
            className="flex-1 px-3 pt-3 pb-2 text-[13px] text-[#222428] outline-none bg-transparent placeholder:text-[#7D8297] resize-none"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
                <IconSlidersX css={{ width: 16, height: 16 }} />
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
                <IconStickyNote css={{ width: 16, height: 16 }} />
              </button>
            </div>
            <button
              onClick={send}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-white"
              style={{ backgroundColor: input.trim() ? '#4262FF' : '#AEB2C0' }}
            >
              <IconArrowUp css={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
