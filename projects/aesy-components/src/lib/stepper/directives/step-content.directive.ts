import { Directive, inject, TemplateRef } from '@angular/core';

/**
 * Contenido diferido de un `aesy-step`: no se crea hasta que el paso se selecciona por primera vez
 * y después se conserva.
 *
 * ```html
 * <ng-template aesyStepContent>…</ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[aesyStepContent]'
})
export class StepContentDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}
