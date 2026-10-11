import { AESY_ICON_BELL } from '../../icon/models/icon-paths/aesy-icon-bell.const';
import { AESY_ICON_CHECK_CIRCLE } from '../../icon/models/icon-paths/aesy-icon-check-circle.const';
import { AESY_ICON_CLOSE } from '../../icon/models/icon-paths/aesy-icon-close.const';
import { AESY_ICON_INFO_CIRCLE } from '../../icon/models/icon-paths/aesy-icon-info-circle.const';
import { AESY_ICON_WARNING } from '../../icon/models/icon-paths/aesy-icon-warning.const';
import { AESY_ICON_X_CIRCLE } from '../../icon/models/icon-paths/aesy-icon-x-circle.const';
import { ToastType } from './toast-type.type';

/** Icono de cada tipo y aspa de cerrar, en un viewBox de 20×20. */
export const TOAST_ICON_PATHS: Record<ToastType | 'close', string> = {
  close: AESY_ICON_CLOSE,
  error: AESY_ICON_X_CIRCLE,
  info: AESY_ICON_INFO_CIRCLE,
  neutral: AESY_ICON_BELL,
  success: AESY_ICON_CHECK_CIRCLE,
  warning: AESY_ICON_WARNING
};
