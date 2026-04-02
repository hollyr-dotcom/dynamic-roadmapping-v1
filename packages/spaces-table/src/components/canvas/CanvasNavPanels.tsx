import {
  Button,
  IconButton,
  IconLinesThreeHorizontal,
  IconBell,
  IconChevronRightSmall,
  IconDotsThreeVertical,
} from '@mirohq/design-system'
import { BoardIcon } from '../BoardIcons'

const avatars = [
  { name: 'MK', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=56&h=56&fit=crop&crop=face' },
]

const SIDEBAR_WIDTH = 320

interface CanvasNavPanelsProps {
  isOpen: boolean
  databaseTitle: string
  onMenuClick?: () => void
  isMenuOpen?: boolean
  boardName?: string
  boardIconIndex?: number
}

export function CanvasNavPanels({ isOpen, databaseTitle, onMenuClick, isMenuOpen, boardName, boardIconIndex = 0 }: CanvasNavPanelsProps) {
  return (
    <>
      {/* Left panel: menu + breadcrumb */}
      <div
        className="fixed top-2 h-10 flex items-center bg-white rounded-lg gap-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          left: isMenuOpen ? SIDEBAR_WIDTH + 8 : 8,
          padding: isMenuOpen ? '0 4px 0 12px' : '0 4px 0 4px',
          zIndex: 100,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        {!isMenuOpen && (
          <IconButton aria-label="Menu" variant="ghost" size="medium" onPress={onMenuClick} css={{ width: 32, height: 32, padding: 4, minWidth: 'auto', minHeight: 'auto', '& svg': { width: 24, height: 24 } }}>
            <IconLinesThreeHorizontal />
          </IconButton>
        )}

        {boardName ? (
          <div className="flex items-center" style={{ gap: '6px' }}>
            <div style={{ flexShrink: 0 }}><BoardIcon index={boardIconIndex} /></div>
            <span
              className="font-heading font-semibold text-[#222428] leading-none select-none"
              style={{ fontSize: '14px' }}
            >
              {boardName}
            </span>
            <IconButton aria-label="Board options" variant="ghost" size="medium" css={{ width: 32, height: 32, padding: 4, minWidth: 'auto', minHeight: 'auto', '& svg': { width: 16, height: 16 } }}>
              <IconDotsThreeVertical />
            </IconButton>
          </div>
        ) : (
          <div className="flex items-center" style={{ gap: '2px' }}>
            <span
              className="font-heading font-semibold text-[#222428] leading-none select-none"
              style={{ fontSize: '14px' }}
            >
              Project Galaxy
            </span>
            <span
              className="flex items-center"
              style={{ gap: '2px', color: '#B3B9C4' }}
            >
              <IconChevronRightSmall size="small" />
              <span
                className="font-heading font-semibold text-[#222428] leading-none select-none"
                style={{ fontSize: '14px' }}
              >
                {databaseTitle}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Right panel: bell + avatars + share */}
      <div
        className="fixed top-2 right-2 h-10 flex items-center bg-white rounded-lg gap-2 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          padding: '0 4px',
          zIndex: 100,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <IconButton aria-label="Notifications" variant="ghost" size="medium" css={{ width: 32, height: 32, padding: 4, minWidth: 'auto', minHeight: 'auto', '& svg': { width: 24, height: 24 } }}>
          <IconBell />
        </IconButton>

        <div className="flex items-center">
          {avatars.map((a, i) => (
            <img
              key={a.name}
              src={a.img}
              alt={a.name}
              className="w-7 h-7 rounded-full border-2 border-white object-cover"
              style={{
                marginLeft: i > 0 ? '-6px' : 0,
                zIndex: avatars.length - i,
              }}
            />
          ))}
        </div>

        <Button size="medium">Share</Button>
      </div>
    </>
  )
}
