import {
  Tabs,
  IconButton,
  Button,
  DropdownMenu,
  IconMagnifyingGlass,
  IconSlidersY,
  IconChevronDown,
} from '@mirohq/design-system'

export function ViewTabsToolbar() {
  return (
    <div className="flex items-center justify-between px-6 pb-4 shrink-0">
      {/* Left: tabs */}
      <Tabs defaultValue="all-items" variant="tabs" size="medium">
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

        <IconButton aria-label="View settings" variant="ghost" size="medium">
          <IconSlidersY />
        </IconButton>

        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button size="small">
              <Button.Label>New</Button.Label>
              <Button.IconSlot>
                <IconChevronDown />
              </Button.IconSlot>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content side="bottom" align="end">
            <DropdownMenu.Item>Text</DropdownMenu.Item>
            <DropdownMenu.Item>Number</DropdownMenu.Item>
            <DropdownMenu.Item>Status</DropdownMenu.Item>
            <DropdownMenu.Item>Person</DropdownMenu.Item>
            <DropdownMenu.Item>Date</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    </div>
  )
}
