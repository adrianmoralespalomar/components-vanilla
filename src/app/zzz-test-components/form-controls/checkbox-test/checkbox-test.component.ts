import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxComponent } from 'aesy-components';
@Component({
  selector: 'app-checkbox-test',
  imports: [CheckboxComponent, ReactiveFormsModule],
  styles: [
    `
      #valorpordefecto {
        --checkbox-checked-background: #08ff10;
        --checkbox-check-color: #8b5cf6;
      }
    `
  ],
  template: `
    <div class="container-formcontrol-test">
      <app-checkbox id="valorpordefecto" label="Valor por defecto con color distinto" [(value)]="valueByDefault" />
      <span>Valor control : {{ valueByDefault }}</span>
    </div>
    <div class="container-formcontrol-test">
      <app-checkbox label="FormControl Requerido q tras 2s se marcara" [formControl]="formControlRequerido" />
      <span>Valor control : {{ formControlRequerido.value }}</span>
    </div>

    <form [formGroup]="form">
      <div class="container-formcontrol-test">
        <app-checkbox label="Dentro de Form" formControlName="formControlRequerido" />
        <span>Valor control : {{ form.get('formControlRequerido')?.value }}</span>
      </div>
    </form>
  `
})
export class CheckboxTestComponent {
  valueByDefault = true;
  formControlRequerido = new FormControl<boolean | null>(null, {
    validators: [Validators.required]
  });

  form = new FormGroup({
    formControlRequerido: new FormControl(false, {
      validators: [Validators.required]
    })
  });

  constructor() {
    setTimeout(() => {
      this.formControlRequerido.setValue(true);
    }, 2000);
  }
}
