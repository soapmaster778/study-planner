import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { NewTask, PendingDelete, Task, TaskFilter } from '../types/task';
import type { ToastMessage } from '../types/toast';

export interface TaskContextValue {
    tasks: Task[];
    filter: TaskFilter;
    setFilter: Dispatch<SetStateAction<TaskFilter>>;
    pendingDeletes: PendingDelete[];
    editingTaskId: Task['id'] | null;
    filterError: string | null;
    toast: ToastMessage | null;
    addTask: (data: NewTask) => boolean;
    updateTask: (id: Task['id'], data: NewTask) => boolean;
    toggleTask: (id: Task['id']) => void;
    requestDelete: (id: Task['id']) => void;
    undoDelete: (token: string) => void;
    startEditing: (id: Task['id']) => void;
    cancelEditing: () => void;
    resetTasks: () => void;
    dismissToast: () => void;
    reportError: (message: string) => void;
}

export const TaskContext = createContext<TaskContextValue | null>(null);
