import { TableColumn } from './table-column.interface';

export interface TableConfig<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  draggableColumns?: boolean;
  isHeaderFixed?: boolean;
  persistFilters?: boolean;
  selectable?: TableSelectableConfig<T>;
  serverSide?: boolean;
  sortByKey?: string;
  sortDirection?: 'asc' | 'desc' | '';
  tableName: string;
}

export interface TableSelectableConfig<T = Record<string, unknown>> {
  key: keyof T & string;
  selectedValues?: unknown[];
}
