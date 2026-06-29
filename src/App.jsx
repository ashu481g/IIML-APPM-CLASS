import { useMemo, useState } from 'react'
import Calendar from './components/Calendar'
import TaskFilters from './components/TaskFilters'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import { useTasks } from './hooks/useTasks'
import './App.css'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function friendlyDate(str) {
  const today = todayStr()
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const tom = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  if (str === today) return 'Today'
  if (str === tom) return 'Tomorrow'
  const [y, m, day] = str.split('-').map(Number)
  return new Date(y, m - 1, day).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

export default function App() {
  const [filter, setFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState(todayStr)

  const {
    tasks,
    activeCount,
    completedCount,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    clearCompleted,
  } = useTasks()

  // Tasks for selected date (for the task list)
  const dayTasks = useMemo(
    () => tasks.filter((t) => t.dueDate === selectedDate),
    [tasks, selectedDate],
  )

  const visibleTasks = useMemo(() => {
    if (filter === 'active') return dayTasks.filter((t) => !t.completed)
    if (filter === 'completed') return dayTasks.filter((t) => t.completed)
    return dayTasks
  }, [dayTasks, filter])

  const dayActiveCount = dayTasks.filter((t) => !t.completed).length
  const dayCompletedCount = dayTasks.length - dayActiveCount

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p>Stay organized. Track what matters.</p>
      </header>

      <div className="app-layout">
        {/* Left: Calendar */}
        <aside className="calendar-col">
          <Calendar
            tasks={tasks}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </aside>

        {/* Right: Task panel for selected date */}
        <main className="app-card">
          <div className="day-heading">
            <span className="day-label">{friendlyDate(selectedDate)}</span>
            <span className="day-count">
              {dayActiveCount} pending · {dayCompletedCount} done
            </span>
          </div>

          <TaskInput onAdd={addTask} selectedDate={selectedDate} />
          <TaskList
            tasks={visibleTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
          />
          {dayTasks.length > 0 && (
            <TaskFilters
              filter={filter}
              onFilterChange={setFilter}
              activeCount={dayActiveCount}
              completedCount={dayCompletedCount}
              onClearCompleted={clearCompleted}
            />
          )}
        </main>
      </div>
    </div>
  )
}
