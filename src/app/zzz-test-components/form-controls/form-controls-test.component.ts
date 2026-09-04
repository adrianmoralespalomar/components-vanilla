import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-form-controls-test',
  imports: [RouterModule],
  template: `
    <div style="display:flex; gap:1rem;margin:1rem 0">
      <button mat-raised-button color="accent" [routerLink]="'input-text-test'">Input Text Test</button>
      <button mat-raised-button color="accent" [routerLink]="'input-number-test'">Input Number Test</button>
      <button mat-raised-button color="accent" [routerLink]="'radio-button-test'">Radio Button Test</button>
      <button mat-raised-button color="accent" [routerLink]="'checkbox-test'">Checkbox Test</button>
      <button mat-raised-button color="accent" [routerLink]="'textarea-test'">Textarea Test</button>
    </div>
    <router-outlet />
  `
})
export class FormControlsTestComponent {}
