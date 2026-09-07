export interface RequestData {
  page: number;
  pageSize: number;
  filters: any;
  sort: { key: string; direction: 'asc' | 'desc' | '' };
}
