const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function makeDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }

export default function Calendar({ tasks, selectedDate, onSelectDate }) {
  const today = todayStr()

  // Derive view month/year from selectedDate
  const [selYear, selMonth] = selectedDate.split('-').map(Number)
  const viewYear = selYear
  const viewMonth = selMonth - 1

  function navigate(delta) {
    const d = new Date(viewYear, viewMonth + delta, 1)
    const newYear = d.getFullYear()
    const newMonth = d.getMonth()
    // Keep same day if possible, else clamp
    const daysInNew = new Date(newYear, newMonth + 1, 0).getDate()
    const [, , selDay] = selectedDate.split('-').map(Number)
    const clampedDay = Math.min(selDay, daysInNew)
    onSelectDate(makeDateStr(newYear, newMonth, clampedDay))
  }

  const firstDow = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  // Build a map: dateStr -> [priority, ...]
  const dotMap = {}
  tasks.forEach((t) => {
    if (!t.dueDate) return
    if (!dotMap[t.dueDate]) dotMap[t.dueDate] = []
    if (!t.completed) dotMap[t.dueDate].push(t.priority)
  })

  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="calendar">
      {/* Header */}
      <div className="calendar-header">
        <button
          type="button"
          className="cal-nav-btn ghost"
          onClick={() => navigate(-1)}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="cal-month-label">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          className="cal-nav-btn ghost"
          onClick={() => navigate(1)}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Day-of-week row */}
      <div className="cal-dow-row">
        {DOW.map((d) => (
          <span key={d} className="cal-dow">{d}</span>
        ))}
      </div>

      {/* Day cells */}
      <div className="cal-grid">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="cal-cell empty" />
          const dateStr = makeDateStr(viewYear, viewMonth, day)
          const isToday = dateStr === today
          const isSelected = dateStr === selectedDate
          const dots = dotMap[dateStr] || []
          return (
            <button
              key={dateStr}
              type="button"
              className={[
                'cal-cell',
                isToday ? 'cal-today' : '',
                isSelected ? 'cal-selected' : '',
              ].join(' ')}
              onClick={() => onSelectDate(dateStr)}
              aria-label={`${MONTHS[viewMonth]} ${day}${isToday ? ', today' : ''}${isSelected ? ', selected' : ''}`}
              aria-pressed={isSelected}
            >
              <span className="cal-day-num">{day}</span>
              {dots.length > 0 && (
                <span className="cal-dots">
                  {dots.slice(0, 3).map((pri, i) => (
                    <span
                      key={i}
                      className="cal-dot"
                      style={{ background: PRIORITY_COLORS[pri] }}
                    />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
