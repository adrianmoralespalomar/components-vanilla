import { ToastAction } from './toast-action.interface';
import { ToastType } from './toast-type.type';

/** Opciones de cada toast. Las que no se indiquen salen de la configuración global. */
export interface ToastOptions {
  /** Botón de acción (por ejemplo "Deshacer"). Al pulsarlo se emite `ToastRef.onAction()` y se cierra. */
  action?: ToastAction;
  /** Clase o clases (separadas por espacios) para el toast. Sirve para darle un estilo propio con variables --aesy-toast-* en tus estilos globales. */
  cssClass?: string;
  /** Muestra el aspa de cerrar. Por defecto, true. */
  dismissible?: boolean;
  /** Milisegundos hasta cerrarse solo. 0 = no se cierra solo. */
  duration?: number;
  message: string;
  showProgress?: boolean;
  title?: string;
  /** Por defecto, 'neutral'. */
  type?: ToastType;
}
