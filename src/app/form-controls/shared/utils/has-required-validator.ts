import { AbstractControl, Validators } from '@angular/forms';

export function hasRequiredValidator(control: AbstractControl | null): boolean {
  if (!control) {
    return false;
  }

  if (control.hasValidator(Validators.required)) {
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
