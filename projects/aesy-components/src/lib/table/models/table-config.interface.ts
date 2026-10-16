import { TableColumn } from './table-column.type';
import { TableExpandableConfig } from './table-expandable-config.interface';

/**
 * `S` es el tipo de las filas de la subtabla cuando `expandable` está presente.
 * Por defecto `any`: `S` solo se usa en `keyof S`, que es contravariante, y con `unknown` o `Record` un `TableConfig<Person, Order>` no se podría pasar a `[config]`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TableConfig<T = Record<string, unknown>, S = any> {
  columns: TableColumn<T>[];
  draggableColumns?: boolean;
  draggableRows?: boolean;
  expandable?: TableExpandableConfig<T, S>;
  isHeaderFixed?: boolean;
  persistFilters?: boolean;
  selectable?: TableSelectableConfig<T>;
  serverSide?: boolean;
  sortByKey?: string;
  sortDirection?: 'asc' | 'desc' | '';
  tableName: string;
}

export interface TableSelectableConfig<T = Record<string, unknown>> {
  /** Texto de la cabecera de la columna de casillas. Por defecto, vacía. */
  headerLabel?: string;
  key: keyof T & string;
  selectedValues?: unknown[];
}
