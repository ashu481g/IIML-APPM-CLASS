const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export default function TaskFilters({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted,
}) {
  return (
    <footer className="task-footer">
      <span className="task-count">
        {activeCount} {activeCount === 1 ? 'task' : 'tasks'} left
      </span>

      <div className="filter-group" role="group" aria-label="Filter tasks">
        {FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={filter === option.value ? 'active' : ''}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {completedCount > 0 && (
        <button type="button" className="ghost" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  )
}
