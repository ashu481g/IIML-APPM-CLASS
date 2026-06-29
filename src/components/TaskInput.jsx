import { useState } from 'react'

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export default function TaskInput({ onAdd, selectedDate }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')

  function handleSubmit(event) {
    event.preventDefault()
    if (onAdd(title, priority, selectedDate)) {
      setTitle('')
      setPriority('medium')
    }
  }

  return (
    <form className="task-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs to be done?"
        aria-label="Task title"
        autoComplete="off"
      />
      <select
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
        aria-label="Task priority"
      >
        {PRIORITIES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button type="submit" disabled={!title.trim()}>
        Add task
      </button>
    </form>
  )
}
