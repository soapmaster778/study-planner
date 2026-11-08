import type { TaskFilter } from '../types/task';

interface TaskFiltersProps {
    currentFilter: TaskFilter;
    onFilterChange: (filter: TaskFilter) => void;
}

const filters: { value: TaskFilter; label: string }[] = [
    { value: 'all', label: 'Всі' },
    { value: 'completed', label: 'Виконані' },
    { value: 'active', label: 'Не виконані' },
];

export default function TaskFilters({
                                        currentFilter,
                                        onFilterChange,
                                    }: TaskFiltersProps) {
    return (
        <div
            className="d-flex flex-wrap gap-2 mb-3"
            role="group"
            aria-label="Фільтри завдань"
        >
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    type="button"
                    className={`btn ${
                        currentFilter === filter.value
                            ? 'btn-primary'
                            : 'btn-outline-primary'
                    }`}
                    aria-pressed={currentFilter === filter.value}
                    onClick={() => onFilterChange(filter.value)}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}