import { InjectionToken } from '@angular/core';

/** Datos que recibe el componente abierto con `DialogService.open(..., { data })`. */
export const AESY_DIALOG_DATA = new InjectionToken<unknown>('AESY_DIALOG_DATA');
