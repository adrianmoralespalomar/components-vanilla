export interface TableRowExpandedChange<T = Record<string, unknown>> {
  row: T;
  expanded: boolean;
}
