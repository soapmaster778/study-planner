import assert from 'node:assert/strict';
import test from 'node:test';
import { taskReducer } from '../src/reducers/taskReducer.ts';
import { isTaskList } from '../src/types/task.ts';

const task = {
    id: 'first', title: 'React', description: 'Study',
    priority: 'high', category: 'Web', completed: false,
};

function initialState() {
    return { tasks: [{ ...task }], pendingDeletes: [], loadError: null };
}

const pending = { taskId: task.id, token: 'delete-1', expiresAt: 5000 };

test('add, toggle and update preserve previous objects and task identity', () => {
    const state = initialState();
    Object.freeze(state.tasks[0]);
    Object.freeze(state.tasks);
    Object.freeze(state);
    const added = taskReducer(state, {
        type: 'add', task: { ...task, id: 'second' },
    });
    assert.equal(state.tasks.length, 1);
    assert.equal(added.tasks.length, 2);
    assert.equal(taskReducer(added, { type: 'add', task }), added);
    const toggled = taskReducer(added, { type: 'toggle', id: task.id });
    assert.equal(toggled.tasks[0].completed, true);
    assert.equal(state.tasks[0].completed, false);
    const updated = taskReducer(toggled, {
        type: 'update', id: task.id,
        changes: { title: 'Edited', description: 'New', category: 'TS', priority: 'low' },
    });
    assert.equal(updated.tasks[0].title, 'Edited');
    assert.equal(updated.tasks[0].id, task.id);
    assert.equal(updated.tasks[0].completed, true);
});

test('requestDelete keeps tasks; pending task cannot be changed', () => {
    const state = initialState();
    const waiting = taskReducer(state, { type: 'requestDelete', pending });
    assert.equal(waiting.tasks, state.tasks);
    assert.deepEqual(waiting.pendingDeletes, [pending]);
    assert.equal(taskReducer(waiting, { type: 'toggle', id: task.id }), waiting);
    assert.equal(taskReducer(waiting, {
        type: 'update', id: task.id,
        changes: { title: 'No', description: '', category: '', priority: 'low' },
    }), waiting);
    assert.equal(taskReducer(waiting, {
        type: 'requestDelete', pending: { ...pending, token: 'second' },
    }), waiting);
});

test('undo keeps task and makes the old confirmation harmless', () => {
    const waiting = taskReducer(initialState(), { type: 'requestDelete', pending });
    const restored = taskReducer(waiting, { type: 'undoDelete', token: pending.token });
    assert.deepEqual(restored.pendingDeletes, []);
    assert.equal(restored.tasks.length, 1);
    assert.equal(taskReducer(restored, {
        type: 'confirmDelete', token: pending.token,
    }), restored);
});

test('only a matching confirmation deletes the task', () => {
    const waiting = taskReducer(initialState(), { type: 'requestDelete', pending });
    assert.equal(taskReducer(waiting, { type: 'confirmDelete', token: 'old' }), waiting);
    assert.equal(taskReducer(waiting, { type: 'undoDelete', token: 'old' }), waiting);
    const deleted = taskReducer(waiting, { type: 'confirmDelete', token: pending.token });
    assert.deepEqual(deleted.tasks, []);
    assert.deepEqual(deleted.pendingDeletes, []);
});

test('reset cancels deletion and copies initial tasks', () => {
    const waiting = taskReducer(initialState(), { type: 'requestDelete', pending });
    const originals = [{ ...task }];
    const reset = taskReducer(waiting, { type: 'reset', tasks: originals });
    assert.deepEqual(reset.pendingDeletes, []);
    assert.notEqual(reset.tasks, originals);
    assert.notEqual(reset.tasks[0], originals[0]);
    assert.equal(taskReducer(reset, { type: 'confirmDelete', token: pending.token }), reset);
});

test('nonexistent deletion is ignored and reducer is deterministic', () => {
    const state = initialState();
    assert.equal(taskReducer(state, {
        type: 'requestDelete', pending: { ...pending, taskId: 'missing' },
    }), state);
    assert.deepEqual(
        taskReducer(state, { type: 'requestDelete', pending }),
        taskReducer(state, { type: 'requestDelete', pending }),
    );
});

test('concurrent deletions retain independent deadlines and undo only their own task', () => {
    const state = {
        ...initialState(),
        tasks: [{ ...task }, { ...task, id: 'second' }],
    };
    const second = { taskId: 'second', token: 'delete-2', expiresAt: 7000 };
    const firstWaiting = taskReducer(state, { type: 'requestDelete', pending });
    const bothWaiting = taskReducer(firstWaiting, {
        type: 'requestDelete', pending: second,
    });
    assert.deepEqual(bothWaiting.pendingDeletes, [pending, second]);
    assert.equal(bothWaiting.pendingDeletes[0], firstWaiting.pendingDeletes[0]);
    assert.equal(bothWaiting.tasks, state.tasks);

    const undone = taskReducer(bothWaiting, { type: 'undoDelete', token: pending.token });
    assert.deepEqual(undone.pendingDeletes, [second]);
    assert.equal(undone.tasks.length, 2);
    assert.equal(taskReducer(undone, {
        type: 'confirmDelete', token: pending.token,
    }), undone);

    const confirmed = taskReducer(undone, { type: 'confirmDelete', token: second.token });
    assert.deepEqual(confirmed.tasks, [task]);
    assert.deepEqual(confirmed.pendingDeletes, []);
});

test('concurrent confirmations work in either order without removing another pending operation', () => {
    const second = { taskId: 'second', token: 'delete-2', expiresAt: 7000 };
    for (const tokens of [[pending.token, second.token], [second.token, pending.token]]) {
        let state = {
            ...initialState(),
            tasks: [{ ...task }, { ...task, id: 'second' }],
        };
        state = taskReducer(state, { type: 'requestDelete', pending });
        state = taskReducer(state, { type: 'requestDelete', pending: second });
        const firstConfirmed = taskReducer(state, { type: 'confirmDelete', token: tokens[0] });
        assert.equal(firstConfirmed.tasks.length, 1);
        assert.equal(firstConfirmed.pendingDeletes.length, 1);
        assert.equal(firstConfirmed.pendingDeletes[0].token, tokens[1]);
        const complete = taskReducer(firstConfirmed, { type: 'confirmDelete', token: tokens[1] });
        assert.deepEqual(complete.tasks, []);
        assert.deepEqual(complete.pendingDeletes, []);
    }
});

test('duplicate tokens are rejected and reset invalidates all pending confirmations', () => {
    let state = {
        ...initialState(), tasks: [{ ...task }, { ...task, id: 'second' }],
    };
    state = taskReducer(state, { type: 'requestDelete', pending });
    assert.equal(taskReducer(state, {
        type: 'requestDelete', pending: { ...pending, taskId: 'second' },
    }), state);
    state = taskReducer(state, {
        type: 'requestDelete',
        pending: { taskId: 'second', token: 'delete-2', expiresAt: 7000 },
    });
    const reset = taskReducer(state, { type: 'reset', tasks: [task] });
    assert.deepEqual(reset.pendingDeletes, []);
    for (const token of [pending.token, 'delete-2']) {
        assert.equal(taskReducer(reset, { type: 'confirmDelete', token }), reset);
    }
});

test('stored tasks require valid fields, priorities and unique ids; empty list is valid', () => {
    assert.equal(isTaskList([]), true);
    assert.equal(isTaskList([task]), true);
    for (const value of [null, {}, [null], [{ ...task, title: ' ' }],
        [{ ...task, priority: 'urgent' }], [{ ...task, completed: 'yes' }],
        [task, task], [{ ...task, id: 1 }]]) {
        assert.equal(isTaskList(value), false);
    }
});
