import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from 'aesy-components';
@Component({
  selector: 'app-form-controls-test',
  imports: [RouterModule, ButtonComponent],
  template: `
    <div style="display:flex; gap:1rem;margin:1rem 0">
      <app-button [label]="'Input Text Test'" [routerLink]="'input-text-test'" />
      <app-button [label]="'Input Number Test'" [type]="'secondary'" [routerLink]="'input-number-test'" />
      <app-button [label]="'Radio Button Test'" [type]="'tertiary'" [routerLink]="'radio-button-test'" />
      <app-button [label]="'Checkbox Test'" [type]="'success'" [routerLink]="'checkbox-test'" />
      <app-button [label]="'Textarea Test'" [type]="'info'" [routerLink]="'textarea-test'" />
      <app-button [label]="'Select Test'" [type]="'warning'" [routerLink]="'select-test'" />
      <app-button [label]="'Datepicker Test'" [type]="'danger'" [routerLink]="'datepicker-test'" />
    </div>
    <router-outlet />
  `
})
export class FormControlsTestComponent {}
