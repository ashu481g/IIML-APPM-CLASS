import { useEffect, useState } from 'react'

const STORAGE_KEY = 'task-manager-tasks'

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState(loadTasks)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask(title, priority = 'medium') {
    const trimmed = title.trim()
    if (!trimmed) return false

    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        title: trimmed,
        completed: false,
        priority,
        createdAt: Date.now(),
      },
      ...prev,
    ])
    return true
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  function editTask(id, title) {
    const trimmed = title.trim()
    if (!trimmed) return false

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, title: trimmed } : task,
      ),
    )
    return true
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }

  const activeCount = tasks.filter((task) => !task.completed).length
  const completedCount = tasks.length - activeCount

  return {
    tasks,
    activeCount,
    completedCount,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    clearCompleted,
  }
}
