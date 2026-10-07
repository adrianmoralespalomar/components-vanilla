import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonComponent, PaginationMeta, RequestData, RowOrderChange, TableComponent } from 'aesy-components';
import { ComponentApi } from '../../models/component-api.interface';
import { DEMO_PEOPLE } from '../../models/demo-people.const';
import { DemoPerson } from '../../models/demo-person.interface';
import { ApiReferenceComponent } from '../../ui/api-reference/api-reference.component';
import { DocPageComponent } from '../../ui/doc-page/doc-page.component';
import { DocSectionComponent } from '../../ui/doc-section/doc-section.component';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { ASYNC_PEOPLE_LOAD_DELAY_MS } from './models/async-people-load-delay-ms.const';
import { DEMO_CITIES } from './models/demo-cities.const';
import { DemoCity } from './models/demo-city.interface';
import { DemoProduct } from './models/demo-product.interface';
import { DUMMY_PRODUCTS_URL } from './models/dummy-products-url.const';
import { DummyProductsResponse } from './models/dummy-products-response.interface';
import { NEW_DEMO_PEOPLE } from './models/new-demo-people.const';
import { TABLE_API } from './models/table-api.const';
import { TABLE_DEMO_CONFIGS } from './models/table-demo-configs.const';
import { TABLE_SNIPPETS } from './models/table-snippets.const';

@Component({
  selector: 'app-table-page',
  imports: [ApiReferenceComponent, ButtonComponent, DocPageComponent, DocSectionComponent, TableComponent, ValuePreviewComponent],
  templateUrl: './table-page.component.html',
  styleUrl: './table-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablePageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly httpClient = inject(HttpClient);

  protected readonly API: ComponentApi = TABLE_API;
  protected readonly CITIES: DemoCity[] = DEMO_CITIES;
  protected readonly CONFIGS = TABLE_DEMO_CONFIGS;
  protected readonly PEOPLE: DemoPerson[] = DEMO_PEOPLE;
  protected readonly SNIPPETS = TABLE_SNIPPETS;

  // En modo local la tabla pagina por su cuenta: estos objetos fijan el estado inicial
  protected readonly ASYNC_PAGINATION: PaginationMeta = { page: 1, rowsPerPageCurrent: 5, total: 0, pageShown: true };
  protected readonly CITIES_PAGINATION: PaginationMeta = { page: 1, rowsPerPageCurrent: 4, total: DEMO_CITIES.length };
  protected readonly CUSTOM_PAGINATION: PaginationMeta = {
    page: 1,
    rowsPerPageCurrent: 4,
    total: DEMO_PEOPLE.length,
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
  };
  protected readonly DRAGGABLE_PAGINATION: PaginationMeta = { page: 1, rowsPerPageCurrent: 6, total: DEMO_PEOPLE.length };
  protected readonly LOCAL_PAGINATION: PaginationMeta = { page: 1, rowsPerPageCurrent: 5, total: DEMO_PEOPLE.length, pageShown: true };

  protected readonly asyncPeople = signal<DemoPerson[]>([]);
  protected readonly isLoadingAsyncPeople = signal<boolean>(false);
  protected readonly isLoadingProducts = signal<boolean>(false);
  protected readonly lastProductsRequestData = signal<RequestData | null>(null);
  protected readonly lastRowOrderChange = signal<RowOrderChange<DemoPerson> | null>(null);
  protected readonly products = signal<DemoProduct[]>([]);
  protected readonly productsLoadError = signal<string | null>(null);
  protected readonly productsPagination = signal<PaginationMeta>({ page: 1, rowsPerPageCurrent: 5, total: 0, pageShown: true, rowsPerPage: [5, 10, 20].map(rows => ({ label: `${rows} filas`, value: rows })) });
  protected readonly selectedProductTitles = signal<string[]>([]);
  // Coincide con selectable.selectedValues de la config: las de España empiezan seleccionadas
  protected readonly selectedCities = signal<DemoCity[]>(DEMO_CITIES.filter(city => city.country === 'España'));

  constructor() {
    this.onProductsTableDataRequested({ page: 1, rowsPerPageCurrent: 5, filters: {} });
    this.onReloadAsyncPeopleButtonClicked();
  }

  protected onAddAsyncPersonButtonClicked(): void {
    const nextPerson: DemoPerson = NEW_DEMO_PEOPLE[this.asyncPeople().length % NEW_DEMO_PEOPLE.length];
    this.asyncPeople.update(people => [{ ...nextPerson, name: `${nextPerson.name} ${people.length + 1}` }, ...people]);
  }

  protected onReloadAsyncPeopleButtonClicked(): void {
    this.isLoadingAsyncPeople.set(true);
    this.asyncPeople.set([]);
    const loadTimeoutId = setTimeout(() => {
      this.asyncPeople.set(DEMO_PEOPLE);
      this.isLoadingAsyncPeople.set(false);
    }, ASYNC_PEOPLE_LOAD_DELAY_MS);
    this.destroyRef.onDestroy(() => clearTimeout(loadTimeoutId));
  }

  protected onRemoveFirstAsyncPersonButtonClicked(): void {
    this.asyncPeople.update(people => people.slice(1));
  }

  protected onCitiesSelectionChanged(selectedCities: DemoCity[]): void {
    this.selectedCities.set(selectedCities);
  }

  protected onProductsSelectionChanged(selectedProducts: DemoProduct[]): void {
    this.selectedProductTitles.set(selectedProducts.map(product => `${product.id} · ${product.title}`));
  }

  protected onDraggablePeopleRowOrderChanged(rowOrder: RowOrderChange<DemoPerson>): void {
    this.lastRowOrderChange.set(rowOrder);
  }

  protected onProductsTableDataRequested(requestData: RequestData): void {
    const searchText: string | undefined = requestData.filters?.title;
    let params = new HttpParams().set('limit', requestData.rowsPerPageCurrent).set('skip', (requestData.page - 1) * requestData.rowsPerPageCurrent).set('select', 'id,title,category,price');
    if (searchText) params = params.set('q', searchText);
    if (requestData.sortByKey) params = params.set('sortBy', requestData.sortByKey).set('order', requestData.sortDirection || 'asc');

    this.lastProductsRequestData.set(requestData);
    this.isLoadingProducts.set(true);
    this.productsLoadError.set(null);
    this.httpClient
      .get<DummyProductsResponse>(searchText ? `${DUMMY_PRODUCTS_URL}/search` : DUMMY_PRODUCTS_URL, { params })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.isLoadingProducts.set(false);
          this.products.set(response.products);
          this.productsPagination.update(pagination => ({ ...pagination, page: requestData.page, rowsPerPageCurrent: requestData.rowsPerPageCurrent, total: response.total }));
        },
        error: () => {
          this.isLoadingProducts.set(false);
          this.productsLoadError.set('No se ha podido conectar con dummyjson.com. Revisa tu conexión.');
        }
      });
  }
}
