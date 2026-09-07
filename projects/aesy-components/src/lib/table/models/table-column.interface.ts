export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T & string;
  label: string;
  type: TableColumnType;
  options?: unknown[];
  sortable?: boolean;
  filterable?: boolean;
}
export type TableColumnType = 'text' | 'number' | 'date' | 'select';
