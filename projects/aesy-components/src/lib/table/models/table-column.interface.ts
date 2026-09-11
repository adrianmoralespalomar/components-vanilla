import { SelectOption } from '../../form-controls/select/models/select-option.interface';

export interface TableColumn<T = Record<string, unknown>> {
  alignCell?: TableColumnAlign;
  alignHeader?: TableColumnAlign;
  filterable?: boolean;
  fixed?: boolean;
  key: keyof T & string;
  label: string;
  options?: SelectOption[];
  sortable?: boolean;
  type: TableColumnType;
  width?: string;
}
export type TableColumnType = 'text' | 'number' | 'date' | 'select';
export type TableColumnAlign = 'left' | 'center' | 'right';
