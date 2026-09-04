import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationMeta } from './models/pagination-meta.interface';
import { RequestData } from './models/request-data.interface';
import { TableColumn } from './models/table-column.interface';
import { TableConfig } from './models/table-config.interface';

type Row = Record<string, unknown>;

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T extends Row = Row> {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly data = input<T[]>([]);
  readonly config = input.required<TableConfig<T>>();
  readonly meta = input.required<PaginationMeta>();

  readonly requestData = output<RequestData>();
  readonly selectionChange = output<T[]>();

  protected readonly selectableKey = '__selectable__';

  protected selectedRows = new Set<T>();
  protected filters: Record<string, FormControl<string>> = {};

  protected filteredData: T[] = [];

  protected sortKey = '';
  protected sortDirection: 'asc' | 'desc' | '' = '';

  private filtersInitialized = false;

  constructor() {
    effect(() => {
      const config = this.config();

      if (this.filtersInitialized) {
        return;
      }

      this.filtersInitialized = true;
      this.initFilters();

      if (config.persistFilters) {
        this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
          this.loadFiltersFromUrl(params);

          if (config.serverSide) {
            this.emitRequest();
          } else {
            this.applyClientFilteringSortAndPagination();
          }
        });
      } else {
        if (config.serverSide) {
          this.emitRequest();
        } else {
          this.applyClientFilteringSortAndPagination();
        }
      }
    });
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

  protected get displayedData(): T[] {
    return this.config().serverSide ? this.data() : this.filteredData;
  }

  protected initFilters(): void {
    this.filters = {};

    for (const column of this.config().columns) {
      if (!column.filterable) {
        continue;
      }

      const control = new FormControl('', {
        nonNullable: true
      });

      this.filters[column.key] = control;

      control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.meta().page = 1;

        if (this.config().serverSide) {
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

  protected loadFiltersFromUrl(params: Record<string, string | string[] | undefined>): void {
    for (const key of Object.keys(this.filters)) {
      const namespacedKey = `${this.config().tableName}${key}`;
      const value = params[namespacedKey];

      if (value !== undefined && !Array.isArray(value)) {
        this.filters[key].setValue(value, {
          emitEvent: false
        });
      }
    }
  }

  protected updateQueryParams(): void {
    const queryParams: Record<string, string | null> = {};

    for (const [key, control] of Object.entries(this.filters)) {
      const value = control.value.trim();

      queryParams[`${this.config().tableName}${key}`] = value || null;
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  protected applyClientFilteringSortAndPagination(): void {
    const meta = this.meta();

    let filtered = [...this.data()];

    // Filtros
    for (const [key, control] of Object.entries(this.filters)) {
      const value = control.value.trim().toLowerCase();

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
    if (this.sortKey && this.sortDirection) {
      filtered.sort((a, b) => this.compareValues(a[this.sortKey], b[this.sortKey], this.sortDirection));
    }

    meta.total = filtered.length;

    const totalPages = Math.max(1, Math.ceil(meta.total / meta.pageSize));

    meta.page = Math.min(Math.max(meta.page, 1), totalPages);

    const start = (meta.page - 1) * meta.pageSize;

    this.filteredData = filtered.slice(start, start + meta.pageSize);
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
    const filters = Object.fromEntries(Object.entries(this.filters).map(([key, control]) => [key, control.value]));

    this.requestData.emit({
      page: this.meta().page || 1,
      pageSize: this.meta().pageSize || 10,
      filters,
      sort: {
        key: this.sortKey,
        direction: this.sortDirection
      }
    });
  }

  protected changeSort(column: TableColumn<T>): void {
    if (column.key === this.selectableKey || column.sortable === false) {
      return;
    }

    const key = column.key;

    if (this.sortKey !== key) {
      this.sortKey = key;
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else if (this.sortDirection === 'desc') {
      this.sortDirection = '';
      this.sortKey = '';
    } else {
      this.sortDirection = 'asc';
    }

    if (this.config().serverSide) {
      this.emitRequest();
    } else {
      this.applyClientFilteringSortAndPagination();
    }
  }

  protected changePage(newPage: number): void {
    const meta = this.meta();

    const totalPages = Math.max(1, Math.ceil(meta.total / meta.pageSize));

    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    meta.page = newPage;

    if (this.config().serverSide) {
      this.emitRequest();
    } else {
      this.applyClientFilteringSortAndPagination();
    }
  }

  protected toggleRowSelection(row: T, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedRows.add(row);
    } else {
      this.selectedRows.delete(row);
    }

    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  protected isSelected(row: T): boolean {
    return this.selectedRows.has(row);
  }

  protected getSortIcon(key: string): string {
    if (this.sortKey !== key) {
      return '';
    }

    return this.sortDirection === 'asc' ? '▲' : this.sortDirection === 'desc' ? '▼' : '';
  }
}
