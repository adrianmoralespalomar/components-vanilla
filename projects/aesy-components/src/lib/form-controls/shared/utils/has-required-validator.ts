import { AbstractControl, Validators } from '@angular/forms';

export function hasRequiredValidator(control: AbstractControl | null): boolean {
  if (!control) {
    return false;
  }

  // requiredTrue es el "obligatorio" de los checkbox (p. ej. aceptar condiciones)
  if (control.hasValidator(Validators.required) || control.hasValidator(Validators.requiredTrue)) {
    return true;
  }

  // Fallback para validators custom que devuelvan { required: ... }
  try {
    const errors = control.validator?.(control);

    return !!errors?.['required'];
  } catch {
    return false;
  }
}
