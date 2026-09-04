import { TableColumn } from './table-column.interface';

export interface TableConfig<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  tableName: string;
  serverSide?: boolean;
  persistFilters?: boolean;
  selectable?: TableSelectableConfig<T>;
}

export interface TableSelectableConfig<T = Record<string, unknown>> {
  key: keyof T & string;
  selectedValues?: unknown[];
}
