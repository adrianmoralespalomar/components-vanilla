import { Routes } from '@angular/router';
import { TableApiTestComponent } from './table-api-test/table-api-test.component';
import { TableNoApiTestComponent } from './table-noAPI-test/table-noAPI-test.component';
import { TableSelectableTestComponent } from './table-selectable-test/table-selectable-test.component';
import { TableTestComponent } from './table-test.component';

export const tableTestRoutes: Routes = [
  {
    path: '',
    component: TableTestComponent,
    children: [
      {
        path: 'table-noapi-test',
        component: TableNoApiTestComponent
      },
      {
        path: 'table-api-test',
        component: TableApiTestComponent
      },
      {
        path: 'table-selectable-test',
        component: TableSelectableTestComponent
      }
    ]
  }
];
