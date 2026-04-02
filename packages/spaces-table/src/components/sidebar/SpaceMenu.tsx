import { useState } from 'react'
import {
  IconButton,
  IconHouse,
  IconMagnifyingGlass,
  IconCross,
  IconChevronUpDown,
  IconChevronRight,
  IconDotsThreeVertical,
  IconLightbulb,
  IconRocket,
  IconPlus,
  IconSparksFilled,
} from '@mirohq/design-system'
import { BoardIcon } from '../BoardIcons'

const pages = [
  { id: 'backlog', label: 'Backlog', icon: IconLightbulb },
  { id: 'roadmap', label: 'Roadmap', icon: IconRocket },
]

interface SidekickBoard {
  id: string
  name: string
  feedbackCard: unknown
}

interface SpaceMenuProps {
  onClose: () => void
  activePage: string
  onPageChange: (id: string) => void
  onGoHome?: () => void
  spaceName?: string
  boards?: { id: string; name: string; iconIndex: number }[]
  activeBoardId?: string
  sidekickBoards?: SidekickBoard[]
  onSidekickBoardClick?: (board: SidekickBoard) => void
  activeSidekickBoardId?: string
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="mt-1">
      <div
        className="flex items-center h-8 rounded-lg px-2 cursor-pointer hover:bg-[#F1F2F5] transition-colors duration-150 group"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span
          className="text-[#656B81] transition-transform duration-200 mr-1"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-flex' }}
        >
          <IconChevronRight size="small" />
        </span>
        <span
          className="font-body font-semibold text-[#1A1B1E] leading-none flex-1 select-none"
          style={{ fontSize: '14px' }}
        >
          {title}
        </span>
        <div
          className="flex items-center gap-0.5 transition-opacity duration-150"
          style={{ opacity: isHovered ? 1 : 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton aria-label="Add" variant="ghost" size="small">
            <IconPlus />
          </IconButton>
          <IconButton aria-label="Options" variant="ghost" size="small">
            <IconDotsThreeVertical />
          </IconButton>
        </div>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-0.5 mt-0.5">
          {children}
        </div>
      )}
    </div>
  )
}

export function SpaceMenu({ onClose, activePage, onPageChange, onGoHome, spaceName, boards, activeBoardId, sidekickBoards, onSidekickBoardClick, activeSidekickBoardId }: SpaceMenuProps) {
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
          const isActive = !activeBoardId && page.id === activePage
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
            {boards && boards.length > 0 ? 'Boards and formats' : 'Add content'}
          </span>
          <IconButton aria-label="Add content" variant="ghost" size="medium">
            <IconPlus />
          </IconButton>
        </div>

        {/* Board entries */}
        {boards && boards.length > 0 && (
          <div className="flex flex-col gap-0.5 mt-1">
            {boards.map(board => {
              const isActive = board.id === activeBoardId
              return (
                <button
                  key={board.id}
                  className={`flex items-center gap-3 w-full rounded-lg px-2 h-10 text-left transition-colors duration-150 ${
                    isActive ? 'bg-[#F3F4F6]' : 'hover:bg-[#F1F2F5]'
                  }`}
                >
                  <div style={{ flexShrink: 0 }}><BoardIcon index={board.iconIndex} /></div>
                  <span
                    className="font-body text-[#222428] leading-[1.3] select-none truncate"
                    style={{ fontSize: '14px', minWidth: 0 }}
                  >
                    {board.name}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Sidekick-created boards */}
        {sidekickBoards && sidekickBoards.length > 0 && (
          <CollapsibleSection title="Created with Sidekick" defaultOpen>
            {sidekickBoards.map(board => {
              const isActive = board.id === activeSidekickBoardId
              return (
                <button
                  key={board.id}
                  onClick={() => onSidekickBoardClick?.(board)}
                  className={`flex items-center gap-3 w-full rounded-lg px-2 h-10 text-left transition-colors duration-150 ${
                    isActive ? 'bg-[#F3F4F6]' : 'hover:bg-[#F1F2F5]'
                  }`}
                  style={{ paddingLeft: '28px' }}
                >
                  <span className="text-[#656B81]">
                    <IconSparksFilled size="small" />
                  </span>
                  <span
                    className="font-body text-[#222428] leading-[1.3] select-none truncate"
                    style={{ fontSize: '14px', minWidth: 0 }}
                  >
                    {board.name}
                  </span>
                </button>
              )
            })}
          </CollapsibleSection>
        )}

        {/* Empty state */}
        {(!boards || boards.length === 0) && (
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
        )}
      </div>
    </div>
  )
}
