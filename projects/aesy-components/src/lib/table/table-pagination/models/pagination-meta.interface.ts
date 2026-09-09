export interface PaginationMeta {
  goFirstPageButtonShown?: boolean;
  goFirstPageButtonIconSvg?: string;
  goFirstPageButtonLabel?: string;
  goLastPageButtonShown?: boolean;
  goLastPageButtonIconSvg?: string;
  goLastPageButtonLabel?: string;
  nextIconSvg?: string;
  nextLabel?: string;
  pageShown?: boolean;
  page: number;
  pageSize: number;
  pageLabelPrefix?: string;
  previousIconSvg?: string;
  previousLabel?: string;
  total: number;
}
