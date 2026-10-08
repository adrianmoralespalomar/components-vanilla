import { Directive, inject, TemplateRef } from '@angular/core';

/**
 * Contenido diferido de un `aesy-accordion-item`: no se crea hasta que el ítem se abre por primera vez
 * y después se conserva. Útil para contenido pesado (tablas, peticiones, gráficos).
 *
 * ```html
 * <ng-template aesyAccordionContent>…</ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[aesyAccordionContent]'
})
export class AccordionItemContentDirective {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}
