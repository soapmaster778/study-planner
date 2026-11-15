export interface StorageResult<T> {
    value: T;
    error: string | null;
}

export function readStoredValue<T>(
    key: string,
    fallback: T,
    validate: (value: unknown) => value is T,
): StorageResult<T> {
    try {
        const stored = window.localStorage.getItem(key);

        if (stored === null) {
            return { value: fallback, error: null };
        }

        const value: unknown = JSON.parse(stored);

        if (!validate(value)) {
            throw new Error('Invalid stored data');
        }

        return { value, error: null };
    } catch {
        return {
            value: fallback,
            error: 'Не вдалося прочитати збережені дані. Використано початкові значення.',
        };
    }
}
