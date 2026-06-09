import type { PriorityFilter as PriorityFilterType } from '../hooks/useTasks';

interface PriorityFilterProps {
  readonly value: PriorityFilterType;
  readonly onChange: (value: PriorityFilterType) => void;
}

const FILTER_OPTIONS: { value: PriorityFilterType; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function PriorityFilter({ value, onChange }: PriorityFilterProps) {
  return (
    <fieldset className="priority-filter">
      <legend className="sr-only">Filter by priority</legend>
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
    </fieldset>
  );
}
