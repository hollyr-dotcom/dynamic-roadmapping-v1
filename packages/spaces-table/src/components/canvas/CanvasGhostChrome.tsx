/* Ghost/skeleton chrome panels shown during the canvas loading transition.
   Positions match CanvasNavPanels + CanvasCreationToolbar exactly so they
   crossfade seamlessly when the real toolbars appear. */

interface CanvasGhostChromeProps {
  isVisible: boolean
}

const GHOST_COLOR = '#E0E2E8'

/* Reusable gray block placeholder */
function Block({ w, h, r = 8 }: { w: number; h: number; r?: number }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: GHOST_COLOR, flexShrink: 0 }} />
}

/* Small square icon placeholder (matches MDS IconButton large = 40px with 24px icon area) */
function IconBlock() {
  return (
    <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Block w={24} h={24} r={4} />
    </div>
  )
}

export function CanvasGhostChrome({ isVisible }: CanvasGhostChromeProps) {
  return (
    <>
      {/* Top-left nav panel — matches CanvasNavPanels left panel exactly */}
      <div
        className="fixed top-2 h-12 flex items-center bg-white rounded-lg gap-2"
        style={{
          left: 8,
          padding: '0 4px 0 4px',
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          pointerEvents: 'none',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <IconBlock />
        <Block w={8} h={8} r={4} />
        <Block w={120} h={14} r={4} />
        <Block w={60} h={14} r={4} />
      </div>

      {/* Top-right collab panel — matches CanvasNavPanels right panel (right-2 = 8px) */}
      <div
        className="fixed top-2 right-2 h-12 flex items-center bg-white rounded-lg"
        style={{
          padding: '0 8px',
          gap: 12,
          zIndex: 100,
          boxShadow: '0 2px 4px rgba(34,36,40,0.08)',
          pointerEvents: 'none',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1) 100ms',
        }}
      >
        {/* Facilitation + Activity + Huddles */}
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 56, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Block w={48} h={24} r={4} />
          </div>
          <IconBlock />
          <IconBlock />
        </div>
        {/* Avatar pill */}
        <Block w={100} h={28} r={14} />
        {/* Present + Share buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Block w={88} h={32} r={6} />
          <Block w={64} h={32} r={6} />
        </div>
      </div>

      {/* Left creation toolbar — matches CanvasCreationToolbar exactly */}
      <div
        className="fixed flex flex-col items-center"
        style={{
          left: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 100,
          gap: 8,
          pointerEvents: 'none',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1) 200ms',
        }}
      >
        {/* AI circle */}
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: GHOST_COLOR, flexShrink: 0 }} />

        {/* Main tool card — 11 icon slots + divider + 1 more */}
        <div
          className="flex flex-col items-center bg-white rounded-lg"
          style={{ boxShadow: '0 2px 4px rgba(34,36,40,0.14)', padding: 4, gap: 2 }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <IconBlock key={i} />
          ))}
          {/* Divider */}
          <div style={{ width: 24, height: 1, background: '#E9EAEF', margin: '2px 0' }} />
          <IconBlock />
        </div>

        {/* Undo/redo card */}
        <div
          className="flex flex-col items-center bg-white rounded-lg"
          style={{ boxShadow: '0 2px 4px rgba(34,36,40,0.14)', padding: 4, gap: 2 }}
        >
          <IconBlock />
          <IconBlock />
        </div>
      </div>
    </>
  )
}
