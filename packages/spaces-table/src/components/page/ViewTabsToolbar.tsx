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

interface ViewTabsToolbarProps {
  activeSidebar: SidebarId | null
  onToggleSidebar: (id: SidebarId) => void
}

export function ViewTabsToolbar({ activeSidebar, onToggleSidebar }: ViewTabsToolbarProps) {
  return (
    <div className="sticky top-14 z-20 bg-white flex items-center justify-between pl-14 pr-12 pt-4 pb-4 shrink-0">
      {/* Left: tabs */}
      <Tabs defaultValue="all-items" variant="buttons" size="medium">
        <Tabs.List>
          <Tabs.Trigger value="all-items">All items</Tabs.Trigger>
          <Tabs.Trigger value="prioritization">Prioritization</Tabs.Trigger>
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
