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
- Persistencia de filtros en la URL (`persistFilters`).
- Paginación configurable: textos, iconos, primera/última página y filas por página.

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
    { key: 'age', label: 'Edad', type: 'number', sortable: true, alignCell: 'right' }
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

---

# Persistencia de filtros en la URL

Con `persistFilters: true` los filtros se guardan en los query params con el prefijo `tableName` (`?peoplename=ana`). Al volver a la página con esa URL, los filtros se restauran. Usa un `tableName` distinto en cada tabla de la misma página.

---

# API

## Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `config` | `TableConfig<T>` | obligatorio | Columnas y comportamiento. |
| `paginationMetaConfig` | `PaginationMeta` | obligatorio | Estado y textos de la paginación. |
| `data` | `T[]` | `[]` | Filas. En local, todas (los cambios se reflejan); en servidor, las de la página actual. |

## Outputs

| Output | Tipo | Descripción |
|---|---|---|
| `requestData` | `RequestData` | Solo en servidor: pide datos al cambiar página, filtros u orden. |
| `selectionChange` | `T[]` | Todas las filas seleccionadas, también las de otras páginas en modo servidor. |
| `currentPageChange` | `number` | Nueva página actual. |
| `rowsPerPageChange` | `number` | Nuevo número de filas por página. |
| `rowOrderChange` | `RowOrderChange<T>` | Una fila se ha arrastrado a otra posición. |

## Tipos

```ts
export interface TableConfig<T> {
  tableName: string;
  columns: TableColumn<T>[];
  serverSide?: boolean;
  persistFilters?: boolean;
  isHeaderFixed?: boolean;
  draggableColumns?: boolean;
  draggableRows?: boolean;
  selectable?: TableSelectableConfig<T>;
  sortByKey?: string;
  sortDirection?: 'asc' | 'desc' | '';
}

export interface TableColumn<T> {
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

export interface TableSelectableConfig<T> {
  headerLabel?: string;           // texto de la cabecera de las casillas (por defecto, vacía)
  key: keyof T & string;
  selectedValues?: unknown[];
}

export interface RequestData {
  page: number;
  rowsPerPageCurrent: number;
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
}
```

Con `isHeaderFixed`, define `--aesy-table-container-height` para que la tabla tenga scroll propio. Los filtros de la cabecera son form controls: se ajustan con `--aesy-form-controls-*` (ver `form-controls/how-to-override-classes.md`).
