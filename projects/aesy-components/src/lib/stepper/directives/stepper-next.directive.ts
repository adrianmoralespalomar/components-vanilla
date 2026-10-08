import { Directive, inject } from '@angular/core';
import { AESY_STEPPER } from '../models/aesy-stepper.token';

/** Al hacer clic avanza al paso siguiente del `aesy-stepper` que lo contiene. Sirve en un `button` o en un `aesy-button`. */
@Directive({
  selector: '[aesyStepperNext]',
  host: { '(click)': 'onHostClicked()' }
})
export class StepperNextDirective {
  private readonly stepper = inject(AESY_STEPPER);

  protected onHostClicked(): void {
    this.stepper.next();
  }
}
