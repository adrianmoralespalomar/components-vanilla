import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from 'aesy-components';
@Component({
  selector: 'app-form-controls-test',
  imports: [RouterModule, ButtonComponent],
  template: `
    <div style="display:flex; gap:1rem;margin:1rem 0">
      <aesy-button [label]="'Input Text Test'" [routerLink]="'input-text-test'" />
      <aesy-button [label]="'Input Number Test'" [type]="'secondary'" [routerLink]="'input-number-test'" />
      <aesy-button [label]="'Radio Button Test'" [type]="'tertiary'" [routerLink]="'radio-button-test'" />
      <aesy-button [label]="'Checkbox Test'" [type]="'success'" [routerLink]="'checkbox-test'" />
      <aesy-button [label]="'Textarea Test'" [type]="'info'" [routerLink]="'textarea-test'" />
      <aesy-button [label]="'Select Test'" [type]="'warning'" [routerLink]="'select-test'" />
      <aesy-button [label]="'Datepicker Test'" [type]="'danger'" [routerLink]="'datepicker-test'" />
    </div>
    <router-outlet />
  `
})
export class FormControlsTestComponent {}
