import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDragPreview, CdkDragSortEvent, CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, contentChildren, DestroyRef, effect, ElementRef, inject, input, output, QueryList, signal, TemplateRef, untracked, ViewChildren } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CheckboxComponent } from '../form-controls/checkbox/checkbox.component';
import { InputTextComponent } from '../form-controls/input-text/input-text.component';
import { SelectComponent } from '../form-controls/select/select.component';
import { TableCellDirective } from './directives/table-cell.directive';
import { RequestData } from './models/request-data.interface';
import { RowOrderChange } from './models/row-order-change.interface';
import { Row } from './models/row.type';
import { TableCellContext } from './models/table-cell-context.interface';
import { TableColumn } from './models/table-column.type';
import { TableConfig } from './models/table-config.interface';
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

  readonly requestData = output<RequestData>();
  readonly selectionChange = output<T[]>();
  readonly currentPageChange = output<number>();
  readonly rowsPerPageChange = output<number>();
  readonly rowOrderChange = output<RowOrderChange<T>>();

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
  protected readonly cellTemplatesByColumnKey = computed(
    () => new Map<string, TemplateRef<TableCellContext<T>>>(this.cellTemplates().map(cellTemplate => [cellTemplate.columnKey(), cellTemplate.templateRef]))
  );
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
    const columns = this.orderedColumns();
    if (!this.config().selectable) return columns;
    return [{ key: this.selectableKey, label: this.config().selectable?.headerLabel ?? '', type: 'custom' }, ...columns];
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
    return cols;
  });

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
    const selectableOffset = this.config().selectable ? 1 : 0;
    const previousIndex = event.previousIndex - selectableOffset;
    const currentIndex = event.currentIndex - selectableOffset;

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
    return column.key === this.selectableKey || !!column.fixed;
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
