import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Component } from '@angular/core';

import { DatepickerComponent } from '@/form-controls/datepicker/datepicker.component';

@Component({
  selector: 'app-datepicker-test',
  imports: [DatepickerComponent, ReactiveFormsModule],
  template: `
    <div style="display:flex; gap:1rem;">
      <app-datepicker label="Valor por defecto" [(value)]="defaultDate" placeholder="Selecciona una fecha" [clearable]="true" />

      <span>Valor control : {{ defaultDate }}</span>
    </div>

    <div style="display:flex; gap:1rem;">
      <app-datepicker label="FormControl requerido" [formControl]="formControlRequerido" [clearable]="true" />

      <span>Valor control : {{ formControlRequerido.value }}</span>
    </div>

    <form [formGroup]="form">
      <div
        style="
          display:flex;
          gap:1rem;
          align-items:center;
          border:2px solid black;
        ">
        <app-datepicker label="FormControlName requerido" formControlName="formControlRequerido" [clearable]="true" />

        <span>
          Valor control :
          {{ form.get('formControlRequerido')?.value }}
        </span>
      </div>
    </form>
  `
})
export class DatepickerTestComponent {
  defaultDate = new Date(2026, 8, 7);

  formControlRequerido = new FormControl<Date | null>(null, {
    validators: [Validators.required]
  });

  form = new FormGroup({
    formControlRequerido: new FormControl<Date | null>(null, {
      validators: [Validators.required]
    })
  });
}
