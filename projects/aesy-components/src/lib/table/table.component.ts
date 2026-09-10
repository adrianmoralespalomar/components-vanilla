import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  imports: [ReactiveFormsModule, InputTextComponent, SelectComponent, TablePaginationComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T extends Row = Row> {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly data = input<T[]>([]);
  readonly config = input.required<TableConfig<T>>();
  readonly paginationMetaConfig = input.required<PaginationMeta>();

  readonly requestData = output<RequestData>();
  readonly selectionChange = output<T[]>();
  readonly currentPageChange = output<number>();
  readonly rowsPerPageChange = output<number>();

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

  constructor() {
    effect(() => this.initConfigurations());
    effect(() => this.initFilters());
    effect(() => this.applyPersistFilters());
  }

  private initConfigurations(): void {
    //Supongo q esto es para no volver a ejecutar esta logica ... rarete
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
      const control = new FormControl('', {
        nonNullable: true
      });

      this.filters[column.key] = control;
      control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        const filtersValues = Object.fromEntries(Object.entries(this.filters).map(([key, control]) => [key, control.value]));
        if (this.isServerSide()) {
          this.dataToSendBackWhenEvents.update(x => ({
            ...x,
            filters: filtersValues
          }));
          this.emitRequest();
        } else {
          this.applyClientFilteringSortAndPagination();
        }

        if (this.config().persistFilters) this.updateQueryParams();
      });
    }
  }

  private applyPersistFilters() {
    if (this.applyPersistInitialized) return;
    this.applyPersistInitialized = true;
    const config = this.config();
    if (config.persistFilters) {
      this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
        if (!this.loadFiltersFromUrlAndReturnIfThereAreFilters(params)) return;
        const filtersValues = Object.fromEntries(Object.entries(this.filters).map(([key, control]) => [key, control.value]));
        if (config.serverSide) {
          this.dataToSendBackWhenEvents.update(x => ({
            ...x,
            filters: filtersValues
          }));
          this.emitRequest();
        } else {
          this.applyClientFilteringSortAndPagination();
        }
      });
    }
  }

  protected get columns(): TableColumn<T>[] {
    const columns = this.config().columns;

    if (!this.config().selectable) {
      return columns;
    }

    return [
      {
        key: this.selectableKey as keyof T & string,
        label: 'Pick',
        type: 'text'
      },
      ...columns
    ];
  }

  readonly displayedData = computed((): T[] => {
    console.log(this.config());
    console.log(this.tableForNoServerSide());
    return this.config().serverSide ? this.data() : (this.tableForNoServerSide()?.filteredData ?? []);
  });

  protected get sortKey(): string | undefined | null {
    return this.isServerSide() ? this.config()?.sortByKey : this.tableForNoServerSide()?.config?.sortByKey;
  }

  protected get sortDirection(): 'asc' | 'desc' | '' | undefined | null {
    return this.isServerSide() ? this.config().sortDirection : this.tableForNoServerSide()?.config?.sortDirection;
  }

  protected loadFiltersFromUrlAndReturnIfThereAreFilters(params: Record<string, string | string[] | undefined>): boolean {
    let isThereFilter = false;
    for (const key of Object.keys(this.filters)) {
      const namespacedKey = `${this.config().tableName}${key}`;
      const value = params[namespacedKey];
      if (value !== undefined && !Array.isArray(value)) {
        this.filters[key].setValue(value, {
          emitEvent: false
        });
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

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  protected applyClientFilteringSortAndPagination(): void {
    let filtered = [...(this.tableForNoServerSide()?.originalData || [])];

    // Filtros
    for (const [key, control] of Object.entries(this.filters)) {
      const value = control.value?.trim()?.toLowerCase();

      if (!value) {
        continue;
      }

      filtered = filtered.filter(item =>
        String(item[key] ?? '')
          .toLowerCase()
          .includes(value)
      );
    }

    // Ordenación
    const sortKey = this.sortKey;
    const sortDirection = this.sortDirection;
    if (sortKey && sortDirection) {
      filtered.sort((a, b) => this.compareValues(a[sortKey], b[sortKey], sortDirection));
    }

    //Paginación
    this.tableForNoServerSide.update(config => {
      if (!config || !config.paginationMetaConfig) return null;

      const total = filtered.length;
      const rowsPerPage = config.paginationMetaConfig.rowsPerPageCurrent;
      const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
      const page = Math.min(Math.max(config.paginationMetaConfig.page, 1), totalPages);
      const start = (page - 1) * rowsPerPage;

      // Devolvemos un objeto nuevo con referencias nuevas en cada nivel
      return {
        ...config,
        filteredData: filtered.slice(start, start + rowsPerPage),
        paginationMetaConfig: {
          ...config.paginationMetaConfig,
          total,
          page
        }
      };
    });

    console.log(this.tableForNoServerSide());
  }

  private compareValues(a: unknown, b: unknown, direction: 'asc' | 'desc' | ''): number {
    if (a == null && b == null) {
      return 0;
    }

    if (a == null) {
      return 1;
    }

    if (b == null) {
      return -1;
    }

    let result = 0;

    if (a > b) {
      result = 1;
    } else if (a < b) {
      result = -1;
    }

    return direction === 'asc' ? result : -result;
  }

  protected emitRequest(): void {
    console.trace('emitRequest:');

    this.requestData.emit(this.dataToSendBackWhenEvents());
    // this.requestData.emit({
    //   page: this.page() || 1,
    //   rowsPerPageCurrent: this.rowsPerPageCurrent() || 10,
    //   filters,
    //   sort: {
    //     key: this.sortKey,
    //     direction: this.sortDirection
    //   }
    // });
  }

  protected changeSort(column: TableColumn<T>): void {
    if (column.key === this.selectableKey || column.sortable === false) {
      return;
    }

    const key = column.key;
    let newSortKey: string = '';
    let newSortDirection: 'asc' | 'desc' | '' = '';

    if (this.sortKey !== key) {
      newSortKey = key;
      newSortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      newSortDirection = 'desc';
    } else if (this.sortDirection === 'desc') {
      newSortDirection = '';
      newSortKey = '';
    } else {
      newSortDirection = 'asc';
    }

    if (this.isServerSide()) {
      this.emitRequest();
    } else {
      this.tableForNoServerSide.update(config =>
        config
          ? {
              ...config,
              config: {
                ...config.config,
                sortByKey: newSortKey,
                sortDirection: newSortDirection
              }
            }
          : null
      );
      this.applyClientFilteringSortAndPagination();
    }
  }

  protected changePage(newPage: number): void {
    if (this.isServerSide()) {
      this.dataToSendBackWhenEvents.update(x => ({
        ...x,
        page: newPage
      }));
      this.emitRequest();
    } else {
      this.tableForNoServerSide.update(config =>
        config
          ? {
              ...config,
              paginationMetaConfig: {
                ...config.paginationMetaConfig,
                page: newPage
              }
            }
          : null
      );
      this.applyClientFilteringSortAndPagination();
    }
  }

  protected changeRowsPerPage(newRowsPerPage: number): void {
    if (this.isServerSide()) {
      this.dataToSendBackWhenEvents.update(x => ({
        ...x,
        rowsPerPageCurrent: newRowsPerPage
      }));
      this.emitRequest();
    } else {
      this.tableForNoServerSide.update(config =>
        config
          ? {
              ...config,
              paginationMetaConfig: {
                ...config.paginationMetaConfig,
                rowsPerPageCurrent: newRowsPerPage
              }
            }
          : null
      );
      this.applyClientFilteringSortAndPagination();
    }
  }

  protected toggleRowSelection(row: T, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) this.selectedRows.add(row);
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
