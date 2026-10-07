import { DocSnippet } from '../../../models/doc-snippet.interface';

export const INPUT_TEXT_SNIPPETS = {
  basic: {
    ts: `protected readonly fullName = signal<string>('');`,
    html: `<aesy-input-text label="Nombre" placeholder="Escribe tu nombre" [(value)]="fullName" />`
  },
  types: {
    html: `<aesy-input-text label="Texto" type="text" />
<aesy-input-text label="Correo" type="email" />
<aesy-input-text label="Contraseña" type="password" />`
  },
  charCount: {
    html: `<aesy-input-text label="Titular" [maxlength]="40" [showCharCount]="true" [(value)]="headline" />
<!-- Deja pasar del límite para que se vea el error en vez de cortar el texto -->
<aesy-input-text label="Titular" [maxlength]="20" [showCharCount]="true" [allowTypeInvalidValue]="true" [formControl]="headlineControl" />`
  },
  icon: {
    html: `<aesy-input-text label="Usuario" icon="@" [(value)]="username" />
<aesy-input-text label="Importe" icon="€" iconPosition="right" textAlign="right" [(value)]="amount" />`
  },
  alignment: {
    html: `<aesy-input-text label="Centrado" textAlign="center" [(value)]="code" />
<aesy-input-text label="Derecha" textAlign="right" [(value)]="code" />`
  },
  states: {
    html: `<aesy-input-text label="Deshabilitado" [disabled]="true" [value]="'No editable'" />
<aesy-input-text label="Solo lectura" [readonly]="true" [value]="'Se puede copiar'" />`
  },
  helpAndErrors: {
    html: `<aesy-input-text label="Usuario" helpText="Entre 3 y 20 caracteres, sin espacios." />
<aesy-input-text label="Usuario" [invalid]="true" errorMessage="Ese usuario ya existe." [value]="'admin'" />`
  },
  reactiveForms: {
    ts: `const forbiddenUsernameValidator = (control: AbstractControl): ValidationErrors | null =>
  control.value === 'admin' ? { forbiddenUsername: { message: 'El usuario "admin" está reservado.' } } : null;

protected readonly signUpForm = new FormGroup({
  email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), forbiddenUsernameValidator] })
});`,
    html: `<form [formGroup]="signUpForm">
  <aesy-input-text label="Correo" type="email" formControlName="email" />
  <aesy-input-text label="Usuario" formControlName="username" />
</form>`
  },
  theming: {
    css: `/* El input text usa solo las variables comunes de los form controls */
aesy-input-text {
  --aesy-form-controls-background: #fafaff;
  --aesy-form-controls-border-color: #c9ceda;
  --aesy-form-controls-border-color-hover: #8b91a5;
  --aesy-form-controls-border-color-focus: #3b3bf0;
  --aesy-form-controls-radius: 0.75rem;
  --aesy-form-controls-label-required-asterisk-color: #3b3bf0;
}`
  }
} satisfies Record<string, DocSnippet>;
