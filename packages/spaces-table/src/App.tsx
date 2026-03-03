import { TopNavBar } from './components/TopNavBar'
import { DatabaseTitle } from './components/DatabaseTitle'

export function App() {
  return (
    <div className="flex flex-col w-screen h-screen bg-white overflow-hidden">
      <TopNavBar />
      <DatabaseTitle />
    </div>
  )
}
