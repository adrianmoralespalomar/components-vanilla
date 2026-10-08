/** Temporizador de un toast, pausable. Uso interno del servicio. */
export interface ToastTimer {
  remainingMs: number;
  startedAt: number;
  timeoutId: ReturnType<typeof setTimeout> | null;
}
