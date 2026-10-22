import { Directive, inject, input, TemplateRef } from '@angular/core';

import { Row } from '../models/row.type';
import { TableRowContext } from '../models/table-row-context.interface';

/**
 * Contenido libre de cada fila en lugar de las celdas de las columnas de datos. Ocupa todo el ancho que dejan las
 * columnas de casilla y de desplegar, que la tabla sigue pintando. Las plantillas `aesyTableCell` no se aplican.
 * `let-row` recibe la fila, `let-index="index"` su posición y `let-columns="columns"` las columnas de datos.
 *
 * ```html
 * <ng-template aesyTableRow [aesyTableRowRows]="people()" let-row>…</ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[aesyTableRow]'
})
export class TableRowDirective<T extends object = Row> {
  readonly templateRef = inject<TemplateRef<TableRowContext<T>>>(TemplateRef);

  /** Solo sirve para el tipado: Angular deduce de aquí el tipo de `row`. */
  readonly rows = input<readonly T[]>([], { alias: 'aesyTableRowRows' });

  static ngTemplateContextGuard<T extends object>(directive: TableRowDirective<T>, context: unknown): context is TableRowContext<T> {
    return true;
  }
}
