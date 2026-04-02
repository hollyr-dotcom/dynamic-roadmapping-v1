import { IconButton, IconCross } from '@mirohq/design-system'

function IconStop() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="3" y="3" width="10" height="10" rx="1.5" />
    </svg>
  )
}

interface FlowProgressCardProps {
  visible: boolean
  progress: number // 0–1
  onStop?: () => void
  onClose?: () => void
}

export function FlowProgressCard({ visible, progress, onStop, onClose }: FlowProgressCardProps) {
  if (!visible) return null

  return (
    <div
      className="fixed transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        top: 56,
        right: 8,
        zIndex: 110,
        width: 300,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0px 2px 8px rgba(34,36,40,0.12), 0px 0px 12px rgba(34,36,40,0.04)',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-8px)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 8px 0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Avatar */}
          <div style={{ position: 'relative', width: 36, height: 36, flexShrink: 0 }}>
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=72&h=72&fit=crop&crop=face"
              alt="AI"
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#7B61FF',
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M8 1l2 3h3l-2.5 2.5 1 3.5L8 8l-3.5 2 1-3.5L3 4h3l2-3z" fill="white" />
              </svg>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontFamily: "'Noto Sans', sans-serif", fontWeight: 600, color: '#222428', lineHeight: 1.3 }}>
              Running Flow
            </div>
            <div style={{ fontSize: 12, fontFamily: "'Noto Sans', sans-serif", color: '#656B81', lineHeight: 1.3 }}>
              Sarah Chen
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton aria-label="Stop" variant="ghost" size="medium" onPress={onStop} css={{ width: 28, height: 28, minWidth: 'auto', minHeight: 'auto' }}>
            <IconStop />
          </IconButton>
          <IconButton aria-label="Close" variant="ghost" size="medium" onPress={onClose} css={{ width: 28, height: 28, minWidth: 'auto', minHeight: 'auto', '& svg': { width: 16, height: 16 } }}>
            <IconCross />
          </IconButton>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '10px 16px 0' }}>
        <div style={{ height: 4, borderRadius: 2, background: '#E9EAEF', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            borderRadius: 2,
            background: '#7B61FF',
            width: `${Math.round(progress * 100)}%`,
            transition: 'width 400ms ease-out',
          }} />
        </div>
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px 14px' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="#656B81" strokeWidth="1.5" />
          <line x1="5" y1="6" x2="11" y2="6" stroke="#656B81" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="5" y1="9" x2="9" y2="9" stroke="#656B81" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 13, fontFamily: "'Noto Sans', sans-serif", color: '#656B81' }}>
          {progress < 1 ? 'Preparing document' : 'Document complete'}
        </span>
      </div>
    </div>
  )
}
