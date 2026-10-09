import { TableColumnBase } from './table-column-base.interface';

/**
 * Columna sin dato propio (acciones, iconos…): su contenido lo pinta un `aesyTableCell` con su `key`.
 * No se puede ordenar ni filtrar.
 */
export interface TableCustomColumn extends TableColumnBase {
  filterable?: false;
  /** Identificador de la columna; no tiene que ser una propiedad de la fila. */
  key: string;
  options?: never;
  sortable?: false;
  type: 'custom';
}
