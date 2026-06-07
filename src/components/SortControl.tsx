import type { SortBy } from '../hooks/useTasks';

interface SortControlProps {
  value: SortBy;
  onChange: (value: SortBy) => void;
}

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'createdAt', label: 'Newest First' },
  { value: 'priority', label: 'Priority (High to Low)' },
  { value: 'dueDate', label: 'Due Date (Earliest First)' },
];

export function SortControl({ value, onChange }: SortControlProps) {
  return (
    <div className="sort-control">
      <label htmlFor="task-sort" className="sort-control__label">Sort By</label>
      <select
        id="task-sort"
        className="sort-control__select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortBy)}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
