import type { Task } from '../types/task';

interface TaskStatsProps {
    tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const active = total - completed;

    return (
        <section className="mb-4" aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="h4 mb-3">
                Статистика
            </h2>

            <div className="row g-3" aria-live="polite">
                <div className="col-sm-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <p className="text-body-secondary mb-1">Усього завдань</p>
                            <p className="fs-3 fw-bold mb-0">{total}</p>
                        </div>
                    </div>
                </div>

                <div className="col-sm-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <p className="text-body-secondary mb-1">Виконані</p>
                            <p className="fs-3 fw-bold text-success mb-0">{completed}</p>
                        </div>
                    </div>
                </div>

                <div className="col-sm-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <p className="text-body-secondary mb-1">Не виконані</p>
                            <p className="fs-3 fw-bold mb-0">{active}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}