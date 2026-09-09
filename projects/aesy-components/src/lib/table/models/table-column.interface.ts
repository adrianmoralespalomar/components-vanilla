export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T & string;
  label: string;
  type: TableColumnType;
  options?: unknown[];
  sortable?: boolean;
  filterable?: boolean;
  alignHeader?: 'left' | 'center' | 'right';
  alignCell?: 'left' | 'center' | 'right';
}
export type TableColumnType = 'text' | 'number' | 'date' | 'select';
