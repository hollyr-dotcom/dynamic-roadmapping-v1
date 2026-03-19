const COMPANY_DOMAINS: Record<string, string> = {
  Figma:     'figma.com',
  Airbnb:    'airbnb.com',
  Stripe:    'stripe.com',
  Notion:    'notion.so',
  Spotify:   'spotify.com',
  Linear:    'linear.app',
  Dropbox:   'dropbox.com',
  ZenDesk:   'zendesk.com',
  Asana:     'asana.com',
  Atlassian: 'atlassian.com',
  Miro:      'miro.com',
  Shopify:   'shopify.com',
  Apple:     'apple.com',
  Google:    'google.com',
  Slack:     'slack.com',
  Jira:      'atlassian.com',
}

function faviconUrl(name: string) {
  const domain = COMPANY_DOMAINS[name] ?? `${name.toLowerCase()}.com`
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
}

interface AvatarStackCellProps {
  values: string[]
  onChipClick?: (name: string) => void
}

export function AvatarStackCell({ values, onChipClick }: AvatarStackCellProps) {
  const visible = values.slice(0, 2)
  const overflow = values.length - 2

  return (
    <div className="flex items-center gap-1 flex-nowrap">
      {visible.map((name) => (
        <button
          key={name}
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onChipClick?.(name) }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 8px 3px 4px',
            borderRadius: 6,
            border: '1px solid #E9EAEF',
            background: '#fff',
            cursor: 'pointer',
            fontFamily: 'Open Sans, sans-serif',
            fontSize: 13,
            color: '#1A1B1E',
            fontWeight: 400,
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F1F2F5' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff' }}
        >
          <img
            src={faviconUrl(name)}
            alt=""
            width={14}
            height={14}
            style={{ borderRadius: 2, display: 'block', flexShrink: 0 }}
          />
          {name}
        </button>
      ))}
      {overflow > 0 && (
        <span className="text-[#656B81] font-body font-medium" style={{ fontSize: '14px' }}>
          +{overflow}
        </span>
      )}
    </div>
  )
}
