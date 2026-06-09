interface SearchBarProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label htmlFor="search-input" className="search-bar__label">
        Search Tasks
      </label>
      <div className="search-bar__wrapper">
        <span className="search-bar__icon" aria-hidden="true">🔍</span>
        <input
          id="search-input"
          type="text"
          className="search-bar__input"
          placeholder="Search by title..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            className="search-bar__clear"
            onClick={() => onChange('')}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
