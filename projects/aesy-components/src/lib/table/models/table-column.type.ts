import { Row } from './row.type';
import { TableCustomColumn } from './table-custom-column.interface';
import { TableDataColumn } from './table-data-column.interface';

export type TableColumn<T = Row> = TableDataColumn<T> | TableCustomColumn;
