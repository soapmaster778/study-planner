import { useState } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskStats from './components/TaskStats';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import { initialTasks } from './data/initialTasks';
import type { NewTask, Task, TaskFilter } from './types/task';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<TaskFilter>('all');

  function addTask(taskData: NewTask) {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);
  }

  function toggleTask(id: Task['id']) {
    setTasks((previousTasks) =>
        previousTasks.map((task) =>
            task.id === id
                ? { ...task, completed: !task.completed }
                : task,
        ),
    );
  }

  function deleteTask(id: Task['id']) {
    setTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== id),
    );
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') {
      return task.completed;
    }

    if (filter === 'active') {
      return !task.completed;
    }

    return true;
  });

  return (
      <main className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9 col-xl-8">
            <Header />

            <TaskForm onAddTask={addTask} />

            <TaskStats tasks={tasks} />

            <section aria-labelledby="tasks-heading">
              <h2 id="tasks-heading" className="h4 mb-3">
                Навчальні завдання
              </h2>

              <TaskFilters
                  currentFilter={filter}
                  onFilterChange={setFilter}
              />

              <TaskList
                  tasks={filteredTasks}
                  hasTasks={tasks.length > 0}
                  onToggleTask={toggleTask}
                  onDeleteTask={deleteTask}
              />
            </section>
          </div>
        </div>
      </main>
  );
}