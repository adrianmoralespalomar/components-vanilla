import { PaginationMeta } from '../table-pagination/models/pagination-meta.interface';
import { TableConfig } from './table-config.interface';
import { TableExpanderPosition } from './table-expander-position.type';

/**
 * Filas desplegables: cada una abre una subtabla debajo.
 * Las filas hijas llegan en la propia fila (`subRowsKey`) o en el input `subRows` de la tabla, indexadas por el valor de `key`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ver el motivo en TableConfig
export interface TableExpandableConfig<T = Record<string, unknown>, S = any> {
  /** Propiedad que identifica cada fila. También es la clave de `subRows`. */
  key: keyof T & string;
  /** Configuración de la subtabla. Puede ser a su vez desplegable (anidación a varios niveles). Sin ella hace falta una plantilla `aesyTableDetail`. */
  subTable?: TableConfig<S>;
  /** Paginación de la subtabla. Sin ella se muestran todas sus filas. */
  subTablePagination?: PaginationMeta | null;
  /** Propiedad de la fila con sus filas hijas. Si falta o es `undefined`, se buscan en `subRows`. */
  subRowsKey?: keyof T & string;
  /** Lado de la fila donde va el botón. Por defecto, `before` (izquierda). */
  togglePosition?: TableExpanderPosition;
  /** Path SVG (20×20) del icono del botón. Por defecto, el chevron del acordeón, que gira 180° al desplegar. */
  toggleIconSvg?: string;
  /** Texto de la cabecera de la columna del botón de desplegar. Por defecto, vacía. */
  headerLabel?: string;
  /** Ancho CSS de la columna del botón. Por defecto, `3rem`: ensánchalo si pintas un botón propio con `aesyTableExpander`. */
  toggleWidth?: string;
  /** Valores de `key` de las filas desplegadas al empezar. No emiten `rowExpandedChange`. */
  expandedValues?: unknown[];
  /** Al desplegar una fila se pliegan las demás. */
  singleExpansion?: boolean;
}
