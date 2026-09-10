export interface RequestData {
  page: number;
  rowsPerPageCurrent: number;
  filters: any;
  sortByKey?: string;
  sortDirection?: 'asc' | 'desc' | '';
}
