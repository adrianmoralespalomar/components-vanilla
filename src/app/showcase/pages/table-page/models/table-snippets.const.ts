import { DocSnippet } from '../../../models/doc-snippet.interface';

export const TABLE_SNIPPETS = {
  local: {
    ts: `protected readonly PEOPLE_TABLE_CONFIG: TableConfig<Person> = {
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
protected readonly PEOPLE_PAGINATION: PaginationMeta = { page: 1, rowsPerPageCurrent: 5, total: PEOPLE.length, pageShown: true };`,
    html: `<aesy-table
  [data]="PEOPLE"
  [config]="PEOPLE_TABLE_CONFIG"
  [paginationMetaConfig]="PEOPLE_PAGINATION" />`,
    css: `aesy-table {
  --aesy-table-container-height: 20rem;
}`
  },
  asyncData: {
    ts: `private readonly peopleService = inject(PeopleService);

// La tabla empieza vacía y se rellena cuando llega la respuesta
protected readonly people = toSignal(this.peopleService.getPeople(), { initialValue: [] });`,
    html: `<aesy-table
  [data]="people()"
  [config]="PEOPLE_TABLE_CONFIG"
  [paginationMetaConfig]="PEOPLE_PAGINATION" />

<!-- Las altas y bajas también se reflejan: basta con dar a data un array nuevo -->`
  },
  selectable: {
    ts: `protected readonly CITIES_TABLE_CONFIG: TableConfig<City> = {
  tableName: 'cities',
  columns: [/* … */],
  selectable: {
    key: 'name',
    selectedValues: ['Madrid', 'Barcelona']
  }
};
protected readonly selectedCities = signal<City[]>([]);`,
    html: `<aesy-table
  [data]="CITIES"
  [config]="CITIES_TABLE_CONFIG"
  [paginationMetaConfig]="CITIES_PAGINATION"
  (selectionChange)="selectedCities.set($event)" />`
  },
  customCells: {
    ts: `protected readonly people = signal<Person[]>(PEOPLE);

protected readonly PEOPLE_TABLE_CONFIG: TableConfig<Person> = {
  tableName: 'people',
  columns: [
    { key: 'name', label: 'Nombre', type: 'text', sortable: true, filterable: true },
    // Columna de datos con plantilla: se sigue ordenando y filtrando por country
    { key: 'country', label: 'País', type: 'select', sortable: true, filterable: true, options: COUNTRY_OPTIONS },
    // Columna custom: su key no tiene que estar en Person y no se ordena ni filtra
    { key: 'actions', label: 'Acciones', type: 'custom', width: '200px', alignCell: 'right' }
  ]
};

protected onRemovePersonButtonClicked(person: Person): void {
  this.people.update(people => people.filter(currentPerson => currentPerson !== person));
}`,
    html: `<aesy-table [data]="people()" [config]="PEOPLE_TABLE_CONFIG" [paginationMetaConfig]="PEOPLE_PAGINATION">
  <!-- aesyTableCellRows solo sirve para que person llegue tipado como Person -->
  <ng-template aesyTableCell="country" [aesyTableCellRows]="people()" let-person>
    <span class="country-badge">{{ person.country }}</span>
  </ng-template>

  <ng-template aesyTableCell="actions" [aesyTableCellRows]="people()" let-person>
    <aesy-button type="tertiary" label="Ver" (buttonClick)="onViewPersonButtonClicked(person)" />
    <aesy-button type="danger" label="Quitar" (buttonClick)="onRemovePersonButtonClicked(person)" />
  </ng-template>
</aesy-table>`
  },
  expandable: {
    ts: `// Filas hijas dentro de la fila (subRowsKey): no hace falta más
protected readonly COUNTRIES_TABLE_CONFIG: TableConfig<Country, City> = {
  tableName: 'countries',
  columns: [{ key: 'name', label: 'País', type: 'text' }],
  expandable: {
    key: 'name',
    subRowsKey: 'cities',
    subTable: { tableName: 'cities', columns: CITY_COLUMNS }
  }
};

// Filas hijas bajo demanda: al desplegar se avisa, se llama al endpoint y se devuelve en subRows
protected readonly orders = signal<Record<string, Order[]>>({});

protected onPersonRowExpanded({ row, expanded }: TableRowExpandedChange<Person>): void {
  if (!expanded || this.orders()[row.name]) return;
  this.ordersService.getByPerson(row.name).subscribe(orders => this.orders.update(current => ({ ...current, [row.name]: orders })));
}`,
    html: `<aesy-table [data]="COUNTRIES" [config]="COUNTRIES_TABLE_CONFIG" />

<aesy-table
  [data]="PEOPLE"
  [config]="PEOPLE_TABLE_CONFIG"
  [subRows]="orders()"
  (rowExpandedChange)="onPersonRowExpanded($event)" />`
  },
  expanderCustomization: {
    ts: `// Icono y lado del botón de desplegar (por defecto, el chevron del acordeón a la izquierda)
expandable: { key: 'name', subRowsKey: 'cities', subTable: CITIES_TABLE_CONFIG, togglePosition: 'after', toggleIconSvg: AESY_ICON_PLUS }`,
    html: `<!-- Botón propio: toggle() despliega o pliega la fila y emite rowExpandedChange -->
<aesy-table [data]="COUNTRIES" [config]="COUNTRIES_TABLE_CONFIG">
  <ng-template aesyTableExpander [aesyTableExpanderRows]="COUNTRIES" let-country let-expanded="expanded" let-toggle="toggle">
    <aesy-button type="tertiary" [label]="expanded ? 'Ocultar' : 'Ver ciudades'" (buttonClick)="toggle()" />
  </ng-template>
</aesy-table>`,
    css: `/* El + gira 45° al desplegar y queda como una x */
aesy-table {
  --aesy-table-expander-icon-rotation-expanded: 45deg;
  --aesy-table-expander-icon-color: #6d28d9;
}`
  },
  themedTable: {
    html: `<aesy-table class="themed-table" [data]="PEOPLE" [config]="PEOPLE_TABLE_CONFIG">
  <ng-template aesyTableCell="role" [aesyTableCellRows]="PEOPLE" let-person>
    <span class="role-badge">{{ person.role }}</span>
  </ng-template>
  <ng-template aesyTableCell="actions" [aesyTableCellRows]="PEOPLE" let-person>
    <aesy-button type="secondary" label="Editar" (buttonClick)="onEditButtonClicked(person)" />
    <aesy-button type="danger" label="Borrar" (buttonClick)="onDeleteButtonClicked(person)" />
  </ng-template>
</aesy-table>`,
    css: `.themed-table {
  --aesy-table-header-background: #1e1b4b;
  --aesy-table-header-border-color: #1e1b4b;
  --aesy-table-header-text-color: #ffffff;
  --aesy-table-body-odd-background: #f5f3ff;
  --aesy-table-body-hover-background: #ddd6fe;
  --aesy-table-body-border-color: #ddd6fe;
  --aesy-table-text-color: #1e1b4b;
  --aesy-table-cell-height: 3rem;
}

/* Las etiquetas y botones están en tu plantilla: se estilan con tu CSS */
.themed-table .role-badge { background: #ede9fe; border-radius: 999px; color: #6d28d9; padding: 0.125rem 0.625rem; }`
  },
  customRows: {
    html: `<aesy-table [data]="PEOPLE" [config]="TEAM_TABLE_CONFIG" (rowClicked)="onPersonRowClicked($event)">
  <!-- Sustituye las celdas de las columnas de datos; let-columns y let-index también están disponibles -->
  <ng-template aesyTableRow [aesyTableRowRows]="PEOPLE" let-person>
    <strong>{{ person.name }}</strong> · {{ person.role }}
  </ng-template>
</aesy-table>

<aesy-table [data]="[]" [config]="TEAM_TABLE_CONFIG">
  <ng-template aesyTableEmpty>Aún no hay nadie en el equipo.</ng-template>
</aesy-table>`,
    ts: `const TEAM_TABLE_CONFIG: TableConfig<Person> = {
  tableName: 'team',
  columns: [/* … */],
  clickableRows: true, // emite rowClicked con clic o Enter (no con clics en botones, enlaces o campos)
  rowClass: person => (person.age >= 40 ? 'row-senior' : []) // clases por fila según sus datos
};`,
    css: `/* rowClass añade la clase dentro de la vista de la tabla: desde un componente hace falta ::ng-deep */
.team-table ::ng-deep .aesy-table-row.row-senior { background: #fef3c7; }`
  },
  draggable: {
    ts: `// En local la tabla ya reordena sus filas; rowOrderChange sirve para guardar el nuevo orden.
// Con serverSide: true eres tú quien reordena los datos:
protected onProductsRowOrderChanged(rowOrder: { previousIndex: number; currentIndex: number }): void {
  const reorderedProducts: Product[] = [...this.products()];
  moveItemInArray(reorderedProducts, rowOrder.previousIndex, rowOrder.currentIndex);
  this.products.set(reorderedProducts);
}`,
    html: `<aesy-table
  [data]="PEOPLE"
  [config]="{ tableName: 'people', columns: COLUMNS, draggableColumns: true, draggableRows: true }"
  [paginationMetaConfig]="PEOPLE_PAGINATION"
  (rowOrderChange)="onPeopleRowOrderChanged($event)" />`
  },
  serverSide: {
    ts: `private readonly httpClient = inject(HttpClient);

protected readonly products = signal<Product[]>([]);
protected readonly pagination = signal<PaginationMeta>({ page: 1, rowsPerPageCurrent: 5, total: 0 });

protected onProductsTableDataRequested(requestData: RequestData): void {
  // page y rowsPerPageCurrent son null si la tabla no tiene paginación
  const rowsPerPageCurrent = requestData.rowsPerPageCurrent ?? 0;
  const params = new HttpParams()
    .set('limit', rowsPerPageCurrent)
    .set('skip', ((requestData.page ?? 1) - 1) * rowsPerPageCurrent)
    .set('q', requestData.filters?.title ?? '')
    .set('sortBy', requestData.sortByKey ?? '')
    .set('order', requestData.sortDirection || 'asc');

  this.httpClient.get<ProductsResponse>('https://dummyjson.com/products/search', { params }).subscribe(response => {
    this.products.set(response.products);
    this.pagination.update(pagination => ({
      ...pagination,
      page: requestData.page ?? pagination.page,
      rowsPerPageCurrent: requestData.rowsPerPageCurrent ?? pagination.rowsPerPageCurrent,
      total: response.total
    }));
  });
}`,
    html: `<aesy-table
  [data]="products()"
  [config]="PRODUCTS_TABLE_CONFIG"
  [paginationMetaConfig]="pagination()"
  (requestData)="onProductsTableDataRequested($event)" />`
  },
  pagination: {
    ts: `protected readonly PEOPLE_PAGINATION: PaginationMeta = {
  page: 1,
  rowsPerPageCurrent: 4,
  total: PEOPLE.length,
  pageShown: true,
  pageLabelPrefix: 'Página',
  goFirstPageButtonShown: true,
  goLastPageButtonShown: true,
  previousLabel: 'Anterior',
  nextLabel: 'Siguiente',
  rowsPerPage: [
    { label: '4 filas', value: 4 },
    { label: '8 filas', value: 8 },
    { label: '12 filas', value: 12 }
  ]
};`
  },
  withoutPagination: {
    ts: `protected readonly CITIES_TABLE_CONFIG: TableConfig<City> = {
  tableName: 'cities',
  columns: [
    { key: 'name', label: 'Ciudad', type: 'text', sortable: true },
    { key: 'country', label: 'País', type: 'text', sortable: true },
    { key: 'population', label: 'Habitantes', type: 'number', sortable: true, alignCell: 'right' }
  ]
};`,
    html: `<!-- Sin [paginationMetaConfig]: se muestran todas las filas -->
<aesy-table [data]="CITIES" [config]="CITIES_TABLE_CONFIG" />`
  },
  theming: {
    css: `aesy-table {
  --aesy-table-container-height: 24rem;
  --aesy-table-header-background: #f5f6f8;
  --aesy-table-body-even-background: #fafaff;
  --aesy-table-body-hover-background: #ececfe;
  --aesy-table-border-color: #e1e4ea;
  --aesy-table-cell-padding-x: 1rem;
  --aesy-table-cell-height: 3rem;
  --aesy-table-text-size: 0.875rem;

  /* Los filtros de la cabecera son form controls: se ajustan con sus variables */
  --aesy-form-controls-height: 2rem;
}`
  }
} satisfies Record<string, DocSnippet>;
