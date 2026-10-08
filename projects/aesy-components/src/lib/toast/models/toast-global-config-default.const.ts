import { ToastGlobalConfig } from './toast-global-config.interface';

export const TOAST_GLOBAL_CONFIG_DEFAULT: ToastGlobalConfig = {
  closeButtonAriaLabel: 'Cerrar notificación',
  containerAriaLabel: 'Notificaciones',
  duration: 5000,
  maxVisible: 4,
  position: 'bottom-right',
  showProgress: true
};
