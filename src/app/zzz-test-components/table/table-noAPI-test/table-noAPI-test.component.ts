import { PaginationMeta } from '@/table/models/pagination-meta.interface';
import { TableConfig } from '@/table/models/table-config.interface';
import { TableComponent } from '@/table/table.component';
import { Component } from '@angular/core';

@Component({
  template: `
    <span>Tabla con todos los datos en memoria pero paginado</span>
    <app-table [data]="dataPersons" [config]="tableConfigPersons" [meta]="linksPersonas" />
  `,
  styles: [``],
  imports: [TableComponent]
})
export class TableNoApiTestComponent {
  dataPersons = [
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
  ];

  tableConfigPersons: TableConfig = {
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'text', sortable: true, filterable: true },
      { key: 'edad', label: 'Edad', type: 'number', sortable: true, filterable: true },
      {
        key: 'pais',
        label: 'País',
        type: 'select',
        sortable: true,
        filterable: true,
        options: ['España', 'Francia', 'Italia']
      }
    ],
    tableName: 'tableConfigPersons',
    serverSide: false,
    persistFilters: true
  };

  linksPersonas: PaginationMeta = {
    page: 1,
    pageSize: 10,
    total: 0
  };
}
