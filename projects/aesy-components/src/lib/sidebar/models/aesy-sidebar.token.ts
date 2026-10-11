import { InjectionToken } from '@angular/core';
import type { SidebarComponent } from '../sidebar.component';

/** Lo provee `aesy-sidebar` para que grupos e ítems lean su estado sin importar el componente (evita la dependencia circular). */
export const AESY_SIDEBAR = new InjectionToken<SidebarComponent>('AESY_SIDEBAR');
