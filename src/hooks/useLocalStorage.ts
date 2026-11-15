import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { readStoredValue } from '../utils/storage';

export function useLocalStorage<T>(
    key: string,
    fallback: T,
    validate: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>, string | null] {
    const [initial] = useState(() => readStoredValue(key, fallback, validate));
    const [value, setValue] = useState<T>(initial.value);
    const [error, setError] = useState<string | null>(initial.error);

    useEffect(() => {
        let cancelled = false;

        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            queueMicrotask(() => {
                if (!cancelled) {
                    setError('Не вдалося зберегти налаштування. Вони діятимуть лише в цій сесії.');
                }
            });
        }

        return () => {
            cancelled = true;
        };
    }, [key, value]);

    return [value, setValue, error];
}
