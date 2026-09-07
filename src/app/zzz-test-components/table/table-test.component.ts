import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from 'aesy-components';

@Component({
  selector: 'app-table-test',
  imports: [RouterModule, ButtonComponent],
  template: `
    <div style="display:flex; gap:1rem;margin:1rem 0">
      <app-button [label]="'Table no API'" [type]="'info'" [routerLink]="'table-noapi-test'" />
      <app-button [label]="'Table with API'" [type]="'warning'" [routerLink]="'table-api-test'" />
      <app-button [label]="'Table Selectable'" [type]="'danger'" [routerLink]="'table-selectable-test'" />
    </div>
    <router-outlet />
  `
})
export class TableTestComponent {}
