import { InputTextComponent } from '@/form-controls/input-text/input-text.component';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-text-test',
  imports: [InputTextComponent, ReactiveFormsModule],
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
    <app-input-text id="valordefecto" label="Valor por defecto con borde distinto y mitad tamaño" placeholder="Introduce tu nombre" [value]="'Probando con un valor por defecto sin formulario'" [textAlign]="'right'" [showCharCount]="true" [maxlength]="50" />
    <app-input-text label="Valor por defecto deshabilitado" [value]="'Probando con un valor por defecto sin formulario deshabilitado'" [disabled]="true" />
    <app-input-text [label]="'Contraseña'" [type]="'password'" />
    <app-input-text label="FormControl Requerido y maximo con 50 caracteres" placeholder="Introduce tu nombre" [allowTypeInvalidValue]="true" [formControl]="formControlRequeridoYMax50Caract" />
    <form [formGroup]="form">
      <app-input-text label="Nombre" formControlName="formControlRequeridoYMax50Caract" />
      <app-input-text label="Valor debe ser 'Adrian'" formControlName="formControlErrorCustom" />
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
