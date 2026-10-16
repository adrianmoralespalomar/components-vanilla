/** Una fila de una subtabla se ha desplegado o plegado. `parentRows` son sus ancestras, de la fila de la tabla raíz hacia abajo. */
export interface TableSubRowExpandedChange {
  row: object;
  expanded: boolean;
  parentRows: object[];
}
