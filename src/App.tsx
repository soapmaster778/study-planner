import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskStats from './components/TaskStats';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import Toast from './components/Toast';
import { useTaskContext } from './hooks/useTaskContext';

export default function App() {
    const { tasks, editingTaskId, resetTasks, filterError } = useTaskContext();
    const editingTask = tasks.find((task) => task.id === editingTaskId);

    return (
        <main className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-9 col-xl-8">
                    <Header />
                    {filterError && (
                        <p className="alert alert-warning" role="alert">{filterError}</p>
                    )}
                    <TaskForm key={editingTask?.id ?? 'new-task'} task={editingTask} />
                    <TaskStats />
                    <section aria-labelledby="tasks-heading">
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                            <h2 id="tasks-heading" className="h4 mb-0">
                                Навчальні завдання
                            </h2>
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={resetTasks}
                            >
                                Скинути дані
                            </button>
                        </div>
                        <TaskFilters />
                        <TaskList />
                    </section>
                </div>
            </div>
            <Toast />
        </main>
    );
}
