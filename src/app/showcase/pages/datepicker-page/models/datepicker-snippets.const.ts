import { DocSnippet } from '../../../models/doc-snippet.interface';

export const DATEPICKER_SNIPPETS = {
  basic: {
    ts: `protected readonly deliveryDate = signal<Date | string | null>(new Date());`,
    html: `<aesy-datepicker label="Fecha de entrega" [clearable]="true" [(value)]="deliveryDate" />`
  },
  stringOutput: {
    html: `<aesy-datepicker
  label="Fecha (YYYY-MM-DD)"
  format="YYYY-MM-DD"
  emitType="string"
  [(value)]="isoDate" />`
  },
  range: {
    ts: `protected readonly TODAY: Date = new Date();
protected readonly IN_TWO_WEEKS: Date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);`,
    html: `<aesy-datepicker
  label="Cita en las próximas dos semanas"
  [minDate]="TODAY"
  [maxDate]="IN_TWO_WEEKS"
  [(value)]="appointmentDate" />`
  },
  locale: {
    html: `<aesy-datepicker
  label="Date (en-GB)"
  locale="en-GB"
  format="MM/DD/YYYY"
  firstDayOfWeek="sunday"
  [(value)]="englishDate" />`
  },
  fullWidth: {
    html: `<aesy-datepicker label="Calendario a todo el ancho" calendarWidth="full" [(value)]="deliveryDate" />`
  },
  states: {
    html: `<aesy-datepicker label="Deshabilitado" [disabled]="true" [value]="today" />
<aesy-datepicker label="Solo lectura" [readonly]="true" [value]="today" />`
  },
  helpAndErrors: {
    html: `<aesy-datepicker label="Fecha de nacimiento" helpText="La usamos para felicitarte." />
<aesy-datepicker label="Fecha de caducidad" [invalid]="true" errorMessage="La tarjeta está caducada." />`
  },
  reactiveForms: {
    ts: `protected readonly bookingForm = new FormGroup({
  checkIn: new FormControl<Date | null>(null, { validators: [Validators.required] })
});`,
    html: `<form [formGroup]="bookingForm">
  <aesy-datepicker label="Entrada" formControlName="checkIn" [clearable]="true" />
</form>`
  },
  theming: {
    css: `aesy-datepicker {
  --aesy-datepicker-calendar-selected-background: #3b3bf0;
  --aesy-datepicker-calendar-selected-background-hover: #2a2ad6;
  --aesy-datepicker-calendar-selected-color: #ffffff;
  --aesy-datepicker-calendar-today-day-background: #ececfe;
  --aesy-datepicker-calendar-today-day-color: #2a2ad6;
  --aesy-datepicker-hover-background: #f3f4f6;
}`
  }
} satisfies Record<string, DocSnippet>;
