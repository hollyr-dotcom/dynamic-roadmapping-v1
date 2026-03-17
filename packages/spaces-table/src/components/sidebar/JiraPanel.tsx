import {
  IconSocialJira,
  IconSidebarGlobalOpen,
  IconArrowsSquareCounterClockwiseY,
  IconBookmark,
  IconSelect,
  IconPlus,
} from '@mirohq/design-system'
import type { SpaceRow } from '@spaces/shared'

interface JiraPanelProps {
  row: SpaceRow
  onClose: () => void
}

interface JiraTableRow {
  num: string
  id: string
  title: string
  status: string
  statusBg: string
  statusText: string
  showJiraIcon: boolean
  rowId?: string
}

const TABLE_ROWS: JiraTableRow[] = [
  { num: '1', id: 'PT-165', title: 'Inconsistent styling',        status: 'To Do',      statusBg: '#595959', statusText: '#f7f7f7', showJiraIcon: true  },
  { num: '2', id: '',       title: 'Release 1.0',                  status: 'To do',      statusBg: '#e7e7e7', statusText: '#333333', showJiraIcon: false },
  { num: '3', id: '',       title: 'Missing favicon',              status: 'Done',       statusBg: '#e7e7e7', statusText: '#333333', showJiraIcon: false },
  { num: '',  id: 'PT-309', title: 'Form submission error',        status: 'In progress',statusBg: '#d6d6d6', statusText: '#333333', showJiraIcon: true,  rowId: 'r2' },
  { num: '5', id: 'PT-411', title: 'Cross-browser compatibility',  status: 'Done',       statusBg: '#595959', statusText: '#f7f7f7', showJiraIcon: true  },
]

export function JiraPanel({ row, onClose }: JiraPanelProps) {
  const selectedTicket = TABLE_ROWS.find(r => r.rowId === row.id)

  return (
    <div
      className="flex flex-col h-full bg-white overflow-hidden"
      style={{
        border: '1px solid #E0E2E8',
        boxShadow: '0px 0px 12px 0px rgba(34,36,40,0.04), 0px 2px 8px 0px rgba(34,36,40,0.12)',
      }}
    >
      {/* Top bar with sidebar toggle */}
      <div className="flex items-center justify-between px-1.5 pt-1.5 pb-0 shrink-0">
        {selectedTicket?.id ? (
          <div className="flex items-center gap-1.5 pl-1">
            <IconSocialJira css={{ width: 14, height: 14, flexShrink: 0 }} />
            <span className="text-[13px] font-semibold text-[#222428]">{selectedTicket.id}</span>
          </div>
        ) : (
          <div />
        )}
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors"
        >
          <IconSidebarGlobalOpen css={{ width: 20, height: 20 }} />
        </button>
      </div>

      {/* Column headers */}
      <div
        className="flex items-center shrink-0"
        style={{ borderTop: '1px solid #E0E2E8', borderBottom: '1px solid #E0E2E8' }}
      >
        {/* Row number spacer */}
        <div className="w-[44px] h-[44px] shrink-0" />
        {/* ID header */}
        <div className="flex-1 h-[44px] flex items-center gap-2 px-2 min-w-0">
          <IconArrowsSquareCounterClockwiseY css={{ width: 16, height: 16, color: '#656B81', flexShrink: 0 }} />
          <span className="text-[14px] font-semibold text-[#656B81] truncate">ID</span>
        </div>
        {/* Title header */}
        <div className="flex-1 h-[44px] flex items-center gap-2 px-2 min-w-0">
          <IconBookmark css={{ width: 16, height: 16, color: '#656B81', flexShrink: 0 }} />
          <span className="text-[14px] font-semibold text-[#656B81] truncate">Title</span>
        </div>
        {/* Status header */}
        <div className="shrink-0 h-[44px] flex items-center gap-2 px-2" style={{ width: 120 }}>
          <IconSelect css={{ width: 16, height: 16, color: '#656B81', flexShrink: 0 }} />
          <span className="text-[14px] font-semibold text-[#656B81] truncate">Status</span>
        </div>
        {/* Trailing spacer */}
        <div className="w-[44px] h-[44px] shrink-0" />
      </div>

      {/* Data rows */}
      <div className="flex flex-col overflow-y-auto flex-1">
        {TABLE_ROWS.map((r, i) => {
          const isSelected = r.rowId === row.id
          const bg = isSelected ? '#F1F2F5' : 'white'
          return (
            <div
              key={i}
              className="flex items-center shrink-0"
              style={{ borderBottom: '1px solid #E0E2E8', backgroundColor: bg }}
            >
              {/* Row number */}
              <div className="w-[44px] h-[44px] flex items-center justify-center shrink-0">
                <span className="text-[14px] text-[#AEB2C0]">{r.num}</span>
              </div>
              {/* ID */}
              <div className="flex-1 h-[44px] flex items-center overflow-hidden min-w-0">
                {r.id ? (
                  <>
                    <span className="w-8 h-8 flex items-center justify-center shrink-0">
                      <IconSocialJira css={{ width: 16, height: 16 }} />
                    </span>
                    <span className="text-[14px] text-[#222428] truncate">{r.id}</span>
                  </>
                ) : (
                  <span className="px-2 text-[14px] text-[#222428] truncate">{r.id}</span>
                )}
              </div>
              {/* Title */}
              <div className="flex-1 h-[44px] flex items-center px-2 overflow-hidden min-w-0">
                <span className="text-[14px] text-[#222428] truncate">{r.title}</span>
              </div>
              {/* Status */}
              <div className="shrink-0 h-[44px] flex items-center px-2" style={{ width: 120 }}>
                <div
                  className="flex items-center gap-1 px-1.5 h-7 shrink-0"
                  style={{ backgroundColor: r.statusBg, borderRadius: 4 }}
                >
                  {r.showJiraIcon && (
                    <IconSocialJira css={{ width: 14, height: 14, flexShrink: 0 }} />
                  )}
                  <span
                    className="text-[14px] leading-[1.4] whitespace-nowrap"
                    style={{ color: r.statusText }}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
              {/* Trailing spacer */}
              <div className="w-[44px] h-[44px] shrink-0" />
            </div>
          )
        })}
      </div>

      {/* Add new row */}
      <div
        className="h-[44px] flex items-center px-[6px] shrink-0"
        style={{ borderTop: '1px solid #E0E2E8' }}
      >
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#656B81] hover:bg-[#F1F2F5] transition-colors">
          <IconPlus css={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  )
}
