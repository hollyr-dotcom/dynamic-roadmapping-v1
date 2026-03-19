// Pastel versions of each company's primary brand color
const COMPANY_COLORS: Record<string, string> = {
  Figma:     '#F0EBFF', // purple
  Airbnb:    '#FFE8E9', // coral red
  Stripe:    '#ECEEFF', // indigo
  Notion:    '#EFEFEF', // black/gray
  Spotify:   '#E0F5E9', // green
  Linear:    '#EAEBFF', // indigo
  Dropbox:   '#E0EDFF', // blue
  ZenDesk:   '#E0F0EE', // teal
  Asana:     '#FFE9E8', // coral
  Atlassian: '#E0EAFF', // blue
  Miro:      '#FFF8DC', // yellow
  Shopify:   '#ECF5E0', // green
  Apple:     '#F2F2F2', // gray
  Google:    '#E3ECFF', // blue
  Slack:     '#F0E5F5', // purple
  Jira:      '#E0EAFF', // blue
}

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
    <div className="flex items-center gap-2 flex-nowrap">
      {visible.map((name) => (
        <button
          key={name}
          title={name}
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onChipClick?.(name) }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0px 6.5px',
            width: 36,
            height: 36,
            borderRadius: 6,
            background: COMPANY_COLORS[name] ?? '#F0F0F0',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <img
            src={faviconUrl(name)}
            alt={name}
            width={20}
            height={20}
            style={{ display: 'block', objectFit: 'contain' }}
          />
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
