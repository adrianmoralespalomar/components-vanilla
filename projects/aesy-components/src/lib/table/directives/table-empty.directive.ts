import { Directive, inject, TemplateRef } from '@angular/core';

/**
 * Contenido que se muestra cuando no hay filas, en lugar de "No hay datos disponibles."
 *
 * ```html
 * <ng-template aesyTableEmpty>No hay resultados.</ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[aesyTableEmpty]'
})
export class TableEmptyDirective {
  readonly templateRef = inject<TemplateRef<void>>(TemplateRef);
}
