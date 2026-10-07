import { DocSnippet } from '../../../models/doc-snippet.interface';

export const TEXTAREA_SNIPPETS = {
  basic: {
    ts: `protected readonly comments = signal<string>('');`,
    html: `<aesy-textarea label="Comentarios" placeholder="Cuéntanos algo…" [(value)]="comments" />`
  },
  rowsAndResize: {
    html: `<aesy-textarea label="2 filas, sin redimensionar" [rows]="2" resize="none" />
<aesy-textarea label="6 filas, redimensionable en ambos ejes" [rows]="6" resize="both" />`
  },
  charCount: {
    html: `<aesy-textarea label="Biografía" [maxlength]="160" [showCharCount]="true" [(value)]="bio" />`
  },
  alignment: {
    html: `<aesy-textarea label="Centrado" textAlign="center" [(value)]="quote" />`
  },
  states: {
    html: `<aesy-textarea label="Deshabilitado" [disabled]="true" [value]="'No editable'" />
<aesy-textarea label="Solo lectura" [readonly]="true" [value]="'Se puede seleccionar y copiar'" />`
  },
  helpAndErrors: {
    html: `<aesy-textarea label="Descripción" helpText="Describe el problema con el máximo detalle." />
<aesy-textarea label="Descripción" [invalid]="true" errorMessage="La descripción no puede estar vacía." />`
  },
  reactiveForms: {
    ts: `protected readonly feedbackForm = new FormGroup({
  message: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(20), Validators.maxLength(200)] })
});`,
    html: `<form [formGroup]="feedbackForm">
  <aesy-textarea label="Mensaje" formControlName="message" [maxlength]="200" [showCharCount]="true" [allowTypeInvalidValue]="true" />
</form>`
  },
  theming: {
    css: `/* El textarea usa las variables comunes de los form controls */
aesy-textarea {
  --aesy-form-controls-background: #fafaff;
  --aesy-form-controls-border-color-focus: #3b3bf0;
  --aesy-form-controls-radius: 0.75rem;
  --aesy-form-controls-text-size: 1rem;
}`
  }
} satisfies Record<string, DocSnippet>;
