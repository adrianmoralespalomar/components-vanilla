import { Directive, inject, input, TemplateRef } from '@angular/core';

import { Row } from '../models/row.type';
import { TableExpanderContext } from '../models/table-expander-context.interface';

/**
 * Botón propio para desplegar las filas (requiere `expandable`) en lugar del chevron.
 * `let-row` recibe la fila, `let-expanded="expanded"` si está desplegada y `let-toggle="toggle"` la función que la despliega o pliega.
 *
 * ```html
 * <ng-template aesyTableExpander [aesyTableExpanderRows]="people()" let-row let-expanded="expanded" let-toggle="toggle">…</ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[aesyTableExpander]'
})
export class TableExpanderDirective<T extends object = Row> {
  readonly templateRef = inject<TemplateRef<TableExpanderContext<T>>>(TemplateRef);

  /** Solo sirve para el tipado: Angular deduce de aquí el tipo de `row`. */
  readonly rows = input<readonly T[]>([], { alias: 'aesyTableExpanderRows' });

  static ngTemplateContextGuard<T extends object>(directive: TableExpanderDirective<T>, context: unknown): context is TableExpanderContext<T> {
    return true;
  }
}
