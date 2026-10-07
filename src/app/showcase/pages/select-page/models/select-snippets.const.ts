import { DocSnippet } from '../../../models/doc-snippet.interface';

export const SELECT_SNIPPETS = {
  basic: {
    ts: `protected readonly COUNTRY_OPTIONS: SelectOption[] = [
  { label: 'España', value: 'ES' },
  { label: 'Francia', value: 'FR' }
];
protected readonly country = signal<string | null>(null);`,
    html: `<aesy-select
  label="País"
  placeholder="Selecciona un país"
  [options]="COUNTRY_OPTIONS"
  [(value)]="country" />`
  },
  multiple: {
    ts: `protected readonly skills = signal<string[]>(['angular', 'signals']);`,
    html: `<aesy-select
  label="Tecnologías"
  [multiple]="true"
  [options]="SKILL_OPTIONS"
  [(value)]="skills" />`
  },
  clearable: {
    html: `<aesy-select
  label="País"
  [clearable]="true"
  [options]="COUNTRY_OPTIONS"
  [(value)]="country" />`
  },
  disabledOptions: {
    ts: `protected readonly COUNTRY_OPTIONS: SelectOption[] = [
  { label: 'España', value: 'ES' },
  { label: 'Francia (sin stock)', value: 'FR', disabled: true }
];`,
    html: `<aesy-select label="País de envío" [options]="COUNTRY_OPTIONS" [(value)]="country" />`
  },
  selectedIcon: {
    html: `<aesy-select
  label="Tecnologías"
  [multiple]="true"
  [showSelectedIcon]="true"
  [options]="SKILL_OPTIONS"
  [(value)]="skills" />`
  },
  complexValues: {
    ts: `protected readonly SHIPPING_OPTIONS: SelectOption[] = [
  { label: 'Estándar · 3-5 días', value: { id: 1, code: 'STANDARD', price: 0 } },
  { label: 'Exprés · 24 h', value: { id: 2, code: 'EXPRESS', price: 4.95 } }
];
// Se compara en profundidad: un objeto nuevo con los mismos datos queda seleccionado
protected readonly shipping = signal<ShippingMethod | null>({ id: 2, code: 'EXPRESS', price: 4.95 });`,
    html: `<aesy-select label="Envío" [options]="SHIPPING_OPTIONS" [(value)]="shipping" />`
  },
  states: {
    html: `<aesy-select label="Deshabilitado" [disabled]="true" [options]="COUNTRY_OPTIONS" [value]="'ES'" />
<aesy-select label="Solo lectura" [readonly]="true" [options]="COUNTRY_OPTIONS" [value]="'IT'" />`
  },
  alignment: {
    html: `<aesy-select label="Centrado" textAlign="center" [options]="COUNTRY_OPTIONS" [(value)]="country" />
<aesy-select label="A la derecha" textAlign="right" [options]="COUNTRY_OPTIONS" [(value)]="country" />`
  },
  helpAndErrors: {
    html: `<aesy-select label="Provincia" helpText="La usamos para calcular los gastos de envío." [options]="PROVINCE_OPTIONS" />
<aesy-select
  label="Provincia"
  [invalid]="true"
  errorMessage="Esta provincia no tiene envío disponible."
  [options]="PROVINCE_OPTIONS" />`
  },
  reactiveForms: {
    ts: `const minimumTwoOptionsValidator = (control: AbstractControl): ValidationErrors | null =>
  (control.value?.length ?? 0) < 2 ? { minimumTwoOptions: { message: 'Selecciona al menos dos opciones.' } } : null;

protected readonly profileForm = new FormGroup({
  country: new FormControl<string | null>(null, { validators: [Validators.required] }),
  skills: new FormControl<string[]>([], { validators: [minimumTwoOptionsValidator] })
});`,
    html: `<form [formGroup]="profileForm">
  <aesy-select label="País" formControlName="country" [clearable]="true" [options]="COUNTRY_OPTIONS" />
  <aesy-select label="Tecnologías" formControlName="skills" [multiple]="true" [options]="SKILL_OPTIONS" />
</form>`
  },
  theming: {
    css: `/* Las variables de :host se copian al overlay del desplegable,
   así que hay que declararlas sobre el propio aesy-select */
aesy-select {
  --aesy-select-dropdown-option-height: 2.75rem;
  --aesy-select-dropdown-option-hover-background: #ececfe;
  --aesy-select-dropdown-option-selected-background: #3b3bf0;
  --aesy-select-dropdown-option-selected-color: #ffffff;
  --aesy-select-input-multiple-element-background: #ececfe;
  --aesy-select-input-multiple-element-color: #2a2ad6;
}

/* Las variables comunes de los form controls viven en :root */
:root {
  --aesy-form-controls-radius: 0.75rem;
  --aesy-form-controls-border-color-focus: #3b3bf0;
}`
  }
} satisfies Record<string, DocSnippet>;
