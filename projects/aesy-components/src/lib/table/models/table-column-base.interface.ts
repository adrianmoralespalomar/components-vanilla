import { TableColumnAlign } from './table-column-align.type';

/** Campos comunes a las columnas con datos y a las personalizadas. */
export interface TableColumnBase {
  alignCell?: TableColumnAlign;
  alignHeader?: TableColumnAlign;
  fixed?: boolean;
  label: string;
  width?: string;
}
