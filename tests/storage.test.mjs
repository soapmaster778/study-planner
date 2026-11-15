import assert from 'node:assert/strict';
import test from 'node:test';
import { readStoredValue } from '../src/utils/storage.ts';
import { isTaskFilter } from '../src/types/task.ts';

test('storage loading tolerates missing, malformed, wrong-shaped and unavailable data', () => {
    const previousWindow = globalThis.window;
    try {
        for (const stored of [null, '{bad', '42', '"unknown"']) {
            globalThis.window = { localStorage: { getItem: () => stored } };
            const result = readStoredValue('filter', 'all', isTaskFilter);
            assert.equal(result.value, 'all');
            assert.equal(result.error === null, stored === null);
        }
        globalThis.window = { localStorage: { getItem: () => '"completed"' } };
        assert.deepEqual(readStoredValue('filter', 'all', isTaskFilter), {
            value: 'completed', error: null,
        });
        globalThis.window = { get localStorage() { throw new Error('Denied'); } };
        assert.equal(readStoredValue('filter', 'all', isTaskFilter).value, 'all');
    } finally {
        if (previousWindow === undefined) {
            delete globalThis.window;
        } else {
            globalThis.window = previousWindow;
        }
    }
});
