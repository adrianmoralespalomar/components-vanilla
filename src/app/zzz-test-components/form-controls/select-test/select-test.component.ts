import { SelectComponent } from '@/form-controls/select/select.component';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-test',
  imports: [SelectComponent, ReactiveFormsModule],
  styles: [``],
  template: `
    <div class="container-formcontrol-test">
      <app-select label="Valor por defecto " [options]="countries" [(value)]="defaultCountry" placeholder="Selecciona un país" [clearable]="true" />
      <span>Valor control : {{ defaultCountry }}</span>
    </div>
    <div class="container-formcontrol-test">
      <app-select label="Valores por defecto seleccionados" [options]="countries" [multiple]="true" [(value)]="defaultSelectedCountries" [clearable]="true" />
      <span>Valor control : {{ defaultSelectedCountries }}</span>
    </div>
    <div class="container-formcontrol-test">
      <app-select label="FormControl requerido" [options]="countries" [multiple]="true" [formControl]="formControlRequerido" [clearable]="true" />
      <span>Valor control : {{ formControlRequerido?.value }}</span>
    </div>
    <form [formGroup]="form">
      <div class="container-formcontrol-test">
        <app-select label="FormControlName requerido" [options]="countries" formControlName="formControlRequerido" [clearable]="true" />
        <span>Valor control : {{ form.get('formControlRequerido')?.value }}</span>
      </div>
      <div class="container-formcontrol-test">
        <app-select label="FormControlName requerido multiple al menos 2 opciones" [options]="countries" formControlName="formControlRequeridos" [clearable]="true" [multiple]="true" />
        <span>Valor control : {{ form.get('formControlRequeridos')?.value }}</span>
      </div>
    </form>
  `
})
export class SelectTestComponent {
  countries = [
    { label: 'España', value: 'ES' },
    { label: 'Francia', value: 'FR' },
    { label: 'Italia', value: 'IT' },
    { label: 'Portugal', value: 'PT' }
  ];

  defaultCountry = 'ES';
  defaultSelectedCountries = ['ES', 'FR'];

  formControlRequerido = new FormControl(null, {
    validators: [Validators.required]
  });

  readonly validatorValueMoreThanTwoOptions = (control: AbstractControl) => {
    if (control.value?.length < 2) {
      return {
        nombreInvalido: {
          message: 'Debe seleccionar al menos dos opciones"'
        }
      };
    }

    return null;
  };

  form = new FormGroup({
    formControlRequerido: new FormControl(null, {
      validators: [Validators.required]
    }),
    formControlRequeridos: new FormControl(null, {
      validators: [this.validatorValueMoreThanTwoOptions]
    })
  });
}
