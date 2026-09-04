import { PaginationMeta } from '@/table/models/pagination-meta.interface';
import { RequestData } from '@/table/models/request-data.interface';
import { TableConfig } from '@/table/models/table-config.interface';
import { TableComponent } from '@/table/table.component';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { map, Observable } from 'rxjs';

@Component({
  template: `
    <h3>Hay un error que no renderiza los datos al empezar. Hay q pinchar en algun sitio para que la tabla se "refresque"</h3>
    <span>Tabla con los datos desde 1 endpoint con paginacion en endpoint y con filtracion/ordenacion desde el servidor</span>
    <app-table [data]="dataProduct()" [config]="tableConfigProduct()" [meta]="linksProduct()" (requestData)="loadProduct($event)" />
  `,
  styles: [``],
  imports: [TableComponent]
})
export class TableApiTestComponent {
  dataProduct = signal<any[]>([]);
  tableConfigProduct = signal<TableConfig>({
    columns: [
      { key: 'id', label: 'ID', type: 'number', sortable: true },
      { key: 'title', label: 'Nombre Product', type: 'text', filterable: true },
      { key: 'url', label: 'URL', type: 'text' }
    ],
    tableName: 'tableConfigProduct',
    serverSide: true,
    persistFilters: true
  });

  linksProduct = signal<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0
  });

  loadProduct(event: RequestData) {
    const offset = (event.page - 1) * event.pageSize;
    this.getProductList(event.filters.title, offset, event.pageSize, event.sort.key, event.sort.direction).subscribe((res: any) => {
      this.dataProduct.set(res.data);
      this.linksProduct.set({
        page: res.page,
        pageSize: res.pageSize,
        total: res.total
      });
    });
  }

  private readonly httpClient = inject(HttpClient);

  private getProductList(search: string | undefined = undefined, offset = 0, limit = 10, sortBy: string | undefined = undefined, order: string = 'asc'): Observable<{ data: any[]; page: number; pageSize: number; total: number }> {
    const url = 'https://dummyjson.com/products';
    return this.httpClient.get<any>(`${url}/search?q=${search}&skip=${offset}&limit=${limit}&sortBy=${sortBy}&order=${order}`).pipe(
      map(response => {
        const data = response.products.map((p: any, i: number) => ({
          title: p.title,
          url: p.description,
          id: offset + i + 1
        }));
        return {
          data,
          page: offset / limit + 1,
          pageSize: limit,
          total: response.total
        };
      })
    );
  }

  constructor() {
    this.getProductList().subscribe();
  }
}
