import { TableColumn } from './table-column.type';

export interface TableConfig<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  draggableColumns?: boolean;
  draggableRows?: boolean;
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
