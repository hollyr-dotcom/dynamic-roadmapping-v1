import { useState, useRef, useEffect } from 'react'
import {
  IconCross,
  IconSlidersX,
  IconStickyNote,
  IconArrowUp,
} from '@mirohq/design-system'

interface InsightsChatPanelProps {
  onClose: () => void
}

interface Message {
  role: 'user' | 'ai'
  text: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'ai',
    text: "I can help you identify patterns in your backlog, surface high-impact items, and connect customer feedback to your roadmap priorities. I'm connected to your linked tools and feedback sources.\n\nCan you provide context on ownership & goals?",
  },
]

const AI_RESPONSES: string[] = [
  "Based on your backlog, the top 3 items by estimated revenue impact are the AI portfolio advisor ($425K), real-time transaction categorisation ($917K), and tax-loss harvesting ($921K). These also have the highest customer mention counts.",
  "I can see 9,873 unique customers have requested improvements to transaction categorisation. Companies like Spotify, Stripe, and Linear are most affected. Would you like me to pull the latest feedback signals for this item?",
  "Looking at your 'Now' priority items, the multi-currency wallet has the broadest customer base (8,532 accounts). Atlassian and Notion have flagged FX conversion delays as a top renewal blocker.",
]

function MiroLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.833)} viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.53 0h-3.22l3.38 5.56-3.76-5.56H9.71l3.07 5.93L9.07 0H5.85l2.73 6.31L5.15 0H1.94L5.5 7.64 0 20h3.22l4.24-9.84L11.7 20h3.22l-4.57-10.62L14.76 20H18l-5.17-11.84L16.53 0zM22.06 0h-3.22l5.16 20H27L22.06 0z" fill="#FFD02F"/>
    </svg>
  )
}

export function InsightsChatPanel({ onClose }: InsightsChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
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
      <div className="flex items-center gap-2 h-14 px-4 shrink-0 border-b border-[#E9EAEF]">
        <MiroLogo size={22} />
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
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-0.5" style={{ backgroundColor: '#FFF4C2' }}>
                <MiroLogo size={14} />
              </div>
            )}
            <div
              className="max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-[1.5] whitespace-pre-wrap"
              style={{
                backgroundColor: msg.role === 'user' ? '#4262FF' : '#F1F2F5',
                color: msg.role === 'user' ? '#fff' : '#222428',
                borderBottomRightRadius: msg.role === 'user' ? 4 : undefined,
                borderBottomLeftRadius: msg.role === 'ai' ? 4 : undefined,
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: '#FFF4C2' }}>
              <MiroLogo size={14} />
            </div>
            <div className="flex items-center gap-1 px-3 py-2 rounded-2xl rounded-bl-[4px] bg-[#F1F2F5]">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#AEB2C0]"
                  style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-3 pb-4 pt-2">
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
