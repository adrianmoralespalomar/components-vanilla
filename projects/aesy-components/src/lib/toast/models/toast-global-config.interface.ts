import { ToastPosition } from './toast-position.type';

export interface ToastGlobalConfig {
  closeButtonAriaLabel: string;
  /** Nombre de la región de notificaciones para los lectores de pantalla. */
  containerAriaLabel: string;
  /** Milisegundos por defecto. 0 = no se cierran solos. */
  duration: number;
  /** Máximo de toasts a la vez: al superarlo se cierra el más antiguo. */
  maxVisible: number;
  position: ToastPosition;
  showProgress: boolean;
}
