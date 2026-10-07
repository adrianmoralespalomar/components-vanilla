import { DocSnippet } from '../../../models/doc-snippet.interface';

export const CHECKBOX_SNIPPETS = {
  basic: {
    ts: `protected readonly acceptedTerms = signal<boolean>(false);`,
    html: `<aesy-checkbox label="Acepto las condiciones" [(value)]="acceptedTerms" />`
  },
  indeterminate: {
    ts: `protected readonly selectedNotifications = signal<boolean[]>([true, false, false]);
protected readonly areAllSelected = computed<boolean>(() => this.selectedNotifications().every(Boolean));
protected readonly areSomeSelected = computed<boolean>(() => this.selectedNotifications().some(Boolean) && !this.areAllSelected());`,
    html: `<aesy-checkbox
  label="Todas las notificaciones"
  [value]="areAllSelected()"
  [indeterminate]="areSomeSelected()"
  (valueChange)="onAllNotificationsChanged($event)" />`
  },
  labelPosition: {
    html: `<aesy-checkbox label="Etiqueta a la derecha" />
<aesy-checkbox label="Etiqueta a la izquierda" labelPosition="left" />`
  },
  sizes: {
    html: `<aesy-checkbox label="Small" size="small" />
<aesy-checkbox label="Medium" size="medium" />
<aesy-checkbox label="Large" size="large" />`
  },
  states: {
    html: `<aesy-checkbox label="Deshabilitado" [disabled]="true" [value]="true" />
<aesy-checkbox label="Solo lectura" [readonly]="true" [value]="true" />`
  },
  helpAndErrors: {
    html: `<aesy-checkbox label="Quiero recibir el boletín" helpText="Un correo al mes, sin spam." />
<aesy-checkbox
  label="Acepto la política de privacidad"
  [invalid]="true"
  errorMessage="Debes aceptar la política para continuar." />`
  },
  reactiveForms: {
    ts: `protected readonly termsControl = new FormControl<boolean>(false, {
  nonNullable: true,
  validators: [Validators.requiredTrue]
});`,
    html: `<!-- Sin errorMessage mostraría el mensaje automático ("Campo obligatorio") -->
<aesy-checkbox
  label="Acepto las condiciones"
  errorMessage="Debes aceptar las condiciones."
  [formControl]="termsControl" />`
  },
  theming: {
    css: `aesy-checkbox {
  --aesy-checkbox-checked-background: #3b3bf0;
  --aesy-checkbox-checked-border-color: #3b3bf0;
  --aesy-checkbox-check-color: #ffffff;
  --aesy-checkbox-border-color: #9ca3af;
  --aesy-checkbox-radius: 6px;
  --aesy-checkbox-size: 1.25rem;
}`
  }
} satisfies Record<string, DocSnippet>;
