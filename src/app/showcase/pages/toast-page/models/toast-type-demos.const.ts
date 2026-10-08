import { ToastTypeDemo } from './toast-type-demo.interface';

export const TOAST_TYPE_DEMOS: ToastTypeDemo[] = [
  { buttonType: 'primary', message: 'Tienes 3 notificaciones nuevas.', type: 'neutral' },
  { buttonType: 'success', message: 'Cambios guardados correctamente.', type: 'success' },
  { buttonType: 'info', message: 'Hay una nueva versión disponible.', type: 'info' },
  { buttonType: 'warning', message: 'Tu sesión caduca en 5 minutos.', type: 'warning' },
  { buttonType: 'danger', message: 'No se ha podido conectar con el servidor.', type: 'error' }
];
