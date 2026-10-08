import { InjectionToken } from '@angular/core';
import type { ToastService } from '../toast.service';

/** Lo provee ToastService al crear su contenedor, para que este lo use sin importarlo (evita la dependencia circular). */
export const AESY_TOAST_SERVICE = new InjectionToken<ToastService>('AESY_TOAST_SERVICE');
