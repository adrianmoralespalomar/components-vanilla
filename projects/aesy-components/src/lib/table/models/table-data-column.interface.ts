import { SelectOption } from '../../form-controls/select/models/select-option.interface';
import { Row } from './row.type';
import { TableColumnBase } from './table-column-base.interface';
import { TableColumnType } from './table-column-type.type';

/** Columna que muestra una propiedad de la fila. Se puede ordenar y filtrar, y pintar con `aesyTableCell`. */
export interface TableDataColumn<T = Row> extends TableColumnBase {
  filterable?: boolean;
  key: keyof T & string;
  options?: SelectOption[];
  sortable?: boolean;
  type: TableColumnType;
}
