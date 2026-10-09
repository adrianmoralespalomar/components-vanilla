import { Row } from './row.type';
import { TableColumn } from './table-column.type';

export interface TableCellContext<T = Row> {
  $implicit: T;
  column: TableColumn<T>;
}
