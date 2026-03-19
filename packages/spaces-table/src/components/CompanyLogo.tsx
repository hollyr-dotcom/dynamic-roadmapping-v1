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
  Figma:     '#F0EBFF',
  Airbnb:    '#FFE8E9',
  Stripe:    '#ECEEFF',
  Notion:    '#EFEFEF',
  Spotify:   '#E0F5E9',
  Linear:    '#EAEBFF',
  Dropbox:   '#E0EDFF',
  ZenDesk:   '#E0F0EE',
  Asana:     '#FFE9E8',
  Atlassian: '#E0EAFF',
  Miro:      '#FFF8DC',
  Shopify:   '#ECF5E0',
  Apple:     '#F2F2F2',
  Google:    '#E3ECFF',
  Slack:     '#F0E5F5',
  Jira:      '#E0EAFF',
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
        background: COMPANY_COLORS[name] ?? '#F0F0F0',
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
