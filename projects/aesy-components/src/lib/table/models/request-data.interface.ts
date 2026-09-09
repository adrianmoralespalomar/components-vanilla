export interface RequestData {
  page: number;
  rowsPerPageCurrent: number;
  filters: any;
  sort: { key: string; direction: 'asc' | 'desc' | '' };
}
