import { DocSnippet } from '../../../models/doc-snippet.interface';

export const INPUT_NUMBER_SNIPPETS = {
  basic: {
    ts: `protected readonly amount = signal<number | null>(2132.45);`,
    html: `<aesy-input-number label="Importe" [(value)]="amount" />`
  },
  decimals: {
    html: `<aesy-input-number label="Redondeado" roundingMode="round" [maxFractionDigits]="2" [(value)]="price" />
<aesy-input-number label="Truncado" roundingMode="truncate" [maxFractionDigits]="2" [(value)]="price" />
<aesy-input-number label="Siempre 2 decimales" [minFractionDigits]="2" [maxFractionDigits]="2" [(value)]="price" />`
  },
  locale: {
    html: `<aesy-input-number label="es-ES" locale="es-ES" [(value)]="amount" />
<aesy-input-number label="en-US" locale="en-US" [(value)]="amount" />
<aesy-input-number label="Sin separador de miles" [useGrouping]="false" [(value)]="amount" />`
  },
  affixes: {
    html: `<aesy-input-number label="Precio" prefix="€" [minFractionDigits]="2" [(value)]="price" />
<aesy-input-number label="Descuento" suffix="%" [maxFractionDigits]="0" [(value)]="discount" />`
  },
  buttons: {
    html: `<aesy-input-number
  label="Unidades"
  [showButtons]="true"
  [min]="0"
  [max]="10"
  [step]="1"
  [maxFractionDigits]="0"
  [(value)]="units" />`
  },
  negatives: {
    html: `<aesy-input-number label="Solo positivos" [allowNegative]="false" [(value)]="stock" />`
  },
  alignment: {
    html: `<aesy-input-number label="Centrado" textAlign="center" [(value)]="amount" />
<aesy-input-number label="Derecha" textAlign="right" [(value)]="amount" />`
  },
  states: {
    html: `<aesy-input-number label="Deshabilitado" [disabled]="true" [value]="1234.56" />
<aesy-input-number label="Solo lectura" [readonly]="true" [value]="1234.56" />`
  },
  reactiveForms: {
    ts: `protected readonly orderForm = new FormGroup({
  quantity: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1), Validators.max(99)] })
});`,
    html: `<form [formGroup]="orderForm">
  <aesy-input-number label="Cantidad" formControlName="quantity" [maxFractionDigits]="0" />
</form>`
  },
  theming: {
    css: `aesy-input-number {
  --aesy-input-number-prefix-color: #3b3bf0;
  --aesy-input-number-suffix-color: #3b3bf0;
  --aesy-input-number-buttons-background: #ececfe;
  --aesy-input-number-buttons-background-hover: #dcdcfd;
  --aesy-input-number-buttons-color: #2a2ad6;

  /* Las comunes de los form controls también se pueden acotar a un campo */
  --aesy-form-controls-border-color-focus: #3b3bf0;
}`
  }
} satisfies Record<string, DocSnippet>;
