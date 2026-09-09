import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ButtonComponent } from 'aesy-components';
@Component({
  selector: 'app-root',
  template: `
    <div style="display:flex; gap:1rem;margin:1rem 0">
      <aesy-button [label]="'Button'" [routerLink]="'button'" />
      <aesy-button [label]="'Form Controls'" [type]="'secondary'" [routerLink]="'form-controls'" />
      <aesy-button [label]="'Table'" [type]="'tertiary'" [routerLink]="'table'" />
    </div>
    <router-outlet />
  `,
  imports: [RouterOutlet, RouterModule, ButtonComponent]
})
export class App {
  protected readonly title = signal('components-vanilla');
}
