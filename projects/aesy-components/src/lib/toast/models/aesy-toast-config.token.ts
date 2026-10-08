import { InjectionToken } from '@angular/core';
import { ToastGlobalConfig } from './toast-global-config.interface';

/** Configuración global inicial de los toasts. Se provee con `provideAesyToastConfig()`. */
export const AESY_TOAST_CONFIG = new InjectionToken<Partial<ToastGlobalConfig>>('AESY_TOAST_CONFIG');
