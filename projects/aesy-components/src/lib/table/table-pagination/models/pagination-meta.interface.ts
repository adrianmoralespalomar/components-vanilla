import { PaginationMetaRowsPerPage } from './pagination-meta-rows-per-page.interface';

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
  rowsPerPage?: PaginationMetaRowsPerPage[];
  page: number;
  rowsPerPageCurrent: number;
  pageLabelPrefix?: string;
  previousIconSvg?: string;
  previousLabel?: string;
  total: number;
}
