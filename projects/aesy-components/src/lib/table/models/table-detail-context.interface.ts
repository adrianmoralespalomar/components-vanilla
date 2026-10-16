export interface TableDetailContext<T = Record<string, unknown>> {
  $implicit: T;
  /** Filas hijas de la fila (de `subRowsKey` o `subRows`). `undefined` = aún sin cargar. */
  subRows: readonly object[] | undefined;
}
