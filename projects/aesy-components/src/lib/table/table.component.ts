import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDragPreview, CdkDragSortEvent, CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, contentChild, contentChildren, DestroyRef, effect, ElementRef, inject, input, output, QueryList, signal, TemplateRef, untracked, ViewChildren } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CheckboxComponent } from '../form-controls/checkbox/checkbox.component';
import { InputTextComponent } from '../form-controls/input-text/input-text.component';
import { SelectComponent } from '../form-controls/select/select.component';
import { AESY_ICON_SLIDERS } from '../icon/models/icon-paths/aesy-icon-sliders.const';
import { TableCellDirective } from './directives/table-cell.directive';
import { TableDetailDirective } from './directives/table-detail.directive';
import { TableEmptyDirective } from './directives/table-empty.directive';
import { TableExpanderDirective } from './directives/table-expander.directive';
import { TableRowDirective } from './directives/table-row.directive';
import { TableExpanderContext } from './models/table-expander-context.interface';
import { TableRowContext } from './models/table-row-context.interface';
import { AESY_ICON_CHEVRON_DOWN } from '../icon/models/icon-paths/aesy-icon-chevron-down.const';
import { RequestData } from './models/request-data.interface';
import { RowOrderChange } from './models/row-order-change.interface';
import { Row } from './models/row.type';
import { TableCellContext } from './models/table-cell-context.interface';
import { TableColumn } from './models/table-column.type';
import { TableConfig } from './models/table-config.interface';
import { TableRowExpandedChange } from './models/table-row-expanded-change.interface';
import { TableSubRowExpandedChange } from './models/table-sub-row-expanded-change.interface';
import { PaginationMeta } from './table-pagination/models/pagination-meta.interface';
import { TablePaginationComponent } from './table-pagination/table-pagination.component';

@Component({
  selector: 'aesy-table',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextComponent, SelectComponent, TablePaginationComponent, CheckboxComponent, CdkDropList, CdkDrag, CdkDragPreview, CdkDragPlaceholder, NgTemplateOutlet],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T extends object = Row> implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  readonly data = input<T[]>([]);
  readonly config = input.required<TableConfig<T>>();
  /** null = sin paginación: en local se muestran todas las filas. */
  readonly paginationMetaConfig = input<PaginationMeta | null>(null);
  /**
   * Filas hijas de las filas desplegables, por el valor de `expandable.key` de la fila padre. Para cargarlas bajo demanda:
   * al llegar `rowExpandedChange` se piden y se devuelve aquí un objeto nuevo. Mientras una fila desplegada no tenga entrada, muestra "Cargando…".
   */
  readonly subRows = input<Record<string, readonly object[]>>({});

  readonly requestData = output<RequestData>();
  /** Una fila de esta tabla se ha desplegado o plegado. */
  readonly rowExpandedChange = output<TableRowExpandedChange<T>>();
  /** Una fila de una subtabla (a cualquier nivel) se ha desplegado o plegado. */
  readonly subRowExpandedChange = output<TableSubRowExpandedChange>();
  readonly selectionChange = output<T[]>();
  readonly currentPageChange = output<number>();
  readonly rowsPerPageChange = output<number>();
  readonly rowOrderChange = output<RowOrderChange<T>>();
  /** Se ha hecho clic (o Enter) en una fila. Solo con `config.clickableRows`. */
  readonly rowClicked = output<T>();

  protected readonly DRAG_ICON_PATH: string = AESY_ICON_SLIDERS;

  protected readonly tableForNoServerSide = signal<{
    originalData: T[];
    filteredData: T[];
    config: TableConfig<T>;
    paginationMetaConfig: PaginationMeta | null;
  } | null>(null);

  private readonly dataToSendBackWhenEvents = signal<RequestData>({
    page: null,
    rowsPerPageCurrent: null,
    filters: {},
    sortByKey: '',
    sortDirection: 'asc'
  });

  protected readonly isServerSide = computed(() => this.config()?.serverSide ?? false);
  /** Sin columnas filtrables no se reserva el hueco de los filtros en la cabecera. */
  protected readonly hasFilterableColumns = computed(() => this.config().columns.some(column => column.filterable));
  private readonly cellTemplates = contentChildren<TableCellDirective<T>>(TableCellDirective);
  /** Plantillas `aesyTableCell` que le pasa la tabla padre (con `aesyTableCellTable`) cuando esta es una subtabla. */
  readonly inheritedCellTemplates = input<readonly TableCellDirective<Record<string, unknown>>[]>([]);
  protected readonly detailTemplate = contentChild(TableDetailDirective);
  private readonly declaredRowTemplates = contentChildren<TableRowDirective<T>>(TableRowDirective);
  /** Plantillas `aesyTableRow` que le pasa la tabla padre (con `aesyTableRowTable`) cuando esta es una subtabla. */
  readonly inheritedRowTemplates = input<readonly TableRowDirective<Record<string, unknown>>[]>([]);
  protected readonly rowTemplatesForSubTables = computed(() => [...this.inheritedRowTemplates(), ...this.declaredRowTemplates()] as unknown as readonly TableRowDirective<Record<string, unknown>>[]);
  protected readonly rowTemplate = computed(() => {
    const declaredHere = new Set<unknown>(this.declaredRowTemplates());
    const tableName = this.config().tableName;
    return this.rowTemplatesForSubTables().find(rowTemplate => (rowTemplate.tableName() ? rowTemplate.tableName() === tableName : declaredHere.has(rowTemplate))) as unknown as TableRowDirective<T> | undefined;
  });
  protected readonly emptyTemplate = contentChild(TableEmptyDirective);
  /** Columna ficticia que ocupa el sitio de las columnas de datos cuando hay plantilla `aesyTableRow`. */
  protected readonly freeRowKey = '__row__';
  /** Todas las plantillas de celda visibles desde aquí: las heredadas y las declaradas en esta tabla. */
  protected readonly cellTemplatesForSubTables = computed(() => [...this.inheritedCellTemplates(), ...this.cellTemplates()] as unknown as readonly TableCellDirective<Record<string, unknown>>[]);
  protected readonly cellTemplatesByColumnKey = computed(() => {
    const declaredHere = new Set<unknown>(this.cellTemplates());
    const tableName = this.config().tableName;
    const applicableTemplates = this.cellTemplatesForSubTables().filter(cellTemplate => (cellTemplate.tableName() ? cellTemplate.tableName() === tableName : declaredHere.has(cellTemplate)));
    return new Map<string, TemplateRef<TableCellContext<T>>>(applicableTemplates.map(cellTemplate => [cellTemplate.columnKey(), cellTemplate.templateRef as unknown as TemplateRef<TableCellContext<T>>]));
  });
  protected readonly expandableKey = '__expandable__';
  /** Valores de `expandable.key` de las filas desplegadas. Empieza con `expandable.expandedValues`. */
  protected readonly expandedKeys = signal<Set<unknown>>(new Set());
  protected readonly subTableConfig = computed(() => this.config().expandable?.subTable);
  protected readonly selectableKey = '__selectable__';
  /** Valores de `selectable.key` de las filas seleccionadas. Empieza con `selectable.selectedValues`. */
  protected readonly selectedKeys = signal<Set<unknown>>(new Set());
  /**
   * Objeto de cada fila seleccionada, por su clave. Se guarda al marcarla para que `selectionChange` pueda devolverla
   * aunque en modo servidor el usuario cambie de página y ya no esté en `data`.
   */
  private readonly selectedRowsByKey = new Map<unknown, T>();
  protected filters: Record<string, FormControl<string>> = {};

  private configInitialized = false;
  private filtersInitialized = false;
  private applyPersistInitialized = false;
  /** Último paginationMetaConfig recibido por input, para distinguir un cambio del consumidor de los internos. */
  private lastPaginationMetaConfigInput: PaginationMeta | null = null;

  private readonly orderedColumns = signal<TableColumn<T>[]>([]);

  // === NUEVO: SIGNALS PARA EL DRAG & DROP ESTILO AG-GRID ===
  protected readonly draggedColKey = signal<string | null>(null);
  protected readonly draggedInitialIdx = signal<number>(-1);
  protected readonly draggedCurrentIdx = signal<number>(-1);

  constructor() {
    effect(() => this.initConfigurations());
    effect(() => this.initFilters());
    effect(() => this.applyPersistFilters());
    effect(() => this.initColumnOrder());
    effect(() => this.syncLocalDataWithInput());
    effect(() => this.syncLocalPaginationWithInput());
    effect(() => this.syncSelectedRowsWithData());
  }

  // --- MÉTODOS DE INIT ---
  private initConfigurations(): void {
    if (this.configInitialized) return;
    this.configInitialized = true;
    const config = this.config();
    this.selectedKeys.set(new Set(config?.selectable?.selectedValues ?? []));
    this.expandedKeys.set(new Set(config?.expandable?.expandedValues ?? []));
    if (!config?.serverSide && !this.tableForNoServerSide()) {
      this.tableForNoServerSide.set({
        originalData: this.data(),
        filteredData: this.data(),
        config: this.config(),
        paginationMetaConfig: this.paginationMetaConfig()
      });
      this.lastPaginationMetaConfigInput = this.paginationMetaConfig();
      // Sin esto, la primera pintada muestra todas las filas hasta el primer filtro, orden o cambio de página
      this.applyClientFilteringSortAndPagination();
    } else {
      this.dataToSendBackWhenEvents.set({
        page: this.paginationMetaConfig()?.page ?? null,
        rowsPerPageCurrent: this.paginationMetaConfig()?.rowsPerPageCurrent ?? null,
        filters: {},
        sortByKey: this.config()?.sortByKey,
        sortDirection: this.config()?.sortDirection
      });
    }
  }

  /** Modo local: si cambia `data` (carga asíncrona, altas, bajas…) se vuelven a aplicar filtros, orden y página. */
  private syncLocalDataWithInput(): void {
    const data = this.data();
    if (this.isServerSide()) return;

    const localTable = untracked(() => this.tableForNoServerSide());
    if (!localTable || localTable.originalData === data) return;

    this.tableForNoServerSide.set({ ...localTable, originalData: data });
    untracked(() => this.applyClientFilteringSortAndPagination());
  }

  /** Modo local: si el consumidor cambia `paginationMetaConfig` (página, filas por página, textos…) se aplica. */
  private syncLocalPaginationWithInput(): void {
    const paginationMetaConfig = this.paginationMetaConfig();
    if (this.isServerSide() || paginationMetaConfig === this.lastPaginationMetaConfigInput) return;

    const localTable = untracked(() => this.tableForNoServerSide());
    if (!localTable) return;

    this.lastPaginationMetaConfigInput = paginationMetaConfig;
    this.tableForNoServerSide.set({ ...localTable, paginationMetaConfig });
    untracked(() => this.applyClientFilteringSortAndPagination());
  }

  /**
   * Guarda los objetos de las filas seleccionadas que llegan en `data`: las de `selectedValues` en cuanto se cargan
   * y versiones más recientes de las ya guardadas. En local `data` es el total, así que las que desaparecen se quitan.
   */
  private syncSelectedRowsWithData(): void {
    const rows = this.data();
    if (!this.config().selectable) return;

    const selectedKeys = untracked(() => this.selectedKeys());
    if (!this.isServerSide()) this.selectedRowsByKey.clear();
    for (const row of rows) {
      const rowSelectionKey = this.getRowSelectionKey(row);
      if (selectedKeys.has(rowSelectionKey)) this.selectedRowsByKey.set(rowSelectionKey, row);
    }
  }

  private initFilters(): void {
    if (this.filtersInitialized) return;
    this.filtersInitialized = true;
    this.filters = {};

    for (const column of this.config().columns) {
      if (!column.filterable) continue;
      const control = new FormControl('', { nonNullable: true });
      this.filters[column.key] = control;

      control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        const filtersValues = Object.fromEntries(Object.entries(this.filters).map(([key, control]) => [key, control.value]));
        if (this.isServerSide()) {
          this.dataToSendBackWhenEvents.update(x => ({ ...x, filters: filtersValues }));
          this.emitRequest();
        } else {
          this.applyClientFilteringSortAndPagination();
        }
        if (this.config().persistFilters) {
          this.updateQueryParams();
        }
      });
    }
  }

  private applyPersistFilters(): void {
    if (this.applyPersistInitialized) return;
    this.applyPersistInitialized = true;
    const config = this.config();
    if (!config.persistFilters) return;

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if (!this.loadFiltersFromUrlAndReturnIfThereAreFilters(params)) return;
      const filtersValues = Object.fromEntries(Object.entries(this.filters).map(([key, control]) => [key, control.value]));

      if (config.serverSide) {
        this.dataToSendBackWhenEvents.update(x => ({ ...x, filters: filtersValues }));
        this.emitRequest();
      } else {
        this.applyClientFilteringSortAndPagination();
      }
    });
  }

  private initColumnOrder(): void {
    if (this.orderedColumns().length > 0) return;
    this.orderedColumns.set([...this.config().columns]);
  }

  protected get columns(): TableColumn<T>[] {
    const { selectable, expandable } = this.config();
    const expanderColumn: TableColumn<T> | null = expandable ? { key: this.expandableKey, label: expandable.headerLabel ?? '', type: 'custom', width: expandable.toggleWidth ?? '3rem' } : null;
    const isExpanderBefore = expandable?.togglePosition !== 'after';
    const leadingColumns: TableColumn<T>[] = [];
    if (expanderColumn && isExpanderBefore) leadingColumns.push(expanderColumn);
    if (selectable) leadingColumns.push({ key: this.selectableKey, label: selectable.headerLabel ?? '', type: 'custom', width: selectable.width ?? '3rem' });
    return [...leadingColumns, ...this.orderedColumns(), ...(expanderColumn && !isExpanderBefore ? [expanderColumn] : [])];
  }

  protected readonly expanderIconSvg = computed(() => this.config().expandable?.toggleIconSvg ?? AESY_ICON_CHEVRON_DOWN);
  protected readonly expanderTemplate = contentChild(TableExpanderDirective);

  protected getExpanderContext(row: T): TableExpanderContext<T> {
    return { $implicit: row, expanded: this.isExpanded(row), toggle: () => this.onExpanderButtonClicked(row) };
  }

  // === NUEVO: COLUMNAS REACTIVAS PARA EL TBODY ===
  protected readonly bodyColumns = computed(() => {
    const cols = [...this.columns];
    const dragKey = this.draggedColKey();
    const from = this.draggedInitialIdx();
    const to = this.draggedCurrentIdx();

    if (dragKey && from !== -1 && to !== -1 && from !== to) {
      moveItemInArray(cols, from, to);
    }
    if (!this.rowTemplate()) return cols;
    const specialKeys = [this.expandableKey, this.selectableKey];
    const firstDataColumnIndex = cols.findIndex(col => !specialKeys.includes(col.key));
    const freeRowColumn: TableColumn<T> = { key: this.freeRowKey, label: '', type: 'custom' };
    const specialCols = cols.filter(col => specialKeys.includes(col.key));
    return [...specialCols.slice(0, firstDataColumnIndex), freeRowColumn, ...specialCols.slice(firstDataColumnIndex)];
  });

  protected getRowContext(row: T, index: number): TableRowContext<T> {
    return { $implicit: row, index, columns: this.orderedColumns() };
  }

  protected getRowClasses(row: T): string | string[] {
    return this.config().rowClass?.(row) ?? [];
  }

  protected onRowClicked(event: MouseEvent, row: T): void {
    if (!this.config().clickableRows) return;
    const isInteractiveTarget = (event.target as Element).closest('button, a, input, select, textarea, label, [role="button"], aesy-checkbox, aesy-select, aesy-input-text');
    if (!isInteractiveTarget) this.rowClicked.emit(row);
  }

  protected onRowEnterPressed(event: Event, row: T): void {
    if (this.config().clickableRows && event.target === event.currentTarget) this.rowClicked.emit(row);
  }

  readonly displayedData = computed((): T[] => {
    return this.config().serverSide ? this.data() : (this.tableForNoServerSide()?.filteredData ?? []);
  });

  protected get sortKey(): string | undefined | null {
    return this.isServerSide() ? this.config()?.sortByKey : this.tableForNoServerSide()?.config?.sortByKey;
  }

  protected get sortDirection(): 'asc' | 'desc' | '' | undefined | null {
    return this.isServerSide() ? this.config().sortDirection : this.tableForNoServerSide()?.config?.sortDirection;
  }

  // ============================================================
  // FIXED COLUMNS
  // ============================================================

  @ViewChildren('headerElement') headerElements!: QueryList<ElementRef<HTMLElement>>;

  private resizeObserver?: ResizeObserver;
  private fixedLeftOffsets = new Map<string, number>();
  private columnWidths = new Map<string, number>();

  ngAfterViewInit(): void {
    this.calculateFixedOffsets();
    // Sin ResizeObserver (SSR, jsdom) las columnas fijas se recalculan solo al cambiar las cabeceras
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.calculateFixedOffsets());
      this.destroyRef.onDestroy(() => this.resizeObserver?.disconnect());
    }
    this.observeHeaderElements();

    this.headerElements.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.observeHeaderElements();
      queueMicrotask(() => this.calculateFixedOffsets());
    });
  }

  private observeHeaderElements(): void {
    if (!this.resizeObserver) return;
    this.resizeObserver.disconnect();
    this.headerElements.forEach(header => {
      this.resizeObserver?.observe(header.nativeElement);
    });
  }

  protected calculateFixedOffsets(): void {
    this.fixedLeftOffsets.clear();
    this.columnWidths.clear();
    let accumulatedLeft = 0;

    this.headerElements.forEach((element, index) => {
      const column = this.columns[index];
      if (!column) return;
      const width = element.nativeElement.getBoundingClientRect().width;
      this.columnWidths.set(column.key, width);

      if (column.fixed) {
        this.fixedLeftOffsets.set(column.key, accumulatedLeft);
        accumulatedLeft += width;
      }
    });

    this.cdr.markForCheck();
  }

  protected getFixedColumnLeft(column: TableColumn<T>): string {
    return `${this.fixedLeftOffsets.get(column.key) ?? 0}px`;
  }

  protected getColumnWidth(column: TableColumn<T>): number | undefined {
    return this.columnWidths.get(column.key);
  }

  protected getColumnDragWidth(column: TableColumn<T>): number {
    const measuredWidth = this.columnWidths.get(column.key);
    if (measuredWidth && measuredWidth > 0) return measuredWidth;

    const elementIndex = this.columns.findIndex(x => x.key === column.key);
    const element = this.headerElements?.get(elementIndex);

    if (element) {
      const width = element.nativeElement.getBoundingClientRect().width;
      if (width > 0) return width;
    }

    if (typeof column.width === 'number') return column.width;
    if (typeof column.width === 'string') {
      const parsed = parseFloat(column.width);
      if (!Number.isNaN(parsed)) return parsed;
    }
    return 0;
  }

  // ============================================================
  // DRAG AND DROP (REFACTORIZADO A SEGUIMIENTO POR INDEX)
  // ============================================================

  protected onDragStarted(event: CdkDragStart, column: TableColumn<T>): void {
    const idx = this.columns.findIndex(c => c.key === column.key);
    if (idx !== -1) {
      this.draggedColKey.set(column.key);
      this.draggedInitialIdx.set(idx);
      this.draggedCurrentIdx.set(idx);
    }
  }

  protected onColumnSorted(event: CdkDragSortEvent<TableColumn<T>>): void {
    this.draggedCurrentIdx.set(event.currentIndex);
  }

  protected onColumnDragEnded(): void {
    this.clearDragState();
    this.cdr.markForCheck();
  }

  private clearDragState(): void {
    this.draggedColKey.set(null);
    this.draggedInitialIdx.set(-1);
    this.draggedCurrentIdx.set(-1);
  }

  protected dropColumn(event: CdkDragDrop<TableColumn<T>[]>): void {
    const { selectable, expandable } = this.config();
    const leadingColumnsCount = (selectable ? 1 : 0) + (expandable && expandable.togglePosition !== 'after' ? 1 : 0);
    const previousIndex = event.previousIndex - leadingColumnsCount;
    const currentIndex = event.currentIndex - leadingColumnsCount;

    this.clearDragState();

    if (previousIndex < 0 || currentIndex < 0) return;
    if (previousIndex >= this.orderedColumns().length || currentIndex >= this.orderedColumns().length) return;
    if (previousIndex === currentIndex) return;

    this.orderedColumns.update(columns => {
      const reorderedColumns = [...columns];
      moveItemInArray(reorderedColumns, previousIndex, currentIndex);
      return reorderedColumns;
    });

    // 1. Forzamos a Angular a reordenar el DOM de forma síncrona INMEDIATAMENTE
    this.cdr.detectChanges();
    // 2. Ahora que el DOM y los datos están sincronizados, recalculamos
    this.calculateFixedOffsets();
  }

  protected dropRow(event: CdkDragDrop<T[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    if (this.isServerSide()) {
      this.rowOrderChange.emit({
        previousIndex: event.previousIndex,
        currentIndex: event.currentIndex,
        row: this.displayedData()[event.previousIndex]
      });
    } else {
      this.tableForNoServerSide.update(state => {
        if (!state) return state;

        const newFilteredData = [...state.filteredData];
        const movedItem = newFilteredData[event.previousIndex];

        moveItemInArray(newFilteredData, event.previousIndex, event.currentIndex);

        const newOriginalData = [...state.originalData];
        const activeFilters = Object.values(this.filters).some(c => !!c.value);
        if (!activeFilters && !this.sortKey) {
          moveItemInArray(newOriginalData, event.previousIndex, event.currentIndex);
        }

        this.rowOrderChange.emit({
          previousIndex: event.previousIndex,
          currentIndex: event.currentIndex,
          row: movedItem
        });

        return { ...state, originalData: newOriginalData, filteredData: newFilteredData };
      });
    }
  }

  protected isColumnDragDisabled(column: TableColumn<T>): boolean {
    return column.key === this.selectableKey || column.key === this.expandableKey || !!column.fixed;
  }

  // ============================================================
  // LÓGICA DE FILTROS, ORDENACIÓN Y UI
  // ============================================================

  protected loadFiltersFromUrlAndReturnIfThereAreFilters(params: Record<string, string | string[] | undefined>): boolean {
    let isThereFilter = false;
    for (const key of Object.keys(this.filters)) {
      const namespacedKey = `${this.config().tableName}${key}`;
      const value = params[namespacedKey];
      if (value !== undefined && !Array.isArray(value)) {
        this.filters[key].setValue(value, { emitEvent: false });
        isThereFilter = true;
      }
    }
    return isThereFilter;
  }

  protected updateQueryParams(): void {
    const queryParams: Record<string, string | null> = {};
    for (const [key, control] of Object.entries(this.filters)) {
      const value = control.value?.trim();
      queryParams[`${this.config().tableName}${key}`] = value || null;
    }
    void this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' });
  }

  /** Sin paginación la petición no limita las filas: page y rowsPerPageCurrent van a null. */
  protected emitRequest(): void {
    const requestData = this.dataToSendBackWhenEvents();
    const paginationMetaConfig = this.paginationMetaConfig();
    if (!paginationMetaConfig) return this.requestData.emit({ ...requestData, page: null, rowsPerPageCurrent: null });
    this.requestData.emit({ ...requestData, page: requestData.page ?? paginationMetaConfig.page, rowsPerPageCurrent: requestData.rowsPerPageCurrent ?? paginationMetaConfig.rowsPerPageCurrent });
  }

  /** Las columnas custom (incluida la de casillas) no se ordenan. */
  protected isColumnSortable(column: TableColumn<T>): boolean {
    return column.type !== 'custom' && column.sortable !== false;
  }

  protected changeSort(column: TableColumn<T>): void {
    if (!this.isColumnSortable(column)) return;
    const newSortKey: string = column.key;
    const newSortDirection = this.sortKey !== newSortKey ? 'asc' : this.sortDirection === 'asc' ? 'desc' : 'asc';

    if (this.isServerSide()) {
      this.dataToSendBackWhenEvents.update(x => ({ ...x, sortByKey: newSortKey, sortDirection: newSortDirection }));
      this.emitRequest();
    } else {
      this.tableForNoServerSide.update(config => (config ? { ...config, config: { ...config.config, sortByKey: newSortKey, sortDirection: newSortDirection } } : null));
      this.applyClientFilteringSortAndPagination();
    }
  }

  protected changePage(newPage: number): void {
    if (this.isServerSide()) {
      this.dataToSendBackWhenEvents.update(x => ({ ...x, page: newPage }));
      this.emitRequest();
    } else {
      this.tableForNoServerSide.update(config => (config?.paginationMetaConfig ? { ...config, paginationMetaConfig: { ...config.paginationMetaConfig, page: newPage } } : config));
      this.applyClientFilteringSortAndPagination();
    }
  }

  protected changeRowsPerPage(newRowsPerPage: number): void {
    if (this.isServerSide()) {
      this.dataToSendBackWhenEvents.update(x => ({ ...x, rowsPerPageCurrent: newRowsPerPage }));
      this.emitRequest();
    } else {
      this.tableForNoServerSide.update(config => (config?.paginationMetaConfig ? { ...config, paginationMetaConfig: { ...config.paginationMetaConfig, rowsPerPageCurrent: newRowsPerPage } } : config));
      this.applyClientFilteringSortAndPagination();
    }
  }

  protected applyClientFilteringSortAndPagination(): void {
    let filtered = [...(this.tableForNoServerSide()?.originalData || [])];

    for (const [key, control] of Object.entries(this.filters)) {
      const value = control.value?.trim()?.toLowerCase();
      if (!value) continue;
      filtered = filtered.filter(item =>
        String(this.getCellValue(item, key) ?? '')
          .toLowerCase()
          .includes(value)
      );
    }

    const sortKey = this.sortKey;
    const sortDirection = this.sortDirection;
    if (sortKey && sortDirection) {
      filtered.sort((a, b) => this.compareValues(this.getCellValue(a, sortKey), this.getCellValue(b, sortKey), sortDirection));
    }

    this.tableForNoServerSide.update(config => {
      if (!config) return null;
      if (!config.paginationMetaConfig) return { ...config, filteredData: filtered };
      const total = filtered.length;
      const rowsPerPage = config.paginationMetaConfig.rowsPerPageCurrent;
      const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
      const page = Math.min(Math.max(config.paginationMetaConfig.page, 1), totalPages);
      const start = (page - 1) * rowsPerPage;

      return {
        ...config,
        filteredData: filtered.slice(start, start + rowsPerPage),
        paginationMetaConfig: { ...config.paginationMetaConfig, total, page }
      };
    });
  }

  /** Lee el valor de una columna con una clave en texto. Así `T` puede ser una interfaz y no solo un `Record<string, unknown>`. */
  protected getCellValue(row: T, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }

  private compareValues(a: unknown, b: unknown, direction: 'asc' | 'desc' | ''): number {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    let result = 0;
    if (a > b) result = 1;
    else if (a < b) result = -1;
    return direction === 'asc' ? result : -result;
  }

  protected isExpanded(row: T): boolean {
    return this.expandedKeys().has(this.getRowExpansionKey(row));
  }

  protected onExpanderButtonClicked(row: T): void {
    const rowExpansionKey = this.getRowExpansionKey(row);
    const expanded = !this.expandedKeys().has(rowExpansionKey);
    this.expandedKeys.update(expandedKeys => {
      const updatedKeys = new Set(this.config().expandable?.singleExpansion ? [] : expandedKeys);
      if (expanded) updatedKeys.add(rowExpansionKey);
      else updatedKeys.delete(rowExpansionKey);
      return updatedKeys;
    });
    this.rowExpandedChange.emit({ row, expanded });
  }

  /** Filas hijas de una fila: las de su propiedad `subRowsKey` o, si no las tiene, las del input `subRows`. `undefined` = aún sin cargar. */
  protected getSubRows(row: T): Record<string, unknown>[] | undefined {
    const subRowsKey = this.config().expandable?.subRowsKey;
    const ownSubRows = subRowsKey ? this.getCellValue(row, subRowsKey) : undefined;
    return (ownSubRows ?? this.subRows()[String(this.getRowExpansionKey(row))]) as Record<string, unknown>[] | undefined;
  }

  protected onSubTableRowExpandedChanged(event: TableRowExpandedChange<Record<string, unknown>>, parentRow: T): void {
    this.subRowExpandedChange.emit({ ...event, parentRows: [parentRow] });
  }

  protected onSubTableSubRowExpandedChanged(event: TableSubRowExpandedChange, parentRow: T): void {
    this.subRowExpandedChange.emit({ ...event, parentRows: [parentRow, ...event.parentRows] });
  }

  private getRowExpansionKey(row: T): unknown {
    const expansionKey = this.config().expandable?.key;
    return expansionKey ? this.getCellValue(row, expansionKey) : row;
  }

  protected toggleRowSelection(row: T, isChecked: boolean): void {
    const rowSelectionKey = this.getRowSelectionKey(row);
    this.selectedKeys.update(selectedKeys => {
      const updatedKeys = new Set(selectedKeys);
      if (isChecked) updatedKeys.add(rowSelectionKey);
      else updatedKeys.delete(rowSelectionKey);
      return updatedKeys;
    });
    if (isChecked) this.selectedRowsByKey.set(rowSelectionKey, row);
    else this.selectedRowsByKey.delete(rowSelectionKey);
    this.selectionChange.emit(Array.from(this.selectedRowsByKey.values()));
  }

  protected isSelected(row: T): boolean {
    return this.selectedKeys().has(this.getRowSelectionKey(row));
  }

  /** Identifica la fila por `selectable.key`; así la selección sobrevive a que `data` traiga objetos nuevos. */
  private getRowSelectionKey(row: T): unknown {
    const selectionKey = this.config().selectable?.key;
    return selectionKey ? this.getCellValue(row, selectionKey) : row;
  }

  protected getSortIcon(key: string): string {
    if (this.sortKey !== key) return '';
    return this.sortDirection === 'asc' ? '▲' : this.sortDirection === 'desc' ? '▼' : '';
  }
}
