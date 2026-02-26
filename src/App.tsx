import { SidePanel } from './components/SidePanel'

export function App() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        backgroundColor: '#F2F2F2',
        backgroundImage: 'radial-gradient(circle, #C4C4C4 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="absolute top-2 right-2 bottom-2">
        <SidePanel />
      </div>
    </div>
  )
}
