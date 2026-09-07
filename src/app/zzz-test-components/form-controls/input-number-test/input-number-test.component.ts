import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, InputNumberComponent } from 'aesy-components';

@Component({
  selector: 'app-input-number-test',
  imports: [InputNumberComponent, ReactiveFormsModule, ButtonComponent],
  styles: [
    `
      #valordefectoprefijo {
        --input-number-border-color: #08ff10;
        --input-number-border-hover-color: #6b7280;
        --input-number-border-focus-color: #8b5cf6;

        --input-number-background: #ffffff;
        --input-number-text-color: #1f2937;
      }
    `
  ],
  template: `
    <div class="container-formcontrol-test">
      <app-input-number label="Valor por defecto" [value]="2132.45" [textAlign]="'center'" />
    </div>
    <div class="container-formcontrol-test">
      <app-input-number id="valordefectoprefijo" label="Valor por defecto con prefijo y color distinto de borde" [value]="1234.56" [prefix]="'€'" />
    </div>
    <div class="container-formcontrol-test">
      <app-input-number label="Valor deshabilitado" [value]="1234.56" [disabled]="true" />
    </div>
    <div class="container-formcontrol-test">
      <app-input-number label="Valor readonly" [value]="1234.56" [readonly]="true" />
    </div>
    <div class="container-formcontrol-test">
      <app-input-number label="FormControl maximo 2 decimales" [formControl]="formControlRequerido" [minFractionDigits]="2" [maxFractionDigits]="2" />
      <span>Valor control : {{ formControlRequerido.value }}</span>
    </div>
    <form [formGroup]="form">
      <div class="container-formcontrol-test">
        <app-input-number label="FormControlName requerido formato ingles" formControlName="formControlRequerido" [locale]="'en-US'" />
        <span>Valor control : {{ form.get('formControlRequerido')?.value }}</span>
      </div>
      <div class="container-formcontrol-test">
        <app-input-number label="FormControlName redondeado con 345.477777" formControlName="formControlRedondeado" [roundingMode]="'round'" [maxFractionDigits]="2" />
        <span>Valor control : {{ form.get('formControlRedondeado')?.value }}</span>
      </div>
      <div class="container-formcontrol-test">
        <app-input-number label="FormControlName con controles maximo 10'" formControlName="formControlConControles" [min]="0" [max]="10" [step]="1" [showButtons]="true" />
        <span>Valor control : {{ form.get('formControlConControles')?.value }}</span>
      </div>
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
