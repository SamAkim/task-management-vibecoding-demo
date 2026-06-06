import type { StatusFilter as StatusFilterType } from '../hooks/useTasks';

interface StatusFilterProps {
  value: StatusFilterType;
  onChange: (value: StatusFilterType) => void;
}

const FILTER_OPTIONS: { value: StatusFilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="status-filter" role="group" aria-label="Filter by status">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`status-filter__button ${
            value === option.value ? 'status-filter__button--active' : ''
          }`}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
