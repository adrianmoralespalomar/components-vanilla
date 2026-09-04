export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  next?: string;
  previous?: string;
}
