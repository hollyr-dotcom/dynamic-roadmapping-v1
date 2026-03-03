import { TopNavBar } from './components/TopNavBar'
import { DatabaseTitle } from './components/DatabaseTitle'
import { ViewTabsToolbar } from './components/ViewTabsToolbar'
import { DataTable } from './components/DataTable'

export function App() {
  return (
    <div className="flex flex-col w-screen h-screen bg-white overflow-hidden">
      <TopNavBar />
      <DatabaseTitle />
      <ViewTabsToolbar />
      <DataTable />
    </div>
  )
}
