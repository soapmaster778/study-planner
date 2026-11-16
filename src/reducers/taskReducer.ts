import type { TaskAction, TaskState } from '../types/task';

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'add':
            if (state.tasks.some((task) => task.id === action.task.id)) {
                return state;
            }
            return { ...state, tasks: [...state.tasks, action.task] };

        case 'toggle':
            if (state.pendingDeletes.some((pending) => pending.taskId === action.id)) {
                return state;
            }
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.id
                        ? { ...task, completed: !task.completed }
                        : task,
                ),
            };

        case 'update':
            if (state.pendingDeletes.some((pending) => pending.taskId === action.id)) {
                return state;
            }
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.id
                        ? { ...task, ...action.changes }
                        : task,
                ),
            };

        case 'requestDelete':
            if (
                state.pendingDeletes.some((pending) =>
                    pending.taskId === action.pending.taskId ||
                    pending.token === action.pending.token,
                ) ||
                !state.tasks.some((task) => task.id === action.pending.taskId)
            ) {
                return state;
            }
            return {
                ...state,
                pendingDeletes: [...state.pendingDeletes, action.pending],
            };

        case 'confirmDelete': {
            const pending = state.pendingDeletes.find((item) => item.token === action.token);
            if (!pending) {
                return state;
            }
            return {
                ...state,
                tasks: state.tasks.filter(
                    (task) => task.id !== pending.taskId,
                ),
                pendingDeletes: state.pendingDeletes.filter((item) => item.token !== action.token),
            };
        }

        case 'undoDelete':
            return state.pendingDeletes.some((pending) => pending.token === action.token)
                ? {
                    ...state,
                    pendingDeletes: state.pendingDeletes.filter((pending) => pending.token !== action.token),
                }
                : state;

        case 'reset':
            return {
                tasks: action.tasks.map((task) => ({ ...task })),
                pendingDeletes: [],
                loadError: null,
            };
    }
}
