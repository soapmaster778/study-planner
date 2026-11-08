import type { Task, TaskPriority } from '../types/task';

interface TaskItemProps {
    task: Task;
    onToggleTask: (id: Task['id']) => void;
    onDeleteTask: (id: Task['id']) => void;
}

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

export default function TaskItem({task, onToggleTask, onDeleteTask,}: TaskItemProps) {
    return (
        <li
            className={`card shadow-sm ${
                task.completed ? 'border-success bg-success-subtle' : ''
            }`}
        >
            <div className="card-body">
                <h3
                    className={`h5 text-break ${
                        task.completed ? 'text-decoration-line-through' : ''
                    }`}
                >
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

                    <span
                        className={`badge ${
                            task.completed ? 'text-bg-success' : 'text-bg-secondary'
                        }`}
                    >
            {task.completed ? 'Виконано' : 'Не виконано'}
          </span>
                </div>

                <div className="d-flex flex-wrap gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        onClick={() => onToggleTask(task.id)}
                        aria-label={`${
                            task.completed ? 'Повернути до невиконаних' : 'Позначити виконаним'
                        }: ${task.title}`}
                    >
                        {task.completed ? 'Повернути до невиконаних' : 'Позначити виконаним'}
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onDeleteTask(task.id)}
                        aria-label={`Видалити завдання: ${task.title}`}
                    >
                        Видалити
                    </button>
                </div>
            </div>
        </li>
    );
}