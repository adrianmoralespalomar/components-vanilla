import { ComponentApi } from '../../../models/component-api.interface';

export const TABLE_API: ComponentApi = {
  inputs: [
    { name: 'config', type: 'TableConfig<T>', defaultValue: 'obligatorio', description: 'Columnas y comportamiento de la tabla.' },
    { name: 'paginationMetaConfig', type: 'PaginationMeta | null', defaultValue: 'null', description: 'Estado y textos de la paginación. Sin él no hay paginación: en local se muestran todas las filas y con serverSide requestData pide todas (page y rowsPerPageCurrent a null).' },
    { name: 'data', type: 'T[]', defaultValue: '[]', description: 'Filas. En local, todas (si cambian, la tabla se actualiza conservando filtros, orden y página); con serverSide, solo las de la página actual.' },
    { name: 'subRows', type: 'Record<string, readonly object[]>', defaultValue: '{}', description: 'Filas hijas de las filas desplegables, por el valor de expandable.key de la fila padre. Mientras una fila desplegada no tenga entrada, muestra "Cargando…". Devuelve un objeto nuevo en cada carga.' }
  ],
  outputs: [
    { name: 'requestData', type: 'RequestData', description: 'Pide datos al cambiar de página, filtros u orden. Con serverSide es donde llamas a tu API.' },
    { name: 'selectionChange', type: 'T[]', description: 'Todas las filas seleccionadas cada vez que cambia la selección, también las de otras páginas en modo servidor.' },
    { name: 'currentPageChange', type: 'number', description: 'Nueva página actual.' },
    { name: 'rowsPerPageChange', type: 'number', description: 'Nuevo número de filas por página.' },
    { name: 'rowOrderChange', type: '{ previousIndex: number; currentIndex: number; row: T }', description: 'Una fila se ha arrastrado a otra posición; reordena tus datos con estos índices.' },
    { name: 'rowClicked', type: 'T', description: 'Clic (o Enter) en una fila. Solo con clickableRows; los clics en botones, enlaces y campos no cuentan.' },
    { name: 'rowExpandedChange', type: '{ row: T; expanded: boolean }', description: 'Una fila se ha desplegado o plegado. Al desplegar es donde llamas a tu endpoint y devuelves las filas hijas en subRows.' },
    { name: 'subRowExpandedChange', type: '{ row: object; expanded: boolean; parentRows: object[] }', description: 'Lo mismo para una fila de una subtabla (a cualquier nivel). parentRows son sus ancestras, de la fila de esta tabla hacia abajo.' }
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
        { name: 'expandable', type: 'TableExpandableConfig<T, S> | undefined', description: 'Activa filas desplegables con una subtabla (S es el tipo de sus filas).' },
        { name: 'clickableRows', type: 'boolean | undefined', description: 'Las filas emiten rowClicked con clic o Enter y muestran cursor de puntero.' },
        { name: 'rowClass', type: '((row: T) => string | string[]) | undefined', description: 'Clases CSS de cada fila según sus datos. Se aplican a .aesy-table-row: para estilarlas desde un componente hace falta ::ng-deep o un estilo global.' },
        { name: 'sortByKey', type: 'string | undefined', description: 'Columna ordenada inicialmente.' },
        { name: 'sortDirection', type: "'asc' | 'desc' | '' | undefined", description: 'Dirección de la ordenación inicial.' }
      ]
    },
    {
      name: 'Directivas',
      properties: [
        { name: 'ng-template[aesyTableCell]', type: 'TableCellDirective<T>', description: 'Plantilla de las celdas de la columna con esa key. let-row recibe la fila y let-column="column" la columna.' },
        { name: '[aesyTableCellRows]', type: 'T[] | undefined', description: 'Solo para el tipado: pasa las mismas filas que a la tabla y row llega con su tipo. Sin él, row es Record<string, unknown>.' },
        { name: '[aesyTableCellTable]', type: 'string | undefined', description: 'tableName de la subtabla donde se aplica la plantilla de celda, a cualquier nivel. Sin él, solo afecta a la tabla donde está declarada.' },
        { name: 'ng-template[aesyTableExpander]', type: 'TableExpanderDirective<T>', description: 'Botón propio para desplegar filas. let-row recibe la fila, let-expanded="expanded" su estado y let-toggle="toggle" la función que la despliega o pliega.' },
        { name: 'ng-template[aesyTableRow]', type: 'TableRowDirective<T>', description: 'Maquetación libre de cada fila en lugar de las celdas de las columnas de datos (las de casilla y desplegar se mantienen). let-row recibe la fila, let-index="index" su posición y let-columns="columns" las columnas de datos. Las plantillas aesyTableCell no se aplican.' },
        { name: '[aesyTableRowRows]', type: 'T[] | undefined', description: 'Solo para el tipado: pasa las mismas filas que a la tabla.' },
        { name: '[aesyTableRowTable]', type: 'string | undefined', description: 'tableName de la subtabla donde se aplica la plantilla de fila, a cualquier nivel. Sin él, solo afecta a la tabla donde está declarada.' },
        { name: 'ng-template[aesyTableEmpty]', type: 'TableEmptyDirective', description: 'Contenido que se muestra cuando no hay filas, en lugar de "No hay datos disponibles."' },
        { name: 'ng-template[aesyTableDetail]', type: 'TableDetailDirective<T>', description: 'Panel libre bajo la fila desplegada, en lugar de una subtabla. let-row recibe la fila y let-subRows="subRows" sus filas hijas.' }
      ]
    },
    {
      name: 'TableColumn<T>',
      properties: [
        { name: 'key', type: 'keyof T & string', description: 'Propiedad de la fila que muestra la columna. En las columnas custom, cualquier identificador.' },
        { name: 'label', type: 'string', description: 'Texto de la cabecera.' },
        { name: 'type', type: "'text' | 'number' | 'date' | 'select' | 'custom'", description: "Tipo de dato; decide el filtro que se muestra. 'custom' es una columna sin dato propio que se pinta con aesyTableCell y no se ordena ni filtra." },
        { name: 'options', type: 'SelectOption[] | undefined', description: 'Opciones del filtro cuando type es select.' },
        { name: 'sortable', type: 'boolean | undefined', description: 'Permite ordenar por la columna.' },
        { name: 'filterable', type: 'boolean | undefined', description: 'Muestra un filtro bajo la cabecera.' },
        { name: 'fixed', type: 'boolean | undefined', description: 'Fija la columna a la izquierda al hacer scroll horizontal.' },
        { name: 'width', type: 'string | undefined', description: 'Ancho CSS de la columna (px, %, rem…).' },
        { name: 'alignHeader', type: "'left' | 'center' | 'right' | undefined", description: 'Alineación de la cabecera. Por defecto, a la izquierda; úsala junto con alignCell para que cabecera y celdas coincidan.' },
        { name: 'alignCell', type: "'left' | 'center' | 'right' | undefined", description: 'Alineación de las celdas. Por defecto, a la izquierda también en las columnas numéricas.' }
      ]
    },
    {
      name: 'TableSelectableConfig<T>',
      properties: [
        { name: 'key', type: 'keyof T & string', description: 'Propiedad que identifica cada fila de forma única. La selección se guarda por este valor.' },
        { name: 'headerLabel', type: 'string | undefined', description: 'Texto de la cabecera de la columna de casillas. Por defecto, vacía.' },
        { name: 'selectedValues', type: 'unknown[] | undefined', description: 'Valores de key que empiezan seleccionados.' },
        { name: 'width', type: 'string | undefined', description: 'Ancho CSS de la columna de casillas. Por defecto, 3rem: ensánchalo si pones un headerLabel largo.' }
      ]
    },
    {
      name: 'TableExpandableConfig<T, S>',
      properties: [
        { name: 'key', type: 'keyof T & string', description: 'Propiedad que identifica cada fila. También es la clave de subRows. Debe ser única entre todos los niveles si usas subRows.' },
        { name: 'subTable', type: 'TableConfig<S> | undefined', description: 'Configuración de la subtabla. Puede tener su propio expandable. Sin ella hace falta una plantilla aesyTableDetail.' },
        { name: 'subTablePagination', type: 'PaginationMeta | null | undefined', description: 'Paginación de la subtabla. Sin ella se muestran todas sus filas.' },
        { name: 'subRowsKey', type: 'keyof T & string | undefined', description: 'Propiedad de la fila con sus filas hijas. Si falta o es undefined, se buscan en subRows.' },
        { name: 'togglePosition', type: "'before' | 'after' | undefined", description: 'Lado donde va el botón: izquierda (before, por defecto) o derecha (after).' },
        { name: 'toggleWidth', type: 'string | undefined', description: 'Ancho CSS de la columna del botón. Por defecto, 3rem: ensánchalo si pintas un botón propio con aesyTableExpander.' },
        { name: 'toggleIconSvg', type: 'string | undefined', description: 'Path SVG (20×20) del icono. Por defecto, el chevron del acordeón.' },
        { name: 'headerLabel', type: 'string | undefined', description: 'Texto de la cabecera de la columna del botón. Por defecto, vacía.' },
        { name: 'expandedValues', type: 'unknown[] | undefined', description: 'Valores de key de las filas desplegadas al empezar. No emiten rowExpandedChange.' },
        { name: 'singleExpansion', type: 'boolean | undefined', description: 'Al desplegar una fila se pliegan las demás.' }
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
        { name: 'page', type: 'number | null', description: 'Página pedida. null si la tabla no tiene paginación: devuelve todas las filas.' },
        { name: 'rowsPerPageCurrent', type: 'number | null', description: 'Filas por página. null si la tabla no tiene paginación.' },
        { name: 'filters', type: 'any', description: 'Valores de los filtros, por key de columna.' },
        { name: 'sortByKey', type: 'string | undefined', description: 'Columna por la que ordenar.' },
        { name: 'sortDirection', type: "'asc' | 'desc' | '' | undefined", description: 'Dirección de la ordenación.' }
      ]
    }
  ]
};
