/**
 * - `timeout`: se acabó su duración.
 * - `close`: el usuario pulsó el aspa.
 * - `action`: el usuario pulsó el botón de acción.
 * - `manual`: se cerró por código (`ToastRef.dismiss()`, `ToastService.dismissAll()`).
 * - `limit`: se superó `maxVisible` y se cerró el más antiguo.
 */
export type ToastDismissReason = 'timeout' | 'close' | 'action' | 'manual' | 'limit';
