export interface RequestData {
  /** Página pedida. null si la tabla no tiene paginación: hay que devolver todas las filas. */
  page: number | null;
  /** Filas por página. null si la tabla no tiene paginación. */
  rowsPerPageCurrent: number | null;
  filters: any;
  sortByKey?: string;
  sortDirection?: 'asc' | 'desc' | '';
}
