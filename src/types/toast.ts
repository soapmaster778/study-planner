export interface ToastMessage {
    id: string;
    message: string;
    kind: 'success' | 'error' | 'info';
}
