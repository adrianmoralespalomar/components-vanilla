import { TextareaComponent } from '@/form-controls/textarea/textarea.component';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-textarea-test',
  imports: [TextareaComponent, ReactiveFormsModule],
  styles: [
    `
      #valordefecto {
        --textarea-border-color: #08ff10;
        --textarea-border-hover-color: #6b7280;
        --textarea-border-focus-color: #8b5cf6;

        --textarea-background: #ffffff;
        --textarea-text-color: #1f2937;
        ::ng-deep .textarea-container {
          width: 50%;
        }
      }
    `
  ],
  template: `
    <div class="container-formcontrol-test">
      <app-textarea id="valordefecto" label="Valor por defecto con borde distinto y mitad tamaño" placeholder="Introduce tu nombre" [value]="'Probando con un valor por defecto sin formulario'" [textAlign]="'right'" [showCharCount]="true" [maxlength]="50" />
    </div>
    <div class="container-formcontrol-test">
      <app-textarea label="Valor por defecto deshabilitado" [value]="'Probando con un valor por defecto sin formulario deshabilitado'" [disabled]="true" />
    </div>
    <div class="container-formcontrol-test">
      <app-textarea label="FormControl Requerido y maximo con 50 caracteres" placeholder="Introduce tu nombre" [formControl]="formControlRequeridoYMax50Caract" [showCharCount]="true" [maxlength]="50" />
    </div>
    <form [formGroup]="form">
      <div class="container-formcontrol-test">
        <app-textarea label="Nombre" formControlName="formControlRequeridoYMax50Caract" />
      </div>
      <div class="container-formcontrol-test">
        <app-textarea label="Valor debe ser 'Adrian'" formControlName="formControlErrorCustom" />
      </div>
    </form>
  `
})
export class TextareaTestComponent {
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
