import type { Priority } from '@spaces/shared'
import type { FieldDefinition, SpaceRow } from '@spaces/shared'
import { DatabaseTitle } from '../page/DatabaseTitle'
import { ViewTabsToolbar, type SidebarId, type TabConfig, type ViewType } from '../page/ViewTabsToolbar'
import { DataTable } from '../table'
import { KanbanBoard } from '../kanban'
import { TimelinePlaceholder } from '../timeline'

interface CanvasTableWidgetProps {
  isOpen: boolean
  databaseTitle: string
  onTitleChange: (title: string) => void
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (tab: string) => void
  activeSidebar: SidebarId | null
  onToggleSidebar: (id: SidebarId) => void
  onAddView: (type: ViewType) => void
  onRenameTab: (tabId: string, newLabel: string) => void
  onDuplicateTab: (tabId: string) => void
  onDeleteTab: (tabId: string) => void
  onReorderTabs: (tabs: TabConfig[]) => void
  newColumnMenuOpen: boolean
  onNewColumnMenuOpenChange: (open: boolean) => void
  activeViewType: ViewType | undefined
  viewData: SpaceRow[]
  fields: FieldDefinition[]
  kanbanColumns?: Priority[]
}

export function CanvasTableWidget({
  isOpen,
  databaseTitle,
  onTitleChange,
  tabs,
  activeTab,
  onTabChange,
  activeSidebar,
  onToggleSidebar,
  onAddView,
  onRenameTab,
  onDuplicateTab,
  onDeleteTab,
  onReorderTabs,
  newColumnMenuOpen,
  onNewColumnMenuOpenChange,
  activeViewType,
  viewData,
  fields,
  kanbanColumns,
}: CanvasTableWidgetProps) {
  return (
    <div
      className="fixed transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        zIndex: 70,
        top: 128,
        left: '50%',
        transform: isOpen
          ? 'translateX(-50%) scale(1)'
          : 'translateX(-50%) scale(0.96)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        background: '#FFFFFF',
        borderRadius: 12,
        padding: '32px 40px 40px',
        boxShadow: '0 2px 4px 0 rgba(34, 36, 40, 0.08)',
        overflow: 'hidden',
      }}
    >
      <DatabaseTitle
        variant="widget"
        opacity={1}
        title={databaseTitle}
        onTitleChange={onTitleChange}
      />

      <ViewTabsToolbar
        variant="widget"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        activeSidebar={activeSidebar}
        onToggleSidebar={onToggleSidebar}
        onAddView={onAddView}
        onRenameTab={onRenameTab}
        onDuplicateTab={onDuplicateTab}
        onDeleteTab={onDeleteTab}
        onReorderTabs={onReorderTabs}
        newColumnMenuOpen={newColumnMenuOpen}
        onNewColumnMenuOpenChange={onNewColumnMenuOpenChange}
      />

      {/* View content — canvas-widget-view zeroes out the built-in pl-14 gutters */}
      <div className="canvas-widget-view">
        {activeViewType === 'table' && (
          <DataTable key={activeTab} data={viewData} fields={fields} />
        )}
        {activeViewType === 'kanban' && (
          <KanbanBoard key={activeTab} data={viewData} fields={fields} columns={kanbanColumns} />
        )}
        {activeViewType === 'timeline' && (
          <TimelinePlaceholder key={activeTab} />
        )}
      </div>
    </div>
  )
}
