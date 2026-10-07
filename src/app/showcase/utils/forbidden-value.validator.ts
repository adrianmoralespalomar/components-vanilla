import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Rechaza un valor concreto. El mensaje lo muestra el control mediante `error.message`. */
export function forbiddenValueValidator(forbiddenValue: string, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => (control.value === forbiddenValue ? { forbiddenValue: { message } } : null);
}
