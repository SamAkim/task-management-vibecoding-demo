import type { PriorityFilter as PriorityFilterType } from '../hooks/useTasks';

interface PriorityFilterProps {
  value: PriorityFilterType;
  onChange: (value: PriorityFilterType) => void;
}

const FILTER_OPTIONS: { value: PriorityFilterType; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function PriorityFilter({ value, onChange }: PriorityFilterProps) {
  return (
    <div className="priority-filter" role="group" aria-label="Filter by priority">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`priority-filter__button ${
            value === option.value ? 'priority-filter__button--active' : ''
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
