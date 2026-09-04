import { ValidationErrors } from '@angular/forms';
export function getValidationErrorMessage(
  errors: ValidationErrors | null,
  customMessage?: string | null,
): string {
  if (!errors) {
    return '';
  }

  // Mensaje explícito proporcionado por el componente
  if (customMessage) {
    return customMessage;
  }

  /*
   * Primero buscamos mensajes proporcionados
   * directamente por validators custom.
   *
   * Ejemplos:
   *
   * { required: { message: 'El nombre es obligatorio' } }
   * { customError: { message: 'El valor no es válido' } }
   * { customError: 'Valor incorrecto' }
   */
  for (const error of Object.values(errors)) {
    if (typeof error === 'string') {
      return error;
    }

    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return error.message;
    }
  }

  // Errores estándar de Angular
  if (errors['required']) {
    return 'Campo obligatorio';
  }

  if (errors['minlength']) {
    return `La longitud mínima es ${errors['minlength'].requiredLength} caracteres`;
  }

  if (errors['maxlength']) {
    return `La longitud máxima es ${errors['maxlength'].requiredLength} caracteres`;
  }

  if (errors['email']) {
    return 'Formato de email inválido';
  }

  if (errors['pattern']) {
    return 'Formato inválido';
  }

  if (errors['min']) {
    return `El valor mínimo es ${errors['min'].min}`;
  }

  if (errors['max']) {
    return `El valor máximo es ${errors['max'].max}`;
  }

  return 'Valor inválido';
}
