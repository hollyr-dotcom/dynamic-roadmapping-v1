import { roadmapData } from '@spaces/shared'

const DAY_WIDTH = 48
const BAR_HEIGHT = 40
const ROW_HEIGHT = 56
const MONTH_H = 44
const DAYS_H = 44

// View: March 1 – April 15, 2026
const VIEW_START = new Date(2026, 2, 1)
const TODAY = new Date(2026, 2, 15)
const TOTAL_DAYS = 46

// Person assignments per row
const PEOPLE: Record<string, { initials: string; bg: string }> = {
  r1:  { initials: 'H', bg: '#4262FF' },
  r2:  { initials: 'M', bg: '#FF7842' },
  r3:  { initials: 'S', bg: '#9B42FF' },
  r4:  { initials: 'H', bg: '#4262FF' },
  r5:  { initials: 'M', bg: '#FF7842' },
  r6:  { initials: 'S', bg: '#9B42FF' },
  r7:  { initials: 'H', bg: '#4262FF' },
  r8:  { initials: 'M', bg: '#FF7842' },
  r9:  { initials: 'S', bg: '#9B42FF' },
  r10: { initials: 'H', bg: '#4262FF' },
  r11: { initials: 'M', bg: '#FF7842' },
}

// [startOffset, lengthInDays] from March 1
const POSITIONS: Record<string, [number, number]> = {
  r1:  [0,  10],
  r2:  [2,  13],
  r3:  [5,  15],
  r4:  [8,  14],
  r5:  [12, 15],
  r6:  [16, 14],
  r7:  [19, 17],
  r8:  [23, 18],
  r9:  [27, 15],
  r10: [32, 14],
  r11: [36, 13],
}

const MILESTONE_OFFSET = 19 // March 20

// Build day list
const days = Array.from({ length: TOTAL_DAYS }, (_, i) => {
  const d = new Date(VIEW_START)
  d.setDate(d.getDate() + i)
  const dow = d.getDay()
  return {
    offset: i,
    num: d.getDate(),
    isWeekend: dow === 0 || dow === 6,
    isToday: d.toDateString() === TODAY.toDateString(),
    month: d.getMonth(),
  }
})

// Group by month for header
const monthGroups: { label: string; startOffset: number; count: number }[] = []
for (const day of days) {
  const label = new Date(VIEW_START.getFullYear(), day.month, 1)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const last = monthGroups[monthGroups.length - 1]
  if (!last || last.label !== label) {
    monthGroups.push({ label, startOffset: day.offset, count: 1 })
  } else {
    last.count++
  }
}

const TODAY_OFFSET = Math.floor((TODAY.getTime() - VIEW_START.getTime()) / 86400000)

// Only show non-done items
const timelineItems = roadmapData.filter(r => r.status !== 'done' && POSITIONS[r.id])

const GRID_HEIGHT = timelineItems.length * ROW_HEIGHT
const TOTAL_WIDTH = TOTAL_DAYS * DAY_WIDTH

export function TimelinePlaceholder() {
  return (
    <div className="flex-1 overflow-auto item-enter" style={{ animationDelay: '80ms' }}>
      <div style={{ position: 'relative', width: TOTAL_WIDTH, minHeight: MONTH_H + DAYS_H + GRID_HEIGHT }}>

        {/* Month header — sticky */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20, background: 'white',
          display: 'flex', height: MONTH_H,
        }}>
          {monthGroups.map(mg => (
            <div key={mg.label} style={{ width: mg.count * DAY_WIDTH, padding: '0 16px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#656B81', whiteSpace: 'nowrap' }}>{mg.label}</span>
            </div>
          ))}
        </div>

        {/* Day numbers row — sticky below month */}
        <div style={{
          position: 'sticky', top: MONTH_H, zIndex: 20, background: 'white',
          display: 'flex', height: DAYS_H,
          borderBottom: '1px solid #E9EAEF',
        }}>
          {days.map(day => (
            <div
              key={day.offset}
              style={{
                width: DAY_WIDTH,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {day.isToday ? (
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  backgroundColor: '#EDEDED',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, color: '#333',
                }}>
                  {day.num}
                </span>
              ) : (
                <span style={{ fontSize: 14, color: '#222428' }}>{day.num}</span>
              )}
            </div>
          ))}
        </div>

        {/* Grid area */}
        <div style={{ position: 'relative', height: GRID_HEIGHT, width: TOTAL_WIDTH }}>

          {/* Background columns */}
          {days.map(day => (
            <div
              key={day.offset}
              style={{
                position: 'absolute',
                left: day.offset * DAY_WIDTH,
                top: 0,
                width: DAY_WIDTH,
                height: '100%',
                backgroundColor: day.isWeekend ? '#F7F7F7' : 'white',
              }}
            />
          ))}

          {/* Today vertical line */}
          <div style={{
            position: 'absolute',
            left: (TODAY_OFFSET + 0.5) * DAY_WIDTH,
            top: 0,
            width: 0,
            height: '100%',
            borderLeft: '1px dashed #FF9F4D',
            zIndex: 2,
          }} />

          {/* Milestone dashed line */}
          <div style={{
            position: 'absolute',
            left: (MILESTONE_OFFSET + 0.5) * DAY_WIDTH,
            top: 0,
            width: 0,
            height: '100%',
            borderLeft: '1px dashed #C7CAD5',
            zIndex: 2,
          }} />

          {/* Timeline bars */}
          {timelineItems.map((row, i) => {
            const [startOff, len] = POSITIONS[row.id]
            const person = PEOPLE[row.id] ?? { initials: '?', bg: '#AEB2C0' }
            return (
              <div
                key={row.id}
                style={{
                  position: 'absolute',
                  left: startOff * DAY_WIDTH,
                  top: i * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2,
                  width: len * DAY_WIDTH - 4,
                  height: BAR_HEIGHT,
                  backgroundColor: 'white',
                  border: '1px solid #C7CAD5',
                  borderRadius: 4,
                  boxShadow: '0px 2px 4px rgba(34,36,40,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0 12px',
                  overflow: 'hidden',
                  zIndex: 3,
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  backgroundColor: person.bg,
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 10, fontWeight: 700,
                }}>
                  {person.initials}
                </div>
                <span style={{
                  fontSize: 14,
                  color: '#222428',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}>
                  {row.title}
                </span>
              </div>
            )
          })}

          {/* Milestone diamond */}
          <div style={{
            position: 'absolute',
            left: MILESTONE_OFFSET * DAY_WIDTH + DAY_WIDTH / 2 - 16,
            top: 3 * ROW_HEIGHT + ROW_HEIGHT / 2 - 16,
            width: 32,
            height: 32,
            transform: 'rotate(45deg)',
            backgroundColor: 'white',
            border: '1px solid #C7CAD5',
            borderRadius: 5,
            boxShadow: '0px 2px 4px rgba(34,36,40,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 4,
          }}>
            <div style={{ width: 16, height: 16, borderRadius: 2, backgroundColor: '#FE9F4D' }} />
          </div>

        </div>
      </div>
    </div>
  )
}
