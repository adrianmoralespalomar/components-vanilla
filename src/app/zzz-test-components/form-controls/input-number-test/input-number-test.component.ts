import { InputNumberComponent } from '@/form-controls/input-number/input-number.component';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-number-test',
  imports: [InputNumberComponent, ReactiveFormsModule],
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
    <app-input-number label="Valor por defecto" [value]="2132.45" [textAlign]="'center'" />
    <app-input-number id="valordefectoprefijo" label="Valor por defecto con prefijo y color distinto de borde" [value]="1234.56" prefix="€ " />
    <app-input-number label="Valor deshabilitado" [value]="1234.56" [disabled]="true" />
    <app-input-number label="Valor readonly" [value]="1234.56" [readonly]="true" />
    <div style="display:flex; gap:1rem;">
      <app-input-number label="FormControl maximo 2 decimales" [formControl]="formControlRequerido" [minFractionDigits]="2" [maxFractionDigits]="2" />
      <span>Valor control : {{ formControlRequerido.value }}</span>
    </div>
    <form [formGroup]="form">
      <div style="display:flex; gap:1rem;align-items: center; border:2px solid black">
        <app-input-number label="FormControlName requerido formato ingles" formControlName="formControlRequerido" [locale]="'en-US'" />
        <span>Valor control : {{ form.get('formControlRequerido')?.value }}</span>
      </div>
      <div style="display:flex; gap:1rem;align-items: center; border:2px solid black">
        <app-input-number label="FormControlName redondeado con 345.477777" formControlName="formControlRedondeado" [roundingMode]="'round'" [maxFractionDigits]="2" />
        <span>Valor control : {{ form.get('formControlRedondeado')?.value }}</span>
      </div>
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
