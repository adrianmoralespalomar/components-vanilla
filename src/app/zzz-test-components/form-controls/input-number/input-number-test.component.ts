import { InputNumberComponent } from '@/form-controls/input-number/input-number.component';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-number-test',
  imports: [InputNumberComponent, ReactiveFormsModule],
  template: `
    <app-input-number label="Valor por defecto" [value]="2132.45" [textAlign]="'center'" />
    <app-input-number label="Valor por defecto con prefijo" [value]="1234.56" prefix="€ " />
    <app-input-number label="Valor deshabilitado" [value]="1234.56" [disabled]="true" />
    <app-input-number label="Valor readonly" [value]="1234.56" [readonly]="true" />
    <app-input-number label="FormControl maximo 2 decimales" [formControl]="formControlRequerido" [minFractionDigits]="2" [maxFractionDigits]="2" />
    <form [formGroup]="form">
      <app-input-number label="FormControlName requerido formato ingles" formControlName="formControlRequerido" [locale]="'en-US'" />
      <app-input-number label="FormControlName redondeado con 345.477777" formControlName="formControlRedondeado" [roundingMode]="'round'" [maxFractionDigits]="2" />
      <app-input-number label="FormControlName con controles maximo 10'" formControlName="formControlConControles" [min]="0" [max]="10" [step]="1" [showButtons]="true" />
    </form>
  `
})
export class InputNumberTestComponent {
  formControlRequerido = new FormControl(3, {
    validators: [Validators.required]
  });
  form = new FormGroup({
    formControlRequerido: new FormControl(333.47, {
      validators: [Validators.required]
    }),
    formControlRedondeado: new FormControl(345.477777),
    formControlConControles: new FormControl(3)
  });
}
