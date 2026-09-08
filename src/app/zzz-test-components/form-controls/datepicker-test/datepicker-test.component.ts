import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Component } from '@angular/core';

import { DatepickerComponent } from 'aesy-components';

@Component({
  selector: 'app-datepicker-test',
  imports: [DatepickerComponent, ReactiveFormsModule],
  template: `
    <div class="container-formcontrol-test ">
      <app-datepicker label="Valor por defecto DATE salida Date" [(value)]="defaultDate" placeholder="Selecciona una fecha" [clearable]="true" [calendarWidth]="'full'" />
      <span>Valor control : {{ defaultDate }}</span>
    </div>
    <div class="container-formcontrol-test ">
      <app-datepicker label="Valor por defecto disabled DATE formato YYYY-MM-DD salida STRING" [(value)]="defaultDate2" [format]="'YYYY-MM-DD'" [emitType]="'string'" placeholder="Selecciona una fecha" [clearable]="true" [disabled]="true" />
      <span>Valor control : {{ defaultDate2 }}</span>
    </div>
    <div class="container-formcontrol-test ">
      <app-datepicker
        label="Valor por defecto STRING formato MM/DD/YYYY salida STRING minDate 2026-09-15 maxDate 2026-09-28 DIAS/MESES IN ENGLISH"
        [(value)]="defaultDate3"
        [format]="'MM/DD/YYYY'"
        [emitType]="'string'"
        placeholder="Selecciona una fecha"
        [clearable]="true"
        [minDate]="'2026-09-15'"
        [maxDate]="'2026-09-28'"
        [locale]="'en-GB'" />
      <span>Valor control : {{ defaultDate3 }}</span>
    </div>
    <div class="container-formcontrol-test ">
      <app-datepicker label="Valor por defecto NULL formato  DD/MM/YYYY salida DATE" [(value)]="defaultDate4" [format]="'DD/MM/YYYY'" [emitType]="'date'" placeholder="Selecciona una fecha" [clearable]="true" />
      <span>Valor control : {{ defaultDate4 }}</span>
    </div>

    <div class="container-formcontrol-test">
      <app-datepicker label="FormControl requerido que tras 2s cambia de valor" [formControl]="formControlRequerido" [clearable]="true" />
      <span>Valor control : {{ formControlRequerido.value?.toLocaleString('en-EN') }}</span>
    </div>

    <form [formGroup]="form">
      <div class="container-formcontrol-test ">
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
  defaultDate2 = new Date(2026, 8, 7);
  defaultDate3 = '09/01/2026';
  defaultDate4 = null;

  formControlRequerido = new FormControl<Date | null>(null, {
    validators: [Validators.required]
  });

  form = new FormGroup({
    formControlRequerido: new FormControl<Date | null>(null, {
      validators: [Validators.required]
    })
  });

  constructor() {
    setTimeout(() => {
      this.formControlRequerido.setValue(new Date(1997, 4, 3));
    }, 2000);
  }
}
