import { useEffect, useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import type { PendingDelete } from '../types/task';

function DeleteCountdown({ pending }: { pending: PendingDelete }) {
    const { undoDelete } = useTaskContext();
    const [remaining, setRemaining] = useState(() =>
        Math.max(0, pending.expiresAt - Date.now()),
    );
    const progress = Math.min(100, (remaining / 5000) * 100);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setRemaining(Math.max(0, pending.expiresAt - Date.now()));
        }, 50);

        return () => window.clearInterval(timer);
    }, [pending.expiresAt]);

    return (
        <div className="toast show border-warning shadow" role="status" aria-live="polite">
            <div className="toast-body">
                <p className="fw-semibold mb-2">Завдання буде видалено</p>
                <div className="d-flex justify-content-between align-items-center gap-3">
                    <span aria-hidden="true">Залишилось: {Math.ceil(remaining / 1000)} с</span>
                    <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={undoDelete}
                    >
                        Скасувати
                    </button>
                </div>
                <div
                    className="progress mt-3"
                    role="progressbar"
                    aria-label="Час до остаточного видалення"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress)}
                >
                    <div className="progress-bar bg-warning" style={{ width: `${progress}%` }} />
                </div>
            </div>
        </div>
    );
}

export default function Toast() {
    const { toast, pendingDelete, dismissToast } = useTaskContext();

    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
            {pendingDelete && (
                <DeleteCountdown key={pendingDelete.token} pending={pendingDelete} />
            )}
            {toast && (
                <div
                    key={toast.id}
                    className={`toast show shadow ${
                        toast.kind === 'error' ? 'border-danger' : 'border-success'
                    }`}
                    role={toast.kind === 'error' ? 'alert' : 'status'}
                    aria-live={toast.kind === 'error' ? 'assertive' : 'polite'}
                    aria-atomic="true"
                >
                    <div className="d-flex align-items-center">
                        <div className="toast-body text-break">{toast.message}</div>
                        <button
                            type="button"
                            className="btn-close me-3 flex-shrink-0"
                            aria-label="Закрити повідомлення"
                            onClick={dismissToast}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
