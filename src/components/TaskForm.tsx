import { useState } from 'react';
import type { FormEvent } from 'react';
import type { NewTask, TaskPriority } from '../types/task';

interface TaskFormProps {
    onAddTask: (task: NewTask) => void;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [error, setError] = useState('');

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            setError('Введіть назву завдання.');
            return;
        }

        onAddTask({
            title: trimmedTitle,
            description: description.trim(),
            category: category.trim(),
            priority,
        });

        setTitle('');
        setDescription('');
        setCategory('');
        setPriority('medium');
        setError('');
    }

    return (
        <section className="card shadow-sm mb-4" aria-labelledby="form-heading">
            <div className="card-body">
                <h2 id="form-heading" className="h4 mb-3">Нове завдання</h2>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="task-title" className="form-label">Назва *</label>
                        <input
                            id="task-title"
                            className={`form-control${error ? ' is-invalid' : ''}`}
                            value={title}
                            onChange={(event) => {
                                setTitle(event.target.value);
                                setError('');
                            }}
                            required aria-invalid={Boolean(error)} aria-describedby={error ? 'task-title-error' : undefined}
                        />

                        {error && (<div id="task-title-error" className="invalid-feedback" role="alert">{error}</div>)}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="task-description" className="form-label">
                            Опис
                        </label>
                        <textarea
                            id="task-description"
                            className="form-control"
                            rows={3}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label htmlFor="task-category" className="form-label">Категорія</label>
                            <input id="task-category" className="form-control"
                                value={category} onChange={(event) => setCategory(event.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="task-priority" className="form-label">Пріоритет</label>
                            <select id="task-priority" className="form-select"
                                value={priority} onChange={(event) =>
                                    setPriority(event.target.value as TaskPriority)
                                }
                            >
                                <option value="low">Низький</option>
                                <option value="medium">Середній</option>
                                <option value="high">Високий</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" >Додати</button>
                </form>
            </div>
        </section>
    );
}