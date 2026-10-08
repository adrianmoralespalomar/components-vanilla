import { InjectionToken } from '@angular/core';
import type { AccordionComponent } from '../accordion.component';

/** Lo provee `aesy-accordion` para que sus ítems lean su configuración sin importar el componente (evita la dependencia circular). */
export const AESY_ACCORDION = new InjectionToken<AccordionComponent>('AESY_ACCORDION');
