import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-table-test',
  imports: [RouterModule],
  template: `
    <div style="display:flex; gap:1rem;margin:1rem 0">
      <button mat-raised-button color="accent" [routerLink]="'table-noapi-test'">Table no API</button>
      <button mat-raised-button color="accent" [routerLink]="'table-api-test'">Table with API</button>
      <button mat-raised-button color="accent" [routerLink]="'table-selectable-test'">Table Selectable</button>
    </div>
    <router-outlet />
  `
})
export class TableTestComponent {}
