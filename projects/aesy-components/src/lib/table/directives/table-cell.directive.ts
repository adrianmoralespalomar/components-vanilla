import { Directive, inject, input, TemplateRef } from '@angular/core';

import { Row } from '../models/row.type';
import { TableCellContext } from '../models/table-cell-context.interface';

/**
 * Contenido propio de las celdas de una columna (botones, enlaces, iconos…) en lugar del texto de `row[key]`.
 * El valor es la `key` de la columna; `let-row` recibe la fila y `let-column="column"` la columna.
 * Pasa las mismas filas que a la tabla en `aesyTableCellRows` para que `row` llegue con su tipo.
 *
 * ```html
 * <ng-template aesyTableCell="actions" [aesyTableCellRows]="documents()" let-row>…</ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[aesyTableCell]'
})
export class TableCellDirective<T extends object = Row> {
  readonly templateRef = inject<TemplateRef<TableCellContext<T>>>(TemplateRef);

  readonly columnKey = input.required<string>({ alias: 'aesyTableCell' });
  /** Solo sirve para el tipado: Angular deduce de aquí el tipo de `row`. */
  readonly rows = input<readonly T[]>([], { alias: 'aesyTableCellRows' });

  static ngTemplateContextGuard<T extends object>(directive: TableCellDirective<T>, context: unknown): context is TableCellContext<T> {
    return true;
  }
}
