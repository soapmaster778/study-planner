import type { Task, TaskPriority } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

const priorityLabels: Record<TaskPriority, string> = {
    low: 'Низький',
    medium: 'Середній',
    high: 'Високий',
};

const priorityClasses: Record<TaskPriority, string> = {
    low: 'text-bg-secondary',
    medium: 'text-bg-warning',
    high: 'text-bg-danger',
};

export default function TaskItem({ task }: { task: Task }) {
    const { pendingDelete, toggleTask, requestDelete, startEditing } = useTaskContext();
    const isPending = pendingDelete?.taskId === task.id;

    return (
        <li className={`card shadow-sm ${
            isPending
                ? 'border-warning bg-warning-subtle'
                : task.completed ? 'border-success bg-success-subtle' : ''
        }`}>
            <div className="card-body">
                <h3 className={`h5 text-break ${
                    task.completed ? 'text-decoration-line-through' : ''
                }`}>
                    {task.title}
                </h3>
                <p className="text-body-secondary text-break">
                    {task.description || 'Опис не вказано.'}
                </p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge text-bg-light border text-wrap text-break">
                        Категорія: {task.category || 'Без категорії'}
                    </span>
                    <span className={`badge ${priorityClasses[task.priority]}`}>
                        Пріоритет: {priorityLabels[task.priority]}
                    </span>
                    <span className={`badge ${
                        task.completed ? 'text-bg-success' : 'text-bg-secondary'
                    }`}>
                        {task.completed ? 'Виконано' : 'Не виконано'}
                    </span>
                    {isPending && (
                        <span className="badge text-bg-warning">Буде видалено</span>
                    )}
                </div>
                <div className="d-flex flex-wrap gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        onClick={() => toggleTask(task.id)}
                        disabled={isPending}
                        aria-label={`${task.completed
                            ? 'Повернути до невиконаних'
                            : 'Позначити виконаним'}: ${task.title}`}
                    >
                        {task.completed ? 'Повернути до невиконаних' : 'Позначити виконаним'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => startEditing(task.id)}
                        disabled={isPending}
                        aria-label={`Редагувати завдання: ${task.title}`}
                    >
                        Редагувати
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => requestDelete(task.id)}
                        disabled={pendingDelete !== null}
                        aria-label={`Видалити завдання: ${task.title}`}
                    >
                        Видалити
                    </button>
                </div>
            </div>
        </li>
    );
}
