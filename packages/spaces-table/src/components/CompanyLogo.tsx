export const COMPANY_DOMAINS: Record<string, string> = {
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

export const COMPANY_COLORS: Record<string, string> = {
  Figma:     '#F1F2F5',
  Airbnb:    '#F1F2F5',
  Stripe:    '#F1F2F5',
  Notion:    '#F1F2F5',
  Spotify:   '#F1F2F5',
  Linear:    '#F1F2F5',
  Dropbox:   '#F1F2F5',
  ZenDesk:   '#F1F2F5',
  Asana:     '#F1F2F5',
  Atlassian: '#F1F2F5',
  Miro:      '#F1F2F5',
  Shopify:   '#F1F2F5',
  Apple:     '#F1F2F5',
  Google:    '#F1F2F5',
  Slack:     '#F1F2F5',
  Jira:      '#F1F2F5',
}

export function faviconUrl(name: string) {
  const domain = COMPANY_DOMAINS[name] ?? `${name.toLowerCase()}.com`
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
}

interface CompanyLogoProps {
  name: string
  size?: number
  onClick?: () => void
}

export function CompanyLogo({ name, size = 36, onClick }: CompanyLogoProps) {
  const imgSize = Math.round(size * 0.55)

  return (
    <button
      title={name}
      onClick={onClick ? (e) => { e.stopPropagation(); onClick() } : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 6,
        background: COMPANY_COLORS[name] ?? '#F1F2F5',
        border: 'none',
        cursor: onClick ? 'pointer' : 'default',
        flexShrink: 0,
        padding: 0,
      }}
    >
      <img
        src={faviconUrl(name)}
        alt={name}
        width={imgSize}
        height={imgSize}
        style={{ display: 'block', objectFit: 'contain' }}
      />
    </button>
  )
}
