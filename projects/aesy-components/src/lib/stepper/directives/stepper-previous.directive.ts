import { Directive, inject } from '@angular/core';
import { AESY_STEPPER } from '../models/aesy-stepper.token';

/** Al hacer clic vuelve al paso anterior del `aesy-stepper` que lo contiene. Sirve en un `button` o en un `aesy-button`. */
@Directive({
  selector: '[aesyStepperPrevious]',
  host: { '(click)': 'onHostClicked()' }
})
export class StepperPreviousDirective {
  private readonly stepper = inject(AESY_STEPPER);

  protected onHostClicked(): void {
    this.stepper.previous();
  }
}
