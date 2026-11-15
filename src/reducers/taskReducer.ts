import type { TaskAction, TaskState } from '../types/task';

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'add':
            if (state.tasks.some((task) => task.id === action.task.id)) {
                return state;
            }
            return { ...state, tasks: [...state.tasks, action.task] };

        case 'toggle':
            if (state.pendingDelete?.taskId === action.id) {
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
            if (state.pendingDelete?.taskId === action.id) {
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
                state.pendingDelete ||
                !state.tasks.some((task) => task.id === action.pending.taskId)
            ) {
                return state;
            }
            return { ...state, pendingDelete: action.pending };

        case 'confirmDelete':
            if (state.pendingDelete?.token !== action.token) {
                return state;
            }
            return {
                ...state,
                tasks: state.tasks.filter(
                    (task) => task.id !== state.pendingDelete?.taskId,
                ),
                pendingDelete: null,
            };

        case 'undoDelete':
            return state.pendingDelete?.token === action.token
                ? { ...state, pendingDelete: null }
                : state;

        case 'reset':
            return {
                tasks: action.tasks.map((task) => ({ ...task })),
                pendingDelete: null,
                loadError: null,
            };
    }
}
