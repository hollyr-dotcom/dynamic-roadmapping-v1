import {
  siFigma,
  siAirbnb,
  siStripe,
  siNotion,
  siSpotify,
  siLinear,
  siDropbox,
  siZendesk,
  siAsana,
  siAtlassian,
  siMiro,
  siShopify,
  siApple,
  siGoogle,
  siJira,
} from 'simple-icons'

type SimpleIcon = { path: string; viewBox?: string }

const COMPANY_ICONS: Record<string, SimpleIcon> = {
  Figma:     siFigma,
  Airbnb:    siAirbnb,
  Stripe:    siStripe,
  Notion:    siNotion,
  Spotify:   siSpotify,
  Linear:    siLinear,
  Dropbox:   siDropbox,
  ZenDesk:   siZendesk,
  Asana:     siAsana,
  Atlassian: siAtlassian,
  Miro:      siMiro,
  Shopify:   siShopify,
  Apple:     siApple,
  Google:    siGoogle,
  Jira:      siJira,
}

// Keep for toolbar favicon chip (small, fast)
export function faviconUrl(name: string) {
  const domains: Record<string, string> = {
    Figma: 'figma.com', Airbnb: 'airbnb.com', Stripe: 'stripe.com',
    Notion: 'notion.so', Spotify: 'spotify.com', Linear: 'linear.app',
    Dropbox: 'dropbox.com', ZenDesk: 'zendesk.com', Asana: 'asana.com',
    Atlassian: 'atlassian.com', Miro: 'miro.com', Shopify: 'shopify.com',
    Apple: 'apple.com', Google: 'google.com', Slack: 'slack.com', Jira: 'atlassian.com',
  }
  const domain = domains[name] ?? `${name.toLowerCase()}.com`
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
}

interface CompanyLogoProps {
  name: string
  size?: number
  onClick?: () => void
}

export function CompanyLogo({ name, size = 28, onClick }: CompanyLogoProps) {
  const icon = COMPANY_ICONS[name]
  const iconSize = Math.round(size * 0.55)

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
        background: '#F1F2F5',
        border: 'none',
        cursor: onClick ? 'pointer' : 'default',
        flexShrink: 0,
        padding: 0,
      }}
    >
      {icon ? (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill={`#${'hex' in icon ? (icon as { hex: string }).hex : '3C3F4A'}`}
          style={{ display: 'block' }}
        >
          <path d={icon.path} />
        </svg>
      ) : (
        <span style={{ fontSize: iconSize * 0.7, fontWeight: 700, color: '#3C3F4A', lineHeight: 1 }}>
          {name[0]}
        </span>
      )}
    </button>
  )
}
