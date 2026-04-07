import {
  IconButton,
  IconSparksFilled,
  IconCursorFilled,
  IconLayout,
  IconTextT,
  IconStickyNote,
  IconShapesLines,
  IconPenTip,
  IconChatLinesTwo,
  IconFrame,
  IconNodesConnected,
  IconPlusSquare,
  IconArrowArcLeft,
  IconArrowArcRight,
} from '@mirohq/design-system'

const SIDEBAR_WIDTH = 320

const iconCss = { borderRadius: 4 }
const selectedCss = { borderRadius: 4, background: '#E8ECFC', color: '#2B4DF8', '&:hover': { background: '#D9DFFC' } }

// icon-plus-lines-box — document with plus and lines, matches Figma node 40022:29250
function IconPlusLinesBox() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M22 7H19V10H17V7H14V5H17V2H19V5H22V7Z" fill="currentColor"/>
      <path d="M3 18V6C3 4.34315 4.34315 3 6 3H12V5H6C5.44772 5 5 5.44772 5 6V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V12H21V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18Z" fill="currentColor"/>
      <path d="M17 15V17H7V15H17Z" fill="currentColor"/>
      <path d="M15 11V13H7V11H15Z" fill="currentColor"/>
      <path d="M12 7V9H7V7H12Z" fill="currentColor"/>
    </svg>
  )
}

interface CanvasCreationToolbarProps {
  isOpen: boolean
  isMenuOpen?: boolean
}

export function CanvasCreationToolbar({ isOpen, isMenuOpen }: CanvasCreationToolbarProps) {
  return (
    <div
      className="fixed flex flex-col items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        left: isMenuOpen ? SIDEBAR_WIDTH + 8 : 8,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        gap: 8,
      }}
    >
      {/* AI entry point — circle, outside the white card */}
      <button
        className="w-12 h-12 flex items-center justify-center rounded-full shrink-0"
        style={{
          background: 'linear-gradient(135deg, #322BFE 0%, #6E3CFE 27%, #A34CFF 55%, #D05DFF 82%, #F66EFF 100%)',
          boxShadow: '0 2px 8px rgba(50,43,254,0.3)',
        }}
      >
        <IconSparksFilled css={{ width: 24, height: 24, color: 'white' }} />
      </button>

      {/* Main toolbar card */}
      <div
        className="flex flex-col items-center bg-white rounded-lg"
        style={{
          boxShadow: '0 2px 4px rgba(34,36,40,0.14)',
          padding: '4px',
          gap: '2px',
        }}
      >
        {/* Tool buttons */}
        <IconButton aria-label="Select" variant="ghost" size="large" css={selectedCss}>
          <IconCursorFilled />
        </IconButton>
        <IconButton aria-label="AI formats" variant="ghost" size="large" css={{ ...iconCss, color: '#222428' }}>
          <IconPlusLinesBox />
        </IconButton>
        <IconButton aria-label="Templates" variant="ghost" size="large" css={iconCss}>
          <IconLayout />
        </IconButton>
        <IconButton aria-label="Text" variant="ghost" size="large" css={iconCss}>
          <IconTextT />
        </IconButton>
        <IconButton aria-label="Sticky note" variant="ghost" size="large" css={iconCss}>
          <IconStickyNote />
        </IconButton>
        <IconButton aria-label="Shapes" variant="ghost" size="large" css={iconCss}>
          <IconShapesLines />
        </IconButton>
        <IconButton aria-label="Pen" variant="ghost" size="large" css={iconCss}>
          <IconPenTip />
        </IconButton>
        <IconButton aria-label="Comment" variant="ghost" size="large" css={iconCss}>
          <IconChatLinesTwo />
        </IconButton>
        <IconButton aria-label="Frame" variant="ghost" size="large" css={iconCss}>
          <IconFrame />
        </IconButton>
        <IconButton aria-label="Connections" variant="ghost" size="large" css={iconCss}>
          <IconNodesConnected />
        </IconButton>

        {/* Divider */}
        <div className="w-6 h-px bg-[#E9EAEF] my-0.5" />

        <IconButton aria-label="More tools" variant="ghost" size="large" css={iconCss}>
          <IconPlusSquare />
        </IconButton>
      </div>

      {/* Undo/Redo card — separate from main toolbar */}
      <div
        className="flex flex-col items-center bg-white rounded-lg"
        style={{
          boxShadow: '0 2px 4px rgba(34,36,40,0.14)',
          padding: '4px',
          gap: '2px',
        }}
      >
        <IconButton aria-label="Undo" variant="ghost" size="large" css={iconCss}>
          <IconArrowArcLeft />
        </IconButton>
        <IconButton aria-label="Redo" variant="ghost" size="large" css={iconCss}>
          <IconArrowArcRight />
        </IconButton>
      </div>
    </div>
  )
}
