import { TopNavBar } from './components/page/TopNavBar'
import { DatabaseTitle } from './components/page/DatabaseTitle'
import { ViewTabsToolbar } from './components/page/ViewTabsToolbar'
import { DataTable } from './components/table'

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
