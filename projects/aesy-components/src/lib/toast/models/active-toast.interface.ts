import { ToastRef } from '../toast-ref';
import { ToastAction } from './toast-action.interface';
import { ToastType } from './toast-type.type';

/** Toast en pantalla, con las opciones ya resueltas. Uso interno del servicio y del contenedor. */
export interface ActiveToast {
  action: ToastAction | null;
  cssClass: string;
  duration: number;
  id: number;
  isDismissible: boolean;
  isLeaving: boolean;
  message: string;
  ref: ToastRef;
  showProgress: boolean;
  title: string;
  type: ToastType;
}
