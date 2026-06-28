import { useState } from 'react'

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)

  function saveEdit() {
    if (onEdit(task.id, draft)) {
      setEditing(false)
    }
  }

  function cancelEdit() {
    setDraft(task.title)
    setEditing(false)
  }

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="checkmark" />
      </label>

      <div className="task-body">
        {editing ? (
          <input
            className="task-edit"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') saveEdit()
              if (event.key === 'Escape') cancelEdit()
            }}
            autoFocus
          />
        ) : (
          <span className="task-title">{task.title}</span>
        )}
        <span className={`priority priority-${task.priority}`}>
          {task.priority}
        </span>
      </div>

      <div className="task-actions">
        {editing ? (
          <>
            <button type="button" className="ghost" onClick={saveEdit}>
              Save
            </button>
            <button type="button" className="ghost" onClick={cancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="ghost"
              onClick={() => setEditing(true)}
              disabled={task.completed}
            >
              Edit
            </button>
            <button
              type="button"
              className="ghost danger"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  )
}
