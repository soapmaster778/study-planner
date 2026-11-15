import { useEffect, useReducer, useState } from 'react';
import type { ReactNode } from 'react';
import { TaskContext } from './TaskContext';
import { taskReducer } from '../reducers/taskReducer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialTasks } from '../data/initialTasks';
import { isTaskFilter, isTaskList, isTaskPriority } from '../types/task';
import type { NewTask, Task, TaskFilter, TaskState } from '../types/task';
import type { ToastMessage } from '../types/toast';
import { readStoredValue } from '../utils/storage';

const TASKS_KEY = 'study-planner.tasks';
const FILTER_KEY = 'study-planner.filter';
const DELETE_DELAY = 5000;
const TOAST_DELAY = 3500;

function initializeTasks(): TaskState {
    const stored = readStoredValue(TASKS_KEY, initialTasks, isTaskList);

    return {
        tasks: stored.value,
        pendingDelete: null,
        loadError: stored.error,
    };
}

function makeToast(message: string, kind: ToastMessage['kind']): ToastMessage {
    return { id: crypto.randomUUID(), message, kind };
}

function normalizeTask(data: NewTask): NewTask {
    return {
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category.trim(),
        priority: data.priority,
    };
}

export default function TaskProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(taskReducer, undefined, initializeTasks);
    const [filter, setFilter, filterError] = useLocalStorage<TaskFilter>(
        FILTER_KEY, 'all', isTaskFilter,
    );
    const [editingTaskId, setEditingTaskId] = useState<Task['id'] | null>(null);
    const [toast, setToast] = useState<ToastMessage | null>(() =>
        state.loadError ? makeToast(state.loadError, 'error') : null,
    );
    const { tasks, pendingDelete } = state;
    const activeCount = tasks.filter((task) => !task.completed).length;

    useEffect(() => {
        let cancelled = false;

        try {
            window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
        } catch {
            queueMicrotask(() => {
                if (!cancelled) {
                    setToast(makeToast(
                        'Не вдалося зберегти завдання. Зміни доступні лише в цій сесії.',
                        'error',
                    ));
                }
            });
        }

        return () => {
            cancelled = true;
        };
    }, [tasks]);

    useEffect(() => {
        const previousTitle = document.title;
        document.title = `Study Planner — ${activeCount} невиконаних`;

        return () => {
            document.title = previousTitle;
        };
    }, [activeCount]);

    useEffect(() => {
        if (!toast) {
            return;
        }

        const timer = window.setTimeout(() => {
            setToast((current) => current?.id === toast.id ? null : current);
        }, TOAST_DELAY);

        return () => window.clearTimeout(timer);
    }, [toast]);

    useEffect(() => {
        if (!pendingDelete) {
            return;
        }

        const timer = window.setTimeout(() => {
            dispatch({ type: 'confirmDelete', token: pendingDelete.token });
            setToast(makeToast('Завдання остаточно видалено.', 'success'));
        }, Math.max(0, pendingDelete.expiresAt - Date.now()));

        return () => window.clearTimeout(timer);
    }, [pendingDelete]);

    function reportError(message: string) {
        setToast(makeToast(message, 'error'));
    }

    function canChangeTask(id: Task['id']): boolean {
        if (!tasks.some((task) => task.id === id)) {
            reportError('Завдання не знайдено.');
            return false;
        }

        if (pendingDelete?.taskId === id) {
            reportError('Спочатку скасуйте заплановане видалення цього завдання.');
            return false;
        }

        return true;
    }

    function addTask(data: NewTask): boolean {
        const normalized = normalizeTask(data);

        if (!normalized.title || !isTaskPriority(normalized.priority)) {
            reportError('Перевірте назву та пріоритет завдання.');
            return false;
        }

        dispatch({
            type: 'add',
            task: { ...normalized, id: crypto.randomUUID(), completed: false },
        });
        setFilter('all');
        setToast(makeToast('Завдання успішно створено.', 'success'));
        return true;
    }

    function updateTask(id: Task['id'], data: NewTask): boolean {
        if (!canChangeTask(id)) {
            return false;
        }

        const normalized = normalizeTask(data);

        if (!normalized.title || !isTaskPriority(normalized.priority)) {
            reportError('Перевірте назву та пріоритет завдання.');
            return false;
        }

        dispatch({ type: 'update', id, changes: normalized });
        setEditingTaskId(null);
        setToast(makeToast('Зміни завдання збережено.', 'success'));
        return true;
    }

    function toggleTask(id: Task['id']) {
        if (canChangeTask(id)) {
            dispatch({ type: 'toggle', id });
        }
    }

    function requestDelete(id: Task['id']) {
        if (pendingDelete) {
            reportError('Завершіть або скасуйте поточне видалення.');
            return;
        }

        if (!canChangeTask(id)) {
            return;
        }

        dispatch({
            type: 'requestDelete',
            pending: {
                taskId: id,
                token: crypto.randomUUID(),
                expiresAt: Date.now() + DELETE_DELAY,
            },
        });
        setToast(null);

        if (editingTaskId === id) {
            setEditingTaskId(null);
        }
    }

    function undoDelete() {
        if (!pendingDelete) {
            reportError('Немає видалення, яке можна скасувати.');
            return;
        }

        dispatch({ type: 'undoDelete', token: pendingDelete.token });
        setToast(makeToast('Видалення скасовано.', 'info'));
    }

    function startEditing(id: Task['id']) {
        if (canChangeTask(id)) {
            setEditingTaskId(id);
        }
    }

    function resetTasks() {
        dispatch({ type: 'reset', tasks: initialTasks });
        setEditingTaskId(null);
        setFilter('all');
        setToast(makeToast('Початкові завдання відновлено.', 'info'));
    }

    return (
        <TaskContext.Provider value={{
            tasks,
            filter,
            setFilter,
            pendingDelete,
            editingTaskId,
            filterError,
            toast,
            addTask,
            updateTask,
            toggleTask,
            requestDelete,
            undoDelete,
            startEditing,
            cancelEditing: () => setEditingTaskId(null),
            resetTasks,
            dismissToast: () => setToast(null),
            reportError,
        }}>
            {children}
        </TaskContext.Provider>
    );
}
