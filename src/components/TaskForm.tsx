import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import type { Task, TaskPriority } from '../types/task';
import { isTaskPriority } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

interface TaskFormProps {
    task?: Task;
}

export default function TaskForm({ task }: TaskFormProps) {
    const { addTask, updateTask, cancelEditing, reportError } = useTaskContext();
    const formId = useId();
    const [title, setTitle] = useState(task?.title ?? '');
    const [description, setDescription] = useState(task?.description ?? '');
    const [category, setCategory] = useState(task?.category ?? '');
    const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium');
    const [error, setError] = useState('');
    const headingId = `${formId}-heading`;
    const errorId = `${formId}-error`;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!title.trim()) {
            setError('Введіть назву завдання.');
            reportError('Завдання не збережено: назва не може бути порожньою.');
            return;
        }

        const data = {
            title: title.trim(),
            description: description.trim(),
            category: category.trim(),
            priority,
        };
        const saved = task ? updateTask(task.id, data) : addTask(data);

        if (saved) {
            setTitle('');
            setDescription('');
            setCategory('');
            setPriority('medium');
            setError('');
        }
    }

    return (
        <section className="card shadow-sm mb-4" aria-labelledby={headingId}>
            <div className="card-body">
                <h2 id={headingId} className="h4 mb-3">
                    {task ? 'Редагування завдання' : 'Нове завдання'}
                </h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor={`${formId}-title`} className="form-label">
                            Назва *
                        </label>
                        <input
                            id={`${formId}-title`}
                            className={`form-control${error ? ' is-invalid' : ''}`}
                            value={title}
                            onChange={(event) => {
                                setTitle(event.target.value);
                                setError('');
                            }}
                            required
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? errorId : undefined}
                        />
                        {error && (
                            <div id={errorId} className="invalid-feedback" role="alert">
                                {error}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor={`${formId}-description`} className="form-label">
                            Опис
                        </label>
                        <textarea
                            id={`${formId}-description`}
                            className="form-control"
                            rows={3}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                    </div>
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label htmlFor={`${formId}-category`} className="form-label">
                                Категорія
                            </label>
                            <input
                                id={`${formId}-category`}
                                className="form-control"
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor={`${formId}-priority`} className="form-label">
                                Пріоритет
                            </label>
                            <select
                                id={`${formId}-priority`}
                                className="form-select"
                                value={priority}
                                onChange={(event) => {
                                    if (isTaskPriority(event.target.value)) {
                                        setPriority(event.target.value);
                                    }
                                }}
                            >
                                <option value="low">Низький</option>
                                <option value="medium">Середній</option>
                                <option value="high">Високий</option>
                            </select>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            {task ? 'Зберегти зміни' : 'Додати'}
                        </button>
                        {task && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={cancelEditing}
                            >
                                Скасувати редагування
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
}
