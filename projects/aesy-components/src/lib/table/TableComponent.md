# TableComponent

Tabla genérica con filtros, ordenación, selección de filas, columnas y filas reordenables y paginación local o por API.

Selector: `aesy-table`.

## Características

- Genérica: `TableComponent<T>` acepta filas tipadas con `interface`, `type` o clase.
- Dos modos:
  - **Local** (`serverSide: false`): recibe todas las filas y filtra, ordena y pagina en memoria por su cuenta.
  - **Servidor** (`serverSide: true`): solo pinta lo que recibe y pide cada página, filtro u orden con `requestData`.
- Filtros por columna según su tipo (`text`, `number`, `date`, `select`).
- Ordenación por columna.
- Selección de filas con casillas (`selectable`).
- Columnas fijas a la izquierda (`fixed`) y cabecera fija (`isHeaderFixed`).
- Columnas y filas reordenables arrastrando (CDK drag & drop).
- Subtablas desplegables (`expandable`), con las filas hijas en la propia fila o cargadas al desplegar.
- Filas con maquetación libre (`aesyTableRow`), clases por fila (`rowClass`), filas clicables (`clickableRows`) y mensaje propio para el estado vacío (`aesyTableEmpty`).
- Persistencia de filtros en la URL (`persistFilters`).
- Paginación configurable (u omitible): textos, iconos, primera/última página y filas por página.
- Celdas con contenido propio (botones, enlaces, etiquetas…) con `aesyTableCell`, y columnas `custom` sin dato propio (acciones).

---

# Importación

```ts
import { PaginationMeta, RequestData, TableComponent, TableConfig } from 'aesy-components';

@Component({
  imports: [TableComponent]
})
export class ExampleComponent {}
```

Requiere `@angular/cdk` y `@angular/router` (este último por `persistFilters`).

---

# Modo local

```ts
interface Person {
  name: string;
  country: string;
  age: number;
}

protected readonly PEOPLE_TABLE_CONFIG: TableConfig<Person> = {
  tableName: 'people',
  serverSide: false,
  isHeaderFixed: true,
  persistFilters: true,
  columns: [
    { key: 'name', label: 'Nombre', type: 'text', sortable: true, filterable: true, fixed: true, width: '180px' },
    { key: 'country', label: 'País', type: 'select', filterable: true, options: COUNTRY_OPTIONS },
    { key: 'age', label: 'Edad', type: 'number', sortable: true }
  ]
};

// En local la tabla pagina por su cuenta: esto fija el estado inicial
protected readonly PEOPLE_PAGINATION: PaginationMeta = { page: 1, rowsPerPageCurrent: 5, total: PEOPLE.length };
```

```html
<aesy-table [data]="PEOPLE" [config]="PEOPLE_TABLE_CONFIG" [paginationMetaConfig]="PEOPLE_PAGINATION" />
```

En modo local:

- La tabla **reacciona a cada cambio de `data`**: una carga asíncrona, altas o bajas. Vuelve a aplicar los filtros, el orden y la página activos (si la página deja de existir, va a la última). Hay que darle un array nuevo; mutar el mismo array con `push` no se detecta.
- Si cambias `paginationMetaConfig` desde fuera (por ejemplo, para volver a la página 1), también se aplica.
- No emite `requestData`: filtrar, ordenar y paginar es cosa suya.

---

# Modo servidor

```ts
protected readonly products = signal<Product[]>([]);
protected readonly pagination = signal<PaginationMeta>({ page: 1, rowsPerPageCurrent: 10, total: 0 });

protected onProductsTableDataRequested(requestData: RequestData): void {
  this.productsService.search(requestData).subscribe(response => {
    this.products.set(response.items);
    this.pagination.update(pagination => ({ ...pagination, page: requestData.page, rowsPerPageCurrent: requestData.rowsPerPageCurrent, total: response.total }));
  });
}
```

```html
<aesy-table
  [data]="products()"
  [config]="PRODUCTS_TABLE_CONFIG"
  [paginationMetaConfig]="pagination()"
  (requestData)="onProductsTableDataRequested($event)" />
```

`requestData` llega con la página, las filas por página, los filtros (por `key` de columna) y la ordenación.

---

# Selección de filas

```ts
protected readonly CITIES_TABLE_CONFIG: TableConfig<City> = {
  tableName: 'cities',
  columns: [/* … */],
  selectable: {
    key: 'name',                          // propiedad que identifica cada fila
    selectedValues: ['Madrid', 'Barcelona'] // filas marcadas al empezar
  }
};
```

```html
<aesy-table [data]="CITIES" [config]="CITIES_TABLE_CONFIG" [paginationMetaConfig]="pagination" (selectionChange)="selectedCities.set($event)" />
```

La selección se guarda por el valor de `key`, no por el objeto: se mantiene aunque `data` traiga objetos nuevos con los mismos datos. `selectionChange` devuelve siempre todas las filas seleccionadas. En modo servidor también las de otras páginas: la tabla guarda cada fila al marcarla, así que no se pierden al paginar. Las de `selectedValues` que estén en páginas aún no cargadas se añaden en cuanto llegan en `data`.

La columna de casillas no tiene texto en la cabecera; si quieres uno, usa `selectable.headerLabel`.

---

# Celdas personalizadas

Por defecto cada celda muestra `row[key]` como texto. Para pintar otra cosa (botones, enlaces, etiquetas), declara dentro de la tabla un `ng-template` con `aesyTableCell` y la `key` de la columna. `let-row` recibe la fila y `let-column="column"` la columna.

```ts
import { TableCellDirective, TableComponent, TableConfig } from 'aesy-components';

@Component({
  imports: [TableCellDirective, TableComponent]
})
export class DocumentsComponent {
  protected readonly documents = signal<Document[]>([]);

  protected readonly DOCUMENTS_TABLE_CONFIG: TableConfig<Document> = {
    tableName: 'documents',
    columns: [
      { key: 'name', label: 'Nombre', type: 'text', sortable: true, filterable: true },
      { key: 'status', label: 'Estado', type: 'text', sortable: true },
      { key: 'actions', label: 'Acciones', type: 'custom', width: '120px' }
    ]
  };
}
```

```html
<aesy-table [data]="documents()" [config]="DOCUMENTS_TABLE_CONFIG">
  <ng-template aesyTableCell="status" [aesyTableCellRows]="documents()" let-document>
    <span class="status-badge">{{ document.status }}</span>
  </ng-template>

  <ng-template aesyTableCell="actions" [aesyTableCellRows]="documents()" let-document>
    <aesy-button type="tertiary" label="Descargar" (buttonClick)="onDownloadButtonClicked(document)" />
  </ng-template>
</aesy-table>
```

Dos tipos de columna con plantilla:

- **Columna de datos** (`status`): su `key` es una propiedad de la fila. La plantilla solo cambia cómo se pinta; se sigue ordenando y filtrando por el valor.
- **Columna `custom`** (`actions`): su `key` es un identificador cualquiera, no tiene que estar en la fila. No se ordena ni se filtra. Si no tiene plantilla, sus celdas quedan vacías.

El resto de columnas siguen comprobando que su `key` existe en `T`: una errata como `key: 'nmae'` da error de compilación.

**Tipado de la fila.** Angular no puede deducir el tipo de las filas a partir de la tabla, así que `aesyTableCellRows` recibe las mismas filas que `data` solo para eso: con él, `document` llega como `Document`. Sin él, llega como `Record<string, unknown>` y, con `strictTemplates`, no se puede pasar a un método que espere un `Document`.

---

# Filas, clic y estado vacío

Todo es opcional: sin estas opciones la tabla se comporta igual que antes.

```html
<aesy-table [data]="people()" [config]="config" (rowClicked)="onPersonRowClicked($event)">
  <ng-template aesyTableRow [aesyTableRowRows]="people()" let-person let-index="index">
    <strong>{{ person.name }}</strong> · {{ person.role }}
  </ng-template>
  <ng-template aesyTableEmpty>Aún no hay nadie en el equipo.</ng-template>
</aesy-table>
```

- **`aesyTableRow`** sustituye las celdas de las columnas de datos por una maquetación libre que ocupa el ancho que dejan las columnas de casilla y de desplegar (la tabla las sigue pintando). La cabecera, el orden, los filtros, la selección, el desplegado y el arrastre de filas siguen funcionando. Las plantillas `aesyTableCell` no se aplican en ese modo y las columnas fijas no tienen efecto en el cuerpo. Contexto: `TableRowContext<T>` (`$implicit`: la fila; `index`: su posición; `columns`: las columnas de datos).
- **`rowClass`** (en la config) devuelve las clases de cada fila según sus datos. Se aplican a `.aesy-table-row`, dentro de la vista de la tabla: para estilarlas desde un componente hace falta `::ng-deep` o un estilo global.
- **`clickableRows`** (en la config) hace que la fila emita `rowClicked` al hacer clic o pulsar Enter, con cursor de puntero. Los clics en botones, enlaces y campos no cuentan.
- **`aesyTableEmpty`** sustituye el texto "No hay datos disponibles.".

---

# Subtablas (filas desplegables)

`expandable` añade a la izquierda un botón que despliega una subtabla bajo cada fila. `TableConfig<T, S>`: `S` es el tipo de las filas de la subtabla.

```ts
protected readonly PEOPLE_TABLE_CONFIG: TableConfig<Person, Order> = {
  tableName: 'people',
  columns: [/* … */],
  expandable: {
    key: 'id',                  // identifica cada fila (y es la clave de subRows)
    subTable: { tableName: 'orders', columns: ORDER_COLUMNS }
  }
};
```

Las filas hijas se pueden dar de dos formas (si la fila tiene la propiedad, gana sobre `subRows`):

- **Dentro de la fila**: `subRowsKey: 'orders'` y cada `Person` trae su array `orders`.
- **Bajo demanda**: `rowExpandedChange` avisa al desplegar y plegar; llamas a tu endpoint y devuelves el resultado en `subRows` (objeto nuevo, indexado por el valor de `key`). Mientras no haya entrada para una fila desplegada, muestra "Cargando…".

```ts
protected readonly orders = signal<Record<string, Order[]>>({});

protected onPersonRowExpanded({ row, expanded }: TableRowExpandedChange<Person>): void {
  if (!expanded || this.orders()[row.id]) return;
  this.ordersService.getByPerson(row.id).subscribe(orders => this.orders.update(current => ({ ...current, [row.id]: orders })));
}
```

```html
<aesy-table [data]="people()" [config]="PEOPLE_TABLE_CONFIG" [subRows]="orders()" (rowExpandedChange)="onPersonRowExpanded($event)" />
```

Para volver a pedirlos en cada despliegue, quita la entrada de `subRows` al plegar.

- `subTable` puede llevar su propio `expandable` (anidación a varios niveles). Los eventos de los niveles inferiores suben por `subRowExpandedChange` (`{ row, expanded, parentRows }`, con `parentRows` desde la fila de esta tabla hacia abajo). `subRows` se pasa a todos los niveles, así que las claves deben ser únicas entre ellos.
- `subTablePagination` pagina la subtabla; sin él se muestran todas sus filas.
- `singleExpansion` pliega las demás al desplegar una; `expandedValues` fija las desplegadas al empezar (sin emitir evento).
- **Celdas personalizadas en subtablas**: un `aesyTableCell` con `aesyTableCellTable="<tableName de la subtabla>"` se aplica a esa subtabla a cualquier nivel. Sin `aesyTableCellTable`, solo afecta a la tabla donde está declarada.
- **Panel libre en lugar de subtabla**: un `ng-template aesyTableDetail` (con `let-row` y `let-subRows="subRows"`) sustituye a la subtabla; entonces `subTable` es opcional.

```html
<aesy-table [data]="people()" [config]="CONFIG">
  <ng-template aesyTableCell="total" aesyTableCellTable="orders" let-order>{{ order.total }} €</ng-template>
  <ng-template aesyTableDetail [aesyTableDetailRows]="people()" let-person>Ficha de {{ person.name }}</ng-template>
</aesy-table>
```

- **Botón de desplegar**: por defecto es el chevron del acordeón (gira 180° al desplegar), a la izquierda. `togglePosition: 'after'` lo pasa a la derecha y `toggleIconSvg` cambia el icono (path SVG 20×20). Para un botón propio, `ng-template aesyTableExpander` con `let-expanded="expanded"` y `let-toggle="toggle"` (`toggle()` despliega o pliega y emite `rowExpandedChange`):

```html
<aesy-table [data]="people()" [config]="CONFIG">
  <ng-template aesyTableExpander [aesyTableExpanderRows]="people()" let-person let-expanded="expanded" let-toggle="toggle">
    <aesy-button type="tertiary" [label]="expanded ? 'Ocultar' : 'Ver pedidos'" (buttonClick)="toggle()" />
  </ng-template>
</aesy-table>
```

- No se combina bien con `draggableRows`: arrastrar desde la subtabla arrastraría la fila padre.

---

# Columnas y filas reordenables

```ts
protected readonly CONFIG: TableConfig<Person> = {
  tableName: 'people',
  columns: PEOPLE_COLUMNS,
  draggableColumns: true,
  draggableRows: true
};
```

- Las columnas `fixed` y la de selección no se pueden arrastrar.
- En **local**, la tabla reordena sus filas (si no hay filtro ni orden activos) y avisa con `rowOrderChange`.
- En **servidor**, eres tú quien reordena los datos con el evento:

```ts
protected onRowOrderChanged(rowOrder: RowOrderChange<Product>): void {
  const reorderedProducts: Product[] = [...this.products()];
  moveItemInArray(reorderedProducts, rowOrder.previousIndex, rowOrder.currentIndex);
  this.products.set(reorderedProducts);
}
```

---

# Paginación

```ts
protected readonly PAGINATION: PaginationMeta = {
  page: 1,
  rowsPerPageCurrent: 10,
  total: 0,
  pageShown: true,
  pageLabelPrefix: 'Página',
  goFirstPageButtonShown: true,
  goLastPageButtonShown: true,
  previousLabel: 'Anterior',
  nextLabel: 'Siguiente',
  rowsPerPage: [
    { label: '10 filas', value: 10 },
    { label: '25 filas', value: 25 }
  ]
};
```

Cada botón admite texto (`…Label`) o icono (`…IconSvg`, path SVG de 20×20). Si se indica texto, el icono no se muestra.

Sin `paginationMetaConfig` no se muestra la paginación: en modo local se pintan todas las filas y, en modo servidor, `requestData` llega con `page` y `rowsPerPageCurrent` a `null` (hay que devolver todas).

Si ninguna columna es `filterable`, la cabecera no reserva el hueco de los filtros.

---

# Persistencia de filtros en la URL

Con `persistFilters: true` los filtros se guardan en los query params con el prefijo `tableName` (`?peoplename=ana`). Al volver a la página con esa URL, los filtros se restauran. Usa un `tableName` distinto en cada tabla de la misma página.

---

# API

## Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `config` | `TableConfig<T>` | obligatorio | Columnas y comportamiento. |
| `paginationMetaConfig` | `PaginationMeta \| null` | `null` | Estado y textos de la paginación. Sin él, no hay paginación. |
| `data` | `T[]` | `[]` | Filas. En local, todas (los cambios se reflejan); en servidor, las de la página actual. |
| `subRows` | `Record<string, readonly object[]>` | `{}` | Filas hijas de las filas desplegables, por el valor de `expandable.key`. |

## Outputs

| Output | Tipo | Descripción |
|---|---|---|
| `requestData` | `RequestData` | Solo en servidor: pide datos al cambiar página, filtros u orden. |
| `selectionChange` | `T[]` | Todas las filas seleccionadas, también las de otras páginas en modo servidor. |
| `currentPageChange` | `number` | Nueva página actual. |
| `rowsPerPageChange` | `number` | Nuevo número de filas por página. |
| `rowOrderChange` | `RowOrderChange<T>` | Una fila se ha arrastrado a otra posición. |
| `rowClicked` | `T` | Clic (o Enter) en una fila. Solo con `clickableRows`. |
| `rowExpandedChange` | `TableRowExpandedChange<T>` | Una fila se ha desplegado o plegado (`{ row, expanded }`). |
| `subRowExpandedChange` | `TableSubRowExpandedChange` | Lo mismo en una subtabla, a cualquier nivel. |

## Directivas

| Selector | Descripción |
|---|---|
| `ng-template[aesyTableCell]` | Plantilla de las celdas de la columna con esa `key` (`TableCellDirective<T>`). Contexto: `TableCellContext<T>` (`$implicit`: la fila; `column`: la columna). |
| `[aesyTableCellRows]` | Opcional, solo para el tipado: las mismas filas que `data`. |
| `[aesyTableCellTable]` | Opcional: `tableName` de la subtabla donde se aplica la plantilla de celda. |
| `ng-template[aesyTableRow]` | Maquetación libre de cada fila en lugar de las celdas de datos (`TableRowDirective<T>`). Contexto: `TableRowContext<T>` (`$implicit`, `index`, `columns`). |
| `[aesyTableRowRows]` | Opcional, solo para el tipado de `row`. |
| `[aesyTableRowTable]` | Opcional: `tableName` de la subtabla donde se aplica la plantilla de fila. |
| `ng-template[aesyTableEmpty]` | Contenido del estado vacío (`TableEmptyDirective`). |
| `ng-template[aesyTableDetail]` | Panel libre bajo la fila desplegada (`TableDetailDirective<T>`). Contexto: `TableDetailContext<T>` (`$implicit`: la fila; `subRows`: sus filas hijas). |
| `[aesyTableDetailRows]` | Opcional, solo para el tipado de `row`. |
| `ng-template[aesyTableExpander]` | Botón propio para desplegar filas (`TableExpanderDirective<T>`). Contexto: `TableExpanderContext<T>` (`$implicit`: la fila; `expanded`; `toggle`). |
| `[aesyTableExpanderRows]` | Opcional, solo para el tipado de `row`. |

## Tipos

```ts
export interface TableConfig<T, S = Record<string, unknown>> {
  tableName: string;
  expandable?: TableExpandableConfig<T, S>;
  columns: TableColumn<T>[];
  serverSide?: boolean;
  persistFilters?: boolean;
  isHeaderFixed?: boolean;
  draggableColumns?: boolean;
  draggableRows?: boolean;
  clickableRows?: boolean;
  rowClass?: (row: T) => string | string[];
  selectable?: TableSelectableConfig<T>;
  sortByKey?: string;
  sortDirection?: 'asc' | 'desc' | '';
}

export type TableColumn<T> = TableDataColumn<T> | TableCustomColumn;

export interface TableDataColumn<T> {
  key: keyof T & string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: SelectOption[];       // filtro de tipo select
  sortable?: boolean;
  filterable?: boolean;
  fixed?: boolean;
  width?: string;
  alignHeader?: 'left' | 'center' | 'right';
  alignCell?: 'left' | 'center' | 'right';
}

export interface TableCustomColumn {
  key: string;                    // identificador; no tiene que estar en la fila
  label: string;
  type: 'custom';
  sortable?: false;
  filterable?: false;
  fixed?: boolean;
  width?: string;
  alignHeader?: 'left' | 'center' | 'right';
  alignCell?: 'left' | 'center' | 'right';
}

export interface TableSelectableConfig<T> {
  headerLabel?: string;           // texto de la cabecera de las casillas (por defecto, vacía)
  key: keyof T & string;
  selectedValues?: unknown[];
  width?: string;                        // columna de casillas; por defecto 3rem
}

export interface TableExpandableConfig<T, S> {
  key: keyof T & string;
  subTable?: TableConfig<S>;      // opcional si usas aesyTableDetail
  subTablePagination?: PaginationMeta | null;
  subRowsKey?: keyof T & string;
  togglePosition?: 'before' | 'after';   // izquierda (por defecto) o derecha
  toggleWidth?: string;                  // ancho de la columna del botón; por defecto 3rem
  toggleIconSvg?: string;                // por defecto, el chevron del acordeón
  headerLabel?: string;
  expandedValues?: unknown[];
  singleExpansion?: boolean;
}

export interface RequestData {
  page: number | null;               // null sin paginación: devuelve todas las filas
  rowsPerPageCurrent: number | null; // null sin paginación
  filters: any;
  sortByKey?: string;
  sortDirection?: 'asc' | 'desc' | '';
}

export interface RowOrderChange<T> {
  currentIndex: number;
  previousIndex: number;
  row: T;
}
```

`PaginationMeta` incluye `page`, `rowsPerPageCurrent`, `total` y los opcionales `rowsPerPage` (`PaginationMetaRowsPerPage[]`), `pageShown`, `pageLabelPrefix`, `goFirstPageButtonShown`, `goLastPageButtonShown` y los textos e iconos de los cuatro botones.

---

# CSS Variables

Declaradas en `:host` con el prefijo `--aesy-table-`:

```css
:host {
  --aesy-table-container-width: 100%;
  --aesy-table-container-height: auto;
  --aesy-table-min-width: 50rem;

  --aesy-table-border-color: #d1d5db;
  --aesy-table-border-width: 1px;
  --aesy-table-border-style: solid;

  --aesy-table-background: #ffffff;
  --aesy-table-text-color: #374151;
  --aesy-table-text-size: 0.875rem;
  --aesy-table-text-weight: 500;

  --aesy-table-cell-padding-y: 0.5rem;
  --aesy-table-cell-padding-x: 0.875rem;
  --aesy-table-cell-height: 40px;

  --aesy-table-header-background: #ffffff;
  --aesy-table-header-text-weight: 600;
  --aesy-table-header-border-color: #686a6d;
  --aesy-table-header-label-height: 24px;
  --aesy-table-header-filter-height: 32px;
  --aesy-table-header-gap: 0.5rem;

  --aesy-table-body-odd-background: #fafafa;
  --aesy-table-body-even-background: #ffffff;
  --aesy-table-body-hover-background: #efefef;
  --aesy-table-body-border-color: #e2e8f0;

  --aesy-table-expander-icon-color: #6b7280;
  --aesy-table-expander-icon-size: 1.25rem;
  --aesy-table-expander-icon-rotation-expanded: 180deg;
  --aesy-table-expander-transition-duration: 0.2s;
}
```

Además, `--aesy-table-header-text-color` (no tiene valor por defecto: sin definir, la cabecera usa `--aesy-table-text-color`) cambia el color del texto de la cabecera, útil con un fondo oscuro.

Con `isHeaderFixed`, define `--aesy-table-container-height` para que la tabla tenga scroll propio. Los filtros de la cabecera son form controls: se ajustan con `--aesy-form-controls-*` (ver `form-controls/how-to-override-classes.md`).
