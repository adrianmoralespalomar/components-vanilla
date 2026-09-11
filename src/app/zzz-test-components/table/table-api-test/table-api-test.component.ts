import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { PaginationMeta, RequestData, TableComponent, TableConfig } from 'aesy-components';
import { map, Observable } from 'rxjs';

@Component({
  template: `
    <span>Tabla con los datos desde 1 endpoint con paginacion en endpoint y con filtracion/ordenacion desde el servidor. Longitud datos: {{ dataProduct()?.length }}</span>
    <ul>
      <li>Columnas ordenables por api</li>
      <li>Columnas filtrables api (la api filtra tanto por nombre product como url)</li>
      <li>Columnas Nombre Product Fixed</li>
      <li>Paginacion con botones personalizados</li>
    </ul>
    <aesy-table [data]="dataProduct()" [config]="tableConfigProduct()" [paginationMetaConfig]="paginationMetaConfig()" (requestData)="loadProduct($event)" />
  `,
  styles: [
    `
      aesy-table {
        --aesy-table-layout: auto;
      }
    `
  ],
  imports: [TableComponent]
})
export class TableApiTestComponent {
  dataProduct = signal<any[]>([]);
  tableConfigProduct = signal<TableConfig>({
    columns: [
      { key: 'id', label: 'ID', type: 'number', sortable: true },
      { key: 'title', label: 'Nombre Product', type: 'text', filterable: true, fixed: true },
      { key: 'url', label: 'URL', type: 'text' }
    ],
    tableName: 'tableConfigProduct',
    serverSide: true,
    persistFilters: true
  });

  paginationMetaConfig = signal<PaginationMeta>({
    goFirstPageButtonShown: true,
    goLastPageButtonShown: true,
    pageShown: true,
    page: 1,
    rowsPerPageCurrent: 10,
    rowsPerPage: [
      { label: '10 filas', value: 10 },
      { label: '25 filas', value: 25 },
      { label: '50 filas', value: 50 }
    ],
    total: 0
  });

  loadProduct(event: RequestData) {
    const offset = (event.page - 1) * event.rowsPerPageCurrent;
    this.getProductList(event.filters.title, offset, event.rowsPerPageCurrent, event.sortByKey, event.sortDirection).subscribe((res: any) => {
      this.dataProduct.set(res.data);
      this.tableConfigProduct.update(x => ({
        ...x,
        sortByKey: event.sortByKey,
        sortDirection: event.sortDirection
      }));
      this.paginationMetaConfig.update(x => ({
        ...x,
        page: res.page,
        rowsPerPageCurrent: res.rowsPerPageCurrent,
        total: res.total
      }));
    });
  }

  private readonly httpClient = inject(HttpClient);

  private getProductList(search: string | undefined = undefined, offset = 0, limit = 10, sortBy: string | undefined = undefined, order: string = 'asc'): Observable<{ data: any[]; page: number; rowsPerPageCurrent: number; total: number }> {
    let params = '';
    if (search) params += `&q=${search}`;
    if (offset) params += `&skip=${offset}`;
    if (limit) params += `&limit=${limit}`;
    if (sortBy) params += `&sortBy=${sortBy}`;
    if (order) params += `&order=${order}`;
    const url = 'https://dummyjson.com/products';
    return this.httpClient.get<any>(`${params ? url + '/search?' + params.substring(1) : url}`).pipe(
      map(response => {
        const data = response.products.map((p: any, i: number) => ({
          title: p.title,
          url: p.description,
          id: p.id
        }));
        return {
          data,
          page: offset / limit + 1,
          rowsPerPageCurrent: limit,
          total: response.total
        };
      })
    );
  }

  constructor() {
    this.loadProduct({
      page: this.paginationMetaConfig()?.page,
      rowsPerPageCurrent: this.paginationMetaConfig()?.rowsPerPageCurrent,
      filters: {}
    });
  }
}
