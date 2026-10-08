import { InjectionToken } from '@angular/core';
import type { StepperComponent } from '../stepper.component';

/** Lo provee `aesy-stepper` para que las directivas de navegación lo usen sin importar el componente (evita la dependencia circular). */
export const AESY_STEPPER = new InjectionToken<StepperComponent>('AESY_STEPPER');
