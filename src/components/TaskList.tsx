import type { Task } from '../types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
    tasks: Task[];
    hasTasks: boolean;
    onToggleTask: (id: Task['id']) => void;
    onDeleteTask: (id: Task['id']) => void;
}

export default function TaskList({
                                     tasks,
                                     hasTasks,
                                     onToggleTask,
                                     onDeleteTask,
                                 }: TaskListProps) {
    if (!hasTasks) {
        return (
            <div className="alert alert-info" role="status">
                <p className="mb-1">Завдань поки немає.</p>
                <p className="mb-0">Додайте перше навчальне завдання.</p>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <p className="alert alert-info" role="status">
                За цим фільтром завдань немає.
            </p>
        );
    }

    return (
        <ul className="list-unstyled d-grid gap-3">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggleTask={onToggleTask}
                    onDeleteTask={onDeleteTask}
                />
            ))}
        </ul>
    );
}