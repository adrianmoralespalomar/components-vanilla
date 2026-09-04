import { CheckboxComponent } from '@/form-controls/checkbox/checkbox.component';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    <div style="display:flex; gap:1rem;align-items: center; border:2px solid black">
      <app-checkbox id="valorpordefecto" label="Valor por defecto con color distinto" [(value)]="valueByDefault" />
      <span>Valor control : {{ valueByDefault }}</span>
    </div>
    <div style="display:flex; gap:1rem;align-items: center; border:2px solid black">
      <app-checkbox label="FormControl Requerido q tras 2s se marcara" [formControl]="formControlRequerido" />
      <span>Valor control : {{ formControlRequerido.value }}</span>
    </div>

    <form [formGroup]="form">
      <div style="display:flex; gap:1rem;align-items: center; border:2px solid black">
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
