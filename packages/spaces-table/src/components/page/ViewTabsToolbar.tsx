import {
  Tabs,
  IconButton,
  DropdownMenu,
  IconMagnifyingGlass,
  IconSparksFilled,
  IconSlidersY,
  IconPlus,
  IconDotsThree,
} from '@mirohq/design-system'

export type SidebarId = 'space-menu' | 'ai-sidekick' | 'view-settings'

export interface TabConfig {
  id: string
  label: string
}

interface ViewTabsToolbarProps {
  tabs: TabConfig[]
  activeSidebar: SidebarId | null
  onToggleSidebar: (id: SidebarId) => void
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ViewTabsToolbar({ tabs, activeSidebar, onToggleSidebar, activeTab, onTabChange }: ViewTabsToolbarProps) {
  return (
    <div className="sticky top-0 left-0 z-20 bg-white flex items-center justify-between pl-14 pr-12 pt-4 pb-4 shrink-0">
      {/* Left: tabs */}
      <Tabs value={activeTab} onChange={onTabChange} variant="buttons" size="medium">
        <Tabs.List>
          {tabs.map(tab => (
            <Tabs.Trigger key={tab.id} value={tab.id}>{tab.label}</Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <IconButton aria-label="Search" variant="ghost" size="medium">
          <IconMagnifyingGlass />
        </IconButton>

        <IconButton
          aria-label="AI Sidekick"
          variant="ghost"
          size="medium"
          onPress={() => onToggleSidebar('ai-sidekick')}
          css={activeSidebar === 'ai-sidekick' ? { background: '#F1F2F5' } : undefined}
        >
          <IconSparksFilled />
        </IconButton>

        <IconButton
          aria-label="View settings"
          variant="ghost"
          size="medium"
          onPress={() => onToggleSidebar('view-settings')}
          css={activeSidebar === 'view-settings' ? { background: '#F1F2F5' } : undefined}
        >
          <IconSlidersY />
        </IconButton>

        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton aria-label="New column" variant="ghost" size="medium">
              <IconPlus />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content side="bottom" align="end">
            <DropdownMenu.Item>Text</DropdownMenu.Item>
            <DropdownMenu.Item>Number</DropdownMenu.Item>
            <DropdownMenu.Item>Status</DropdownMenu.Item>
            <DropdownMenu.Item>Person</DropdownMenu.Item>
            <DropdownMenu.Item>Date</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>

        <IconButton aria-label="More options" variant="ghost" size="medium">
          <IconDotsThree />
        </IconButton>
      </div>
    </div>
  )
}
