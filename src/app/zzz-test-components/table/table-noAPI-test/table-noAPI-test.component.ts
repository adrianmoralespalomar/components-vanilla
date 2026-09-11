import { Component, signal } from '@angular/core';
import { PaginationMeta, RequestData, TableComponent, TableConfig } from 'aesy-components';

@Component({
  template: `
    <span>Tabla con todos los datos en memoria pero paginado</span>
    <ul>
      <li>Columnas ordenables</li>
      <li>Columnas filtrables</li>
      <li>Columnas Nombre y Edad Fixed</li>
      <li>Columna Nombre 150px de width y cabecera centrada</li>
      <li>Cabecera Fixed</li>
      <li>Paginacion con botones personalizados</li>
    </ul>
    <div style="width: 40rem">
      <aesy-table [data]="dataPersons()" [config]="tableConfigPersons" [paginationMetaConfig]="paginationMetaConfig()" (requestData)="loadData($event)" />
    </div>
  `,
  styles: [
    `
      aesy-table {
        --aesy-table-container-height: 18rem;
      }
    `
  ],
  imports: [TableComponent]
})
export class TableNoApiTestComponent {
  dataPersons = signal<any[]>([
    { nombre: 'Juan', edad: 25, pais: 'España' },
    { nombre: 'María', edad: 30, pais: 'Francia' },
    { nombre: 'Pedro', edad: 40, pais: 'España' },
    { nombre: 'Lucía', edad: 35, pais: 'Italia' },
    { nombre: 'Luis', edad: 28, pais: 'Francia' },
    { nombre: 'Ana', edad: 22, pais: 'España' },
    { nombre: 'Tomás', edad: 31, pais: 'Italia' },
    { nombre: 'Sofía', edad: 27, pais: 'Francia' },
    { nombre: 'Carlos', edad: 36, pais: 'España' },
    { nombre: 'Elena', edad: 29, pais: 'Italia' },
    { nombre: 'Josefina', edad: 71, pais: 'Francia' }
  ]);

  tableConfigPersons: TableConfig = {
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'text', sortable: true, filterable: true, alignHeader: 'center', fixed: true, width: '150px' },
      { key: 'edad', label: 'Edad', type: 'number', sortable: true, filterable: true, fixed: true },
      {
        key: 'pais',
        label: 'País',
        type: 'select',
        sortable: false,
        filterable: true,
        options: [
          { label: 'España', value: 'España' },
          { label: 'Francia', value: 'Francia' },
          { label: 'Italia', value: 'Italia' }
        ]
      }
    ],
    isHeaderFixed: true,
    tableName: 'tableConfigPersons',
    serverSide: false,
    persistFilters: true
  };

  paginationMetaConfig = signal<PaginationMeta>({
    goFirstPageButtonShown: true,
    goLastPageButtonShown: true,
    pageShown: true,
    pageLabelPrefix: 'Página',
    page: 1,
    rowsPerPageCurrent: 10,
    nextLabel: 'Siguiente este label es custom',
    goLastPageButtonLabel: 'Ultima este label tambien mio 😎',
    previousIconSvg:
      'M11.2197 5.96973C11.5126 5.67683 11.9874 5.67683 12.2803 5.96973C12.5732 6.26262 12.5732 6.73738 12.2803 7.03027L9.31054 10L12.2803 12.9697C12.5732 13.2626 12.5732 13.7374 12.2803 14.0303C11.9874 14.3232 11.5126 14.3232 11.2197 14.0303L7.71972 10.5303C7.42683 10.2374 7.42683 9.76262 7.71972 9.46973L11.2197 5.96973Z',
    total: this.dataPersons().length
  });

  loadData(event: RequestData) {
    console.log('RequestData event:', event);
    this.paginationMetaConfig.update(pagConfig => ({
      ...pagConfig,
      rowsPerPageCurrent: event.rowsPerPageCurrent,
      page: event.page
    }));
  }
}
