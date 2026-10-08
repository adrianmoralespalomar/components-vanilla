import { Provider } from '@angular/core';
import { AESY_TOAST_CONFIG } from './models/aesy-toast-config.token';
import { ToastGlobalConfig } from './models/toast-global-config.interface';

/**
 * Configuración global inicial de los toasts:
 *
 * ```ts
 * // app.config.ts
 * providers: [provideAesyToastConfig({ position: 'top-center', duration: 4000 })]
 * ```
 */
export function provideAesyToastConfig(config: Partial<ToastGlobalConfig>): Provider {
  return { provide: AESY_TOAST_CONFIG, useValue: config };
}
