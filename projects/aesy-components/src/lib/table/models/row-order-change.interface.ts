export interface RowOrderChange<T> {
  currentIndex: number;
  previousIndex: number;
  row: T;
}
