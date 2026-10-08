import { Injector } from '@angular/core';
import { DialogRole } from './dialog-role.type';
import { DialogSize } from './dialog-size.type';

/** Opciones de `DialogService.open`. Son los mismos inputs que `aesy-dialog` más `data` e `injector`. */
export interface DialogConfig<TData = unknown> {
  /** Nombre accesible cuando no hay `title`. */
  ariaLabel?: string;
  closeButtonAriaLabel?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  /** Se inyecta en el componente con `inject(AESY_DIALOG_DATA)`. */
  data?: TData;
  /** Injector padre del componente. Por defecto, el del servicio (raíz). */
  injector?: Injector;
  role?: DialogRole;
  showCloseButton?: boolean;
  size?: DialogSize;
  title?: string;
}
