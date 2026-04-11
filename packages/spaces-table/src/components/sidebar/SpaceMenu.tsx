import {
  IconButton,
  IconHouse,
  IconMagnifyingGlass,
  IconCross,
  IconChevronUpDown,
  IconDotsThreeVertical,
  IconLightbulb,
  IconRocket,
  IconPlus,
  IconRectanglesTwoLinesFour,
} from '@mirohq/design-system'

const pages = [
  { id: 'overview', label: 'Signals', icon: IconRectanglesTwoLinesFour },
  { id: 'backlog', label: 'Backlog', icon: IconLightbulb },
  { id: 'roadmap', label: 'Roadmap', icon: IconRocket },
]

interface SpaceMenuProps {
  onClose: () => void
  activePage: string
  onPageChange: (id: string) => void
  onGoHome?: () => void
  spaceName?: string
}

export function SpaceMenu({ onClose, activePage, onPageChange, onGoHome, spaceName }: SpaceMenuProps) {
  return (
    <div className="flex flex-col h-full pt-2 px-3">
      {/* Top bar: Home | Search + Close */}
      <div className="flex items-center justify-between">
        <IconButton aria-label="Home" variant="ghost" size="large" onPress={onGoHome}>
          <IconHouse />
        </IconButton>
        <div className="flex items-center">
          <IconButton aria-label="Search" variant="ghost" size="large">
            <IconMagnifyingGlass />
          </IconButton>
          <IconButton aria-label="Close" variant="ghost" size="large" onPress={onClose}>
            <IconCross />
          </IconButton>
        </div>
      </div>

      {/* Space header */}
      <div className="flex items-start justify-between pl-3 mt-[58px] rounded-lg">
        <div className="min-w-0">
          <span
            className="font-heading font-semibold text-[#1A1B1E] leading-[1.4] truncate block"
            style={{ fontSize: '20px', fontFeatureSettings: "'ss01' 1" }}
          >
            {spaceName || 'Project Galaxy'}
          </span>
          <span
            className="font-body text-[#656B81] leading-[1.4] cursor-pointer hover:underline"
            style={{ fontSize: '14px' }}
          >
            1 member
          </span>
        </div>
        <div className="flex items-center" style={{ marginRight: '4px' }}>
          <IconButton aria-label="Switch space" variant="ghost" size="medium">
            <IconChevronUpDown />
          </IconButton>
          <div style={{ width: '8px' }} />
          <IconButton aria-label="Space options" variant="ghost" size="medium">
            <IconDotsThreeVertical />
          </IconButton>
        </div>
      </div>

      {/* Page list */}
      <div className="flex flex-col gap-1 mt-[18px]">
        {pages.map((page) => {
          const Icon = page.icon
          const isActive = page.id === activePage
          return (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              className={`flex items-center gap-3 px-2 h-10 rounded-lg w-full text-left transition-colors duration-150 ${
                isActive
                  ? 'bg-[#F3F4F6]'
                  : 'hover:bg-[#F1F2F5]'
              }`}
            >
              <span className="text-[#1A1B1E]">
                <Icon size="medium" />
              </span>
              <span
                className={`font-body leading-[1.3] text-[#1A1B1E] ${isActive ? 'font-semibold' : ''}`}
                style={{ fontSize: '14px' }}
              >
                {page.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="flex items-center px-2 mt-[22px] mb-2">
        <div className="flex-1 h-px bg-[#E9EAEF]" />
      </div>

      {/* Space content section */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between pl-3" style={{ paddingRight: '4px' }}>
          <span
            className="font-body text-[#656B81] leading-none"
            style={{ fontSize: '14px' }}
          >
            Add content
          </span>
          <IconButton aria-label="Add content" variant="ghost" size="medium">
            <IconPlus />
          </IconButton>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-6">
          <span
            className="font-body font-semibold text-[#656B81] text-center leading-[1.4]"
            style={{ fontSize: '12px' }}
          >
            Pinned content
          </span>
          <span
            className="font-body text-[#656B81] text-center leading-[1.4] mt-1"
            style={{ fontSize: '12px' }}
          >
            Add important boards and formats to share with your team
          </span>
        </div>
      </div>
    </div>
  )
}
