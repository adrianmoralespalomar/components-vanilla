import { Directive, inject, input, TemplateRef } from '@angular/core';

import { Row } from '../models/row.type';
import { TableDetailContext } from '../models/table-detail-context.interface';

/**
 * Contenido libre del panel que se despliega bajo una fila (requiere `expandable`). Sustituye a la subtabla.
 * `let-row` recibe la fila y `let-subRows="subRows"` sus filas hijas.
 *
 * ```html
 * <ng-template aesyTableDetail [aesyTableDetailRows]="people()" let-row>…</ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[aesyTableDetail]'
})
export class TableDetailDirective<T extends object = Row> {
  readonly templateRef = inject<TemplateRef<TableDetailContext<T>>>(TemplateRef);

  /** Solo sirve para el tipado: Angular deduce de aquí el tipo de `row`. */
  readonly rows = input<readonly T[]>([], { alias: 'aesyTableDetailRows' });

  static ngTemplateContextGuard<T extends object>(directive: TableDetailDirective<T>, context: unknown): context is TableDetailContext<T> {
    return true;
  }
}
