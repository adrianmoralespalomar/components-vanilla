import { ComponentApi } from '../../../models/component-api.interface';

export const TABLE_API: ComponentApi = {
  inputs: [
    { name: 'config', type: 'TableConfig<T>', defaultValue: 'obligatorio', description: 'Columnas y comportamiento de la tabla.' },
    { name: 'paginationMetaConfig', type: 'PaginationMeta', defaultValue: 'obligatorio', description: 'Estado y textos de la paginación.' },
    { name: 'data', type: 'T[]', defaultValue: '[]', description: 'Filas. En local, todas (si cambian, la tabla se actualiza conservando filtros, orden y página); con serverSide, solo las de la página actual.' }
  ],
  outputs: [
    { name: 'requestData', type: 'RequestData', description: 'Pide datos al cambiar de página, filtros u orden. Con serverSide es donde llamas a tu API.' },
    { name: 'selectionChange', type: 'T[]', description: 'Todas las filas seleccionadas cada vez que cambia la selección, también las de otras páginas en modo servidor.' },
    { name: 'currentPageChange', type: 'number', description: 'Nueva página actual.' },
    { name: 'rowsPerPageChange', type: 'number', description: 'Nuevo número de filas por página.' },
    { name: 'rowOrderChange', type: '{ previousIndex: number; currentIndex: number; row: T }', description: 'Una fila se ha arrastrado a otra posición; reordena tus datos con estos índices.' }
  ],
  types: [
    {
      name: 'TableConfig<T>',
      properties: [
        { name: 'tableName', type: 'string', description: 'Nombre único. Prefija los query params cuando persistFilters está activo.' },
        { name: 'columns', type: 'TableColumn<T>[]', description: 'Definición de las columnas.' },
        { name: 'serverSide', type: 'boolean | undefined', description: 'Si es true, filtrar, ordenar y paginar lo hace tu API mediante requestData.' },
        { name: 'persistFilters', type: 'boolean | undefined', description: 'Guarda filtros, orden y página en los query params de la URL.' },
        { name: 'isHeaderFixed', type: 'boolean | undefined', description: 'Cabecera fija al hacer scroll dentro de la tabla.' },
        { name: 'draggableColumns', type: 'boolean | undefined', description: 'Permite reordenar columnas arrastrando la cabecera.' },
        { name: 'draggableRows', type: 'boolean | undefined', description: 'Permite reordenar filas arrastrándolas (emite rowOrderChange).' },
        { name: 'selectable', type: 'TableSelectableConfig<T> | undefined', description: 'Activa la selección de filas con casillas.' },
        { name: 'sortByKey', type: 'string | undefined', description: 'Columna ordenada inicialmente.' },
        { name: 'sortDirection', type: "'asc' | 'desc' | '' | undefined", description: 'Dirección de la ordenación inicial.' }
      ]
    },
    {
      name: 'TableColumn<T>',
      properties: [
        { name: 'key', type: 'keyof T & string', description: 'Propiedad de la fila que muestra la columna.' },
        { name: 'label', type: 'string', description: 'Texto de la cabecera.' },
        { name: 'type', type: "'text' | 'number' | 'date' | 'select'", description: 'Tipo de dato; decide el filtro que se muestra.' },
        { name: 'options', type: 'SelectOption[] | undefined', description: 'Opciones del filtro cuando type es select.' },
        { name: 'sortable', type: 'boolean | undefined', description: 'Permite ordenar por la columna.' },
        { name: 'filterable', type: 'boolean | undefined', description: 'Muestra un filtro bajo la cabecera.' },
        { name: 'fixed', type: 'boolean | undefined', description: 'Fija la columna a la izquierda al hacer scroll horizontal.' },
        { name: 'width', type: 'string | undefined', description: 'Ancho CSS de la columna (px, %, rem…).' },
        { name: 'alignHeader', type: "'left' | 'center' | 'right' | undefined", description: 'Alineación de la cabecera.' },
        { name: 'alignCell', type: "'left' | 'center' | 'right' | undefined", description: 'Alineación de las celdas.' }
      ]
    },
    {
      name: 'TableSelectableConfig<T>',
      properties: [
        { name: 'key', type: 'keyof T & string', description: 'Propiedad que identifica cada fila de forma única. La selección se guarda por este valor.' },
        { name: 'headerLabel', type: 'string | undefined', description: 'Texto de la cabecera de la columna de casillas. Por defecto, vacía.' },
        { name: 'selectedValues', type: 'unknown[] | undefined', description: 'Valores de key que empiezan seleccionados.' }
      ]
    },
    {
      name: 'PaginationMeta',
      properties: [
        { name: 'page', type: 'number', description: 'Página actual, empezando en 1.' },
        { name: 'rowsPerPageCurrent', type: 'number', description: 'Filas por página.' },
        { name: 'total', type: 'number', description: 'Total de filas. En local se calcula a partir de data.' },
        { name: 'rowsPerPage', type: 'PaginationMetaRowsPerPage[] | undefined', description: 'Opciones del selector de filas por página ({ label, value }).' },
        { name: 'pageShown', type: 'boolean | undefined', description: 'Muestra el indicador de página.' },
        { name: 'pageLabelPrefix', type: 'string | undefined', description: 'Texto antes del número de página.' },
        { name: 'goFirstPageButtonShown / goLastPageButtonShown', type: 'boolean | undefined', description: 'Muestra los botones de primera y última página.' },
        { name: 'previousLabel / nextLabel', type: 'string | undefined', description: 'Texto de los botones anterior y siguiente.' },
        { name: 'goFirstPageButtonLabel / goLastPageButtonLabel', type: 'string | undefined', description: 'Texto de los botones de primera y última página.' },
        { name: '…IconSvg', type: 'string | undefined', description: 'Path SVG (20×20) para cada uno de los cuatro botones.' }
      ]
    },
    {
      name: 'RequestData',
      properties: [
        { name: 'page', type: 'number', description: 'Página pedida.' },
        { name: 'rowsPerPageCurrent', type: 'number', description: 'Filas por página.' },
        { name: 'filters', type: 'any', description: 'Valores de los filtros, por key de columna.' },
        { name: 'sortByKey', type: 'string | undefined', description: 'Columna por la que ordenar.' },
        { name: 'sortDirection', type: "'asc' | 'desc' | '' | undefined", description: 'Dirección de la ordenación.' }
      ]
    }
  ]
};
