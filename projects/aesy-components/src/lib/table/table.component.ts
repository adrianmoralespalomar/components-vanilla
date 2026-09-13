import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDragPreview, CdkDragSortEvent, CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, DestroyRef, effect, ElementRef, inject, input, output, QueryList, signal, ViewChildren } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CheckboxComponent } from '../form-controls/checkbox/checkbox.component';
import { InputTextComponent } from '../form-controls/input-text/input-text.component';
import { SelectComponent } from '../form-controls/select/select.component';
import { RequestData } from './models/request-data.interface';
import { Row } from './models/row.type';
import { TableColumn } from './models/table-column.interface';
import { TableConfig } from './models/table-config.interface';
import { PaginationMeta } from './table-pagination/models/pagination-meta.interface';
import { TablePaginationComponent } from './table-pagination/table-pagination.component';

@Component({
  selector: 'aesy-table',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextComponent, SelectComponent, TablePaginationComponent, CheckboxComponent, CdkDropList, CdkDrag, CdkDragPreview, CdkDragPlaceholder],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T extends Row = Row> implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  readonly data = input<T[]>([]);
  readonly config = input.required<TableConfig<T>>();
  readonly paginationMetaConfig = input.required<PaginationMeta>();

  readonly requestData = output<RequestData>();
  readonly selectionChange = output<T[]>();
  readonly currentPageChange = output<number>();
  readonly rowsPerPageChange = output<number>();
  readonly rowOrderChange = output<{ previousIndex: number; currentIndex: number; row: T }>();

  protected readonly tableForNoServerSide = signal<{
    originalData: T[];
    filteredData: T[];
    config: TableConfig<T>;
    paginationMetaConfig: PaginationMeta;
  } | null>(null);

  private readonly dataToSendBackWhenEvents = signal<RequestData>({
    page: 1,
    rowsPerPageCurrent: 10,
    filters: {},
    sortByKey: '',
    sortDirection: 'asc'
  });

  protected readonly isServerSide = computed(() => this.config()?.serverSide ?? false);
  protected readonly selectableKey = '__selectable__';
  protected selectedRows = new Set<T>();
  protected filters: Record<string, FormControl<string>> = {};

  private configInitialized = false;
  private filtersInitialized = false;
  private applyPersistInitialized = false;

  private readonly orderedColumns = signal<TableColumn<T>[]>([]);

  // === NUEVO: SIGNALS PARA EL DRAG & DROP ESTILO AG-GRID ===
  protected readonly draggedColKey = signal<string | null>(null);
  protected readonly draggedInitialIdx = signal<number>(-1);
  protected readonly draggedCurrentIdx = signal<number>(-1);

  constructor() {
    effect(() => this.initConfigurations());
    effect(() => this.initFilters());
    effect(() => this.applyPersistFilters());
    effect(() => this.initColumnOrder(), { allowSignalWrites: true });
  }

  // --- MÉTODOS DE INIT ---
  private initConfigurations(): void {
    if (this.configInitialized) return;
    this.configInitialized = true;
    const config = this.config();
    if (!config?.serverSide && !this.tableForNoServerSide()) {
      this.tableForNoServerSide.set({
        originalData: this.data(),
        filteredData: this.data(),
        config: this.config(),
        paginationMetaConfig: this.paginationMetaConfig()
      });
    } else {
      this.dataToSendBackWhenEvents.set({
        page: this.paginationMetaConfig().page,
        rowsPerPageCurrent: this.paginationMetaConfig().rowsPerPageCurrent,
        filters: {},
        sortByKey: this.config()?.sortByKey,
        sortDirection: this.config()?.sortDirection
      });
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
    return [{ key: this.selectableKey as keyof T & string, label: 'Pick', type: 'text' }, ...columns];
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
    this.resizeObserver = new ResizeObserver(() => this.calculateFixedOffsets());
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

  protected emitRequest(): void {
    this.requestData.emit(this.dataToSendBackWhenEvents());
  }

  protected changeSort(column: TableColumn<T>): void {
    if (column.key === this.selectableKey || column.sortable === false) return;
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
      this.tableForNoServerSide.update(config => (config ? { ...config, paginationMetaConfig: { ...config.paginationMetaConfig, page: newPage } } : null));
      this.applyClientFilteringSortAndPagination();
    }
  }

  protected changeRowsPerPage(newRowsPerPage: number): void {
    if (this.isServerSide()) {
      this.dataToSendBackWhenEvents.update(x => ({ ...x, rowsPerPageCurrent: newRowsPerPage }));
      this.emitRequest();
    } else {
      this.tableForNoServerSide.update(config => (config ? { ...config, paginationMetaConfig: { ...config.paginationMetaConfig, rowsPerPageCurrent: newRowsPerPage } } : null));
      this.applyClientFilteringSortAndPagination();
    }
  }

  protected applyClientFilteringSortAndPagination(): void {
    let filtered = [...(this.tableForNoServerSide()?.originalData || [])];

    for (const [key, control] of Object.entries(this.filters)) {
      const value = control.value?.trim()?.toLowerCase();
      if (!value) continue;
      filtered = filtered.filter(item =>
        String(item[key] ?? '')
          .toLowerCase()
          .includes(value)
      );
    }

    const sortKey = this.sortKey;
    const sortDirection = this.sortDirection;
    if (sortKey && sortDirection) {
      filtered.sort((a, b) => this.compareValues(a[sortKey], b[sortKey], sortDirection));
    }

    this.tableForNoServerSide.update(config => {
      if (!config || !config.paginationMetaConfig) return null;
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
    if (isChecked) this.selectedRows.add(row);
    else this.selectedRows.delete(row);
    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  protected isSelected(row: T): boolean {
    return this.selectedRows.has(row);
  }

  protected getSortIcon(key: string): string {
    if (this.sortKey !== key) return '';
    return this.sortDirection === 'asc' ? '▲' : this.sortDirection === 'desc' ? '▼' : '';
  }
}
