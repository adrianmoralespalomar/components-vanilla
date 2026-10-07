import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Exige un mínimo de opciones seleccionadas. El mensaje lo muestra el control mediante `error.message`. */
export function minimumSelectedOptionsValidator(minimumOptions: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedOptionsCount: number = Array.isArray(control.value) ? control.value.length : 0;
    return selectedOptionsCount < minimumOptions ? { minimumSelectedOptions: { message: `Selecciona al menos ${minimumOptions} opciones.` } } : null;
  };
}
