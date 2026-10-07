# DatepickerComponent

Selector de fecha con calendario propio (overlay del CDK), formatos configurables, rango de fechas e idioma.

Selector: `aesy-datepicker`.

## Características

- Implementa `ControlValueAccessor` e integra `NgControl`: detecta `Validators.required` y muestra los mensajes de error.
- Uso independiente con `[(value)]`.
- Formato configurable con los tokens `DD`, `MM` y `YYYY` (`DD/MM/YYYY`, `YYYY-MM-DD`, `MM/DD/YYYY`…).
- Salida como `Date` o como `string` en el formato indicado (`emitType`).
- Se puede escribir la fecha a mano: se interpreta al salir del campo.
- Rango con `minDate` y `maxDate`.
- Idioma de meses y días (`locale`) y primer día de la semana (`firstDayOfWeek`).
- Botón para borrar la fecha (`clearable`).
- Teclado: `ArrowDown` abre el calendario, `Escape` y `Tab` lo cierran.

---

# Importación

```ts
import { DatepickerComponent } from 'aesy-components';

@Component({
  imports: [DatepickerComponent]
})
export class ExampleComponent {}
```

---

# Uso sin Angular Forms

```ts
protected readonly deliveryDate = signal<Date | string | null>(new Date());
```

```html
<aesy-datepicker label="Fecha de entrega" [clearable]="true" [(value)]="deliveryDate" />
```

---

# Formato y salida como texto

```html
<aesy-datepicker
  label="Fecha (YYYY-MM-DD)"
  format="YYYY-MM-DD"
  emitType="string"
  [(value)]="isoDate" />
```

Con `emitType="date"` (por defecto) el valor es un `Date`; con `"string"`, un texto con el formato de `format`.

---

# Rango de fechas

```ts
protected readonly TODAY: Date = new Date();
protected readonly IN_TWO_WEEKS: Date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
```

```html
<aesy-datepicker label="Cita" [minDate]="TODAY" [maxDate]="IN_TWO_WEEKS" [(value)]="appointmentDate" />
```

`minDate` y `maxDate` aceptan un `Date` o un `string`. Los días fuera del rango aparecen deshabilitados.

---

# Idioma y primer día de la semana

```html
<aesy-datepicker label="Date" locale="en-GB" format="MM/DD/YYYY" firstDayOfWeek="sunday" [(value)]="englishDate" />
```

---

# Ancho del calendario

```html
<aesy-datepicker label="Fecha" calendarWidth="full" [(value)]="date" />
```

`auto` (por defecto) usa el ancho propio del calendario; `full`, el del campo.

---

# Reactive Forms

```ts
protected readonly bookingForm = new FormGroup({
  checkIn: new FormControl<Date | null>(null, { validators: [Validators.required] })
});
```

```html
<form [formGroup]="bookingForm">
  <aesy-datepicker label="Entrada" formControlName="checkIn" [clearable]="true" />
</form>
```

---

# API

## Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Texto de la etiqueta. |
| `placeholder` | `string` | `'Selecciona una fecha'` | Texto sin fecha seleccionada. |
| `format` | `string` | `'DD/MM/YYYY'` | Formato de visualización y de salida como texto. |
| `emitType` | `'date' \| 'string'` | `'date'` | Tipo del valor emitido. |
| `locale` | `string` | `'es-ES'` | Idioma de meses y días. |
| `firstDayOfWeek` | `'monday' \| 'sunday'` | `'monday'` | Primer día de cada semana. |
| `minDate` | `Date \| string \| null` | `null` | Fecha mínima. |
| `maxDate` | `Date \| string \| null` | `null` | Fecha máxima. |
| `calendarWidth` | `'auto' \| 'full'` | `'auto'` | Ancho del calendario. |
| `clearable` | `boolean` | `false` | Botón para borrar la fecha. |
| `textAlign` | `'left' \| 'center' \| 'right'` | `'left'` | Alineación del texto. |
| `readonly` | `boolean` | `false` | Impide cambiar la fecha. |
| `disabled` | `boolean` | `false` | Deshabilita el campo sin Angular Forms. |
| `required` | `boolean \| null` | `null` | Obligatorio. Con `null` se detecta desde el `FormControl`. |
| `invalid` | `boolean` | `false` | Estado inválido sin Angular Forms. |
| `errorMessage` | `string \| null` | `null` | Mensaje de error explícito. |
| `helpText` | `string \| null` | `null` | Texto de ayuda. |
| `id` | `string \| null` | `null` | Id base del control. |
| `name` | `string \| null` | `null` | Nombre del control. |

## Model

| Model | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `Date \| string \| null` | `null` | Fecha seleccionada sin Angular Forms. |

---

# CSS Variables

Variables propias con el prefijo `--aesy-datepicker-`, más las comunes `--aesy-form-controls-*` del tema:

```css
:host {
  --aesy-datepicker-hover-background: #dfe8f9;
  --aesy-datepicker-calendar-today-day-color: #1d4ed8;
  --aesy-datepicker-calendar-today-day-color-hover: #2563eb;
  --aesy-datepicker-calendar-today-day-background: var(--aesy-form-controls-background);
  --aesy-datepicker-calendar-today-day-background-hover: #dfe8f9;
  --aesy-datepicker-calendar-other-color: #c5c3c3;
  --aesy-datepicker-calendar-selected-color: #ffffff;
  --aesy-datepicker-calendar-selected-color-hover: #f3f4f6;
  --aesy-datepicker-calendar-selected-background: #1d4ed8;
  --aesy-datepicker-calendar-selected-background-hover: #2563eb;
  --aesy-datepicker-calendar-disabled: #ececec;
}
```

El calendario se pinta en un overlay: declara las variables sobre el propio `aesy-datepicker` (no en un contenedor padre) para que se apliquen.
