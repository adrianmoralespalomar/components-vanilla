import { DocSnippet } from '../../../models/doc-snippet.interface';

export const RADIO_BUTTON_SNIPPETS = {
  basic: {
    ts: `protected readonly PLAN_OPTIONS = [
  { label: 'Mensual', value: 'monthly' },
  { label: 'Anual', value: 'yearly' },
  { label: 'Vitalicio', value: 'lifetime' }
];
protected readonly plan = signal<string>('monthly');`,
    html: `<aesy-radio-button label="Plan de facturación" [options]="PLAN_OPTIONS" [(value)]="plan" />`
  },
  horizontal: {
    html: `<aesy-radio-button label="Plan de facturación" orientation="horizontal" [options]="PLAN_OPTIONS" [(value)]="plan" />`
  },
  objectValues: {
    ts: `protected readonly COUNTRY_OPTIONS = [
  { label: 'España', value: { id: 1, code: 'ES' } },
  { label: 'Francia', value: { id: 2, code: 'FR' } }
];
// Se compara en profundidad: un objeto nuevo con los mismos datos queda seleccionado
protected readonly country = signal<CountryValue>({ id: 2, code: 'FR' });`,
    html: `<aesy-radio-button label="País" [options]="COUNTRY_OPTIONS" [(value)]="country" />`
  },
  states: {
    html: `<aesy-radio-button label="Deshabilitado" [disabled]="true" [options]="PLAN_OPTIONS" [value]="'yearly'" />
<aesy-radio-button label="Solo lectura" [readonly]="true" [options]="PLAN_OPTIONS" [value]="'yearly'" />`
  },
  helpAndErrors: {
    html: `<aesy-radio-button label="Plan" helpText="Puedes cambiarlo cuando quieras." [options]="PLAN_OPTIONS" />
<aesy-radio-button label="Plan" [invalid]="true" errorMessage="Elige un plan para continuar." [options]="PLAN_OPTIONS" />`
  },
  reactiveForms: {
    ts: `protected readonly subscriptionForm = new FormGroup({
  plan: new FormControl<string | null>(null, { validators: [Validators.required] })
});`,
    html: `<form [formGroup]="subscriptionForm">
  <aesy-radio-button label="Plan" formControlName="plan" [options]="PLAN_OPTIONS" />
</form>`
  },
  theming: {
    css: `aesy-radio-button {
  --aesy-radio-button-control-checked-color: #3b3bf0;
  --aesy-radio-button-control-checked-disabled-color: #a5a8f5;
  --aesy-radio-button-control-size: 1.25rem;
  --aesy-radio-button-options-gap: 1rem;
}`
  }
} satisfies Record<string, DocSnippet>;
