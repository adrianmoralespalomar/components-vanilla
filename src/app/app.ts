import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div style="display:flex; gap:1rem;margin:1rem 0">
      <button mat-raised-button color="accent" [routerLink]="'form-controls'">Form Controls</button>
    </div>
    <router-outlet />
  `,
  imports: [RouterOutlet, RouterModule],
})
export class App {
  protected readonly title = signal('components-vanilla');
}
