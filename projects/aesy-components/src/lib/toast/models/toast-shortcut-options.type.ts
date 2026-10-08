import { ToastOptions } from './toast-options.interface';

/** Opciones de los atajos `success()`, `error()`…: todas menos el mensaje y el tipo. */
export type ToastShortcutOptions = Omit<ToastOptions, 'message' | 'type'>;
