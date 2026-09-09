import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { PaginationMeta, TableComponent, TableConfig } from 'aesy-components';

@Component({
  template: `
    <span>Tabla con seleccion con todos los datos en memoria pero paginado</span>
    <aesy-table [data]="dataCities" [config]="tableConfigCities" [paginationMetaConfig]="linksCities" (selectionChange)="this.selectedCities = $event" />
    <pre>{{ this.selectedCities | json }}</pre>
  `,
  styles: [``],
  imports: [TableComponent, JsonPipe]
})
export class TableSelectableTestComponent {
  dataCities = [
    { nombre: 'Madrid', pais: 'España', isSelected: true },
    { nombre: 'Sevilla', pais: 'España', isSelected: false },
    { nombre: 'Murcia', pais: 'España', isSelected: false },
    { nombre: 'Barcelona', pais: 'España', isSelected: true }
  ];

  selectedCities: any[] = [];

  tableConfigCities: TableConfig = {
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'text', sortable: true, filterable: true },
      {
        key: 'pais',
        label: 'País',
        type: 'select',
        sortable: true,
        filterable: true,
        options: [
          { label: 'España', value: 'España' },
          { label: 'Francia', value: 'Francia' },
          { label: 'Italia', value: 'Italia' }
        ]
      }
    ],
    tableName: 'tableConfigCities',
    serverSide: false,
    persistFilters: true,
    selectable: {
      key: 'nombre', // Key to indicate wt its already selected
      selectedValues: this.dataCities.filter(x => x.isSelected).map(x => x.nombre) // values that are already selected
    }
  };

  linksCities: PaginationMeta = {
    page: 1,
    rowsPerPageCurrent: 2,
    total: 0
  };
}
