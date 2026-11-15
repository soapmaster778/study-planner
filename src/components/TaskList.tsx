import TaskItem from './TaskItem';
import { useTaskContext } from '../hooks/useTaskContext';

export default function TaskList() {
    const { tasks, filter } = useTaskContext();
    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') {
            return task.completed;
        }
        if (filter === 'active') {
            return !task.completed;
        }
        return true;
    });

    if (tasks.length === 0) {
        return (
            <div className="alert alert-info" role="status">
                <p className="mb-1">Завдань поки немає.</p>
                <p className="mb-0">Додайте перше навчальне завдання.</p>
            </div>
        );
    }

    if (filteredTasks.length === 0) {
        return (
            <p className="alert alert-info" role="status">
                За цим фільтром завдань немає.
            </p>
        );
    }

    return (
        <ul className="list-unstyled d-grid gap-3">
            {filteredTasks.map((task) => <TaskItem key={task.id} task={task} />)}
        </ul>
    );
}
