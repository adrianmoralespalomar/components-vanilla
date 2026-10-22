import { TableColumn } from './table-column.type';

export interface TableRowContext<T = Record<string, unknown>> {
  $implicit: T;
  /** Posición de la fila en la página mostrada, empezando en 0. */
  index: number;
  /** Columnas de datos de `config.columns`, en el orden actual. */
  columns: TableColumn<T>[];
}
