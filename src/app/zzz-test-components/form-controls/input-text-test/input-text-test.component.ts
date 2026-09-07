import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, InputTextComponent } from 'aesy-components';

@Component({
  selector: 'app-input-text-test',
  imports: [InputTextComponent, ReactiveFormsModule, ButtonComponent],
  styles: [
    `
      #valordefecto {
        --input-text-border-color: #08ff10;
        --input-text-border-hover-color: #6b7280;
        --input-text-border-focus-color: #8b5cf6;

        --input-text-background: #ffffff;
        --input-text-text-color: #1f2937;
        ::ng-deep .input-container {
          width: 50%;
        }
      }
    `
  ],
  template: `
    <div class="container-formcontrol-test">
      <app-input-text id="valordefecto" label="Valor por defecto con borde distinto y mitad tamaño" placeholder="Introduce tu nombre" [value]="'Probando con un valor por defecto sin formulario'" [textAlign]="'right'" [showCharCount]="true" [maxlength]="50" />
      <app-input-text label="Valor por defecto deshabilitado" [value]="'Probando con un valor por defecto sin formulario deshabilitado'" [disabled]="true" />
      <app-input-text [label]="'Contraseña'" [type]="'password'" />
    </div>
    <div class="container-formcontrol-test">
      <app-input-text label="FormControl Requerido y maximo con 50 caracteres" placeholder="Introduce tu nombre" [allowTypeInvalidValue]="true" [formControl]="formControlRequeridoYMax50Caract" />
      <span>Valor control : {{ formControlRequeridoYMax50Caract.value }}</span>
      <app-button [label]="'Save'" [disabled]="formControlRequeridoYMax50Caract.invalid" />
    </div>
    <form [formGroup]="form">
      <div class="container-formcontrol-test">
        <app-input-text label="Nombre" formControlName="formControlRequeridoYMax50Caract" />
        <span>Valor control : {{ form.get('formControlRequeridoYMax50Caract')?.value }}</span>
        <app-button [label]="'Save'" [disabled]="form.get('formControlRequeridoYMax50Caract')?.invalid" [type]="'success'" />
      </div>
      <div class="container-formcontrol-test">
        <app-input-text label="Valor debe ser 'Adrian'" formControlName="formControlErrorCustom" />
        <span>Valor control : {{ form.get('formControlErrorCustom')?.value }}</span>
        <app-button [label]="'Save'" [disabled]="form.get('formControlErrorCustom')?.invalid" [type]="'secondary'" />
      </div>
    </form>
  `
})
export class InputTextTestComponent {
  formControlRequeridoYMax50Caract = new FormControl('', {
    validators: [Validators.required, Validators.maxLength(50)]
  });

  readonly validatorValueIsAdrian = (control: AbstractControl) => {
    if (control.value !== 'Adrian') {
      return {
        nombreInvalido: {
          message: 'El nombre introducido no es válido, debe ser "Adrian"'
        }
      };
    }

    return null;
  };

  form = new FormGroup({
    formControlRequeridoYMax50Caract: new FormControl('Valor desde el formulario por defecto', {
      validators: [Validators.required, Validators.maxLength(50)]
    }),
    formControlErrorCustom: new FormControl(null, {
      validators: [this.validatorValueIsAdrian]
    })
  });

  constructor() {
    setTimeout(() => {
      this.formControlRequeridoYMax50Caract.setValue('Valor seteado desde el constructor con setTimeout');
    }, 2000);
  }
}
