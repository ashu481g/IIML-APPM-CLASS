import { useMemo, useState } from 'react'
import TaskFilters from './components/TaskFilters'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import { useTasks } from './hooks/useTasks'
import './App.css'

export default function App() {
  const [filter, setFilter] = useState('all')
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

  const visibleTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((task) => !task.completed)
    if (filter === 'completed') return tasks.filter((task) => task.completed)
    return tasks
  }, [tasks, filter])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p>Stay organized. Track what matters.</p>
      </header>

      <main className="app-card">
        <TaskInput onAdd={addTask} />
        <TaskList
          tasks={visibleTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
        />
        {tasks.length > 0 && (
          <TaskFilters
            filter={filter}
            onFilterChange={setFilter}
            activeCount={activeCount}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
          />
        )}
      </main>
    </div>
  )
}
