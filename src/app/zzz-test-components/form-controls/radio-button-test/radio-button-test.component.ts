import { RadioButtonComponent } from '@/form-controls/radio-button/radio-button.component';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-radio-button-test',
  imports: [RadioButtonComponent, ReactiveFormsModule],
  styles: [
    `
      #valordefecto {
        --radio-button-control-border-color: #08ff10;
        --radio-button-control-checked-color: #8b5cf6;
      }
    `
  ],
  template: `
    <app-radio-button
      id="valordefecto"
      label="Género por defecto con color distinto"
      [options]="[
        { label: 'Hombre', value: 'M' },
        { label: 'Mujer', value: 'F' },
        { label: 'Otro', value: 'O' }
      ]"
      [value]="'F'"
      orientation="horizontal" />
    <app-radio-button
      label="Pais con value como objeto"
      [options]="[
        {
          label: 'España',
          value: { id: 1, code: 'ES' }
        },
        {
          label: 'Francia',
          value: { id: 2, code: 'FR' }
        }
      ]"
      [value]="{ id: 2, code: 'FR' }"
      orientation="vertical"
      [disabled]="true" />
    <div style="display:flex; gap:1rem;align-items: center; border:2px solid black">
      <app-radio-button label="FormControl Requerido q tras 2s sera Francia" [options]="countryOptions" [formControl]="formControlRequerido" />
      <span>Valor control : {{ formControlRequerido.value }}</span>
    </div>

    <form [formGroup]="form">
      <div style="display:flex; gap:1rem;align-items: center; border:2px solid black">
        <app-radio-button label="Pais" [options]="countryOptions" formControlName="formControlRequerido" />
        <span>Valor control : {{ form.get('formControlRequerido')?.value }}</span>
      </div>
    </form>
  `
})
export class RadioButtonTestComponent {
  countryOptions = [
    { label: 'España - 1', value: 1 },
    { label: 'Francia - 2', value: 2 },
    { label: 'Italia - 3', value: 3 }
  ];
  formControlRequerido = new FormControl<number | null>(null, {
    validators: [Validators.required]
  });

  form = new FormGroup({
    formControlRequerido: new FormControl(3, {
      validators: [Validators.required]
    })
  });

  constructor() {
    setTimeout(() => {
      this.formControlRequerido.setValue(2);
    }, 2000);
  }
}
