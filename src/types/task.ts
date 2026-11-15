export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskFilter = 'all' | 'completed' | 'active';

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: TaskPriority;
    category: string;
}

export type NewTask = Omit<Task, 'id' | 'completed'>;

export interface PendingDelete {
    taskId: Task['id'];
    token: string;
    expiresAt: number;
}

export interface TaskState {
    tasks: Task[];
    pendingDelete: PendingDelete | null;
    loadError: string | null;
}

export type TaskAction =
    | { type: 'add'; task: Task }
    | { type: 'toggle'; id: Task['id'] }
    | { type: 'update'; id: Task['id']; changes: NewTask }
    | { type: 'requestDelete'; pending: PendingDelete }
    | { type: 'confirmDelete'; token: string }
    | { type: 'undoDelete'; token: string }
    | { type: 'reset'; tasks: Task[] };

export function isTaskPriority(value: unknown): value is TaskPriority {
    return value === 'low' || value === 'medium' || value === 'high';
}

export function isTaskFilter(value: unknown): value is TaskFilter {
    return value === 'all' || value === 'completed' || value === 'active';
}

export function isTaskList(value: unknown): value is Task[] {
    if (!Array.isArray(value)) {
        return false;
    }

    const ids = new Set<string>();

    return value.every((task: unknown) => {
        if (typeof task !== 'object' || task === null) {
            return false;
        }

        const item = task as Record<string, unknown>;

        if (
            typeof item.id !== 'string' || !item.id.trim() ||
            typeof item.title !== 'string' || !item.title.trim() ||
            typeof item.description !== 'string' ||
            typeof item.category !== 'string' ||
            typeof item.completed !== 'boolean' ||
            !isTaskPriority(item.priority) || ids.has(item.id)
        ) {
            return false;
        }

        ids.add(item.id);
        return true;
    });
}
