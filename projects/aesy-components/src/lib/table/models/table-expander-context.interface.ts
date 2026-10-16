export interface TableExpanderContext<T = Record<string, unknown>> {
  $implicit: T;
  expanded: boolean;
  /** Despliega o pliega la fila y emite `rowExpandedChange`. */
  toggle: () => void;
}
