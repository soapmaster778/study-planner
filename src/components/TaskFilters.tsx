import type { TaskFilter } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

const filters: { value: TaskFilter; label: string }[] = [
    { value: 'all', label: 'Всі' },
    { value: 'completed', label: 'Виконані' },
    { value: 'active', label: 'Не виконані' },
];

export default function TaskFilters() {
    const { filter, setFilter } = useTaskContext();

    return (
        <div
            className="d-flex flex-wrap gap-2 mb-3"
            role="group"
            aria-label="Фільтри завдань"
        >
            {filters.map((item) => (
                <button
                    key={item.value}
                    type="button"
                    className={`btn ${
                        filter === item.value ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    aria-pressed={filter === item.value}
                    onClick={() => setFilter(item.value)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
