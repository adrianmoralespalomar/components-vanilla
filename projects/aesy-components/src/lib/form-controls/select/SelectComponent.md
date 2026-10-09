# Select

Componente `Select` de Angular con dropdown propio, integración completa con Angular Forms y soporte para selección simple y múltiple.

La arquitectura está alineada con los componentes `InputText` y `Textarea`.

## Características

- Integración con `NgControl` y `ControlValueAccessor`.
- Compatible con Reactive Forms.
- Uso independiente de Angular Forms mediante `[(value)]`.
- Selección simple o múltiple.
- Valores `T | null` en selección simple.
- Valores `T[]` en selección múltiple.
- Comparación profunda de valores mediante `areValuesEqual()`.
- Detección automática de `required` desde el `FormControl`.
- Mensajes de validación mediante `getValidationErrorMessage`.
- Estados `touched` y `dirty`.
- Soporte para `invalid` manual cuando se utiliza sin Forms.
- Opciones individuales `disabled`.
- Estado `disabled`.
- Estado `readonly`.
- Opción `clearable`.
- Icono junto a las opciones seleccionadas (`showSelectedIcon`).
- Alineación del texto seleccionado (`textAlign`).
- Placeholder.
- Label, help text y mensajes de error.
- ID interno basado en `${id}-select`.
- Dropdown propio; no utiliza el `<select>` nativo.
- Búsqueda opcional dentro del desplegable (`searchable`), sin distinguir mayúsculas ni tildes.
- Navegación mediante teclado; la opción resaltada se mantiene visible al moverse por listas largas.
- Atributos ARIA básicos para accesibilidad.
- Implementación con `OnPush` y Signals.

## API

### Inputs

| Input          | Tipo                             |                   Default | Descripción                                                                            |
| -------------- | -------------------------------- | ------------------------: | -------------------------------------------------------------------------------------- |
| `options`      | `SelectOption[]`                 |                      `[]` | Opciones disponibles.                                                                  |
| `multiple`     | `boolean`                        |                   `false` | Permite seleccionar varias opciones.                                                   |
| `label`        | `string`                         |                      `''` | Texto del label.                                                                       |
| `placeholder`  | `string`                         | `'Selecciona una opción'` | Texto mostrado cuando no hay selección.                                                |
| `clearable`    | `boolean`                        |                   `false` | Permite limpiar la selección.                                                          |
| `searchable`   | `boolean`                        |                   `false` | Muestra un campo arriba del desplegable que filtra las opciones por su texto.          |
| `searchPlaceholder` | `string`                    |               `'Buscar…'` | Placeholder y nombre accesible del campo de búsqueda.                                  |
| `noSearchResultsText` | `string`                  |        `'Sin resultados'` | Texto cuando la búsqueda no encuentra ninguna opción.                                  |
| `showSelectedIcon` | `boolean`                    |                   `false` | Muestra un check junto a las opciones seleccionadas en el desplegable.                 |
| `textAlign`    | `'left' \| 'center' \| 'right'`  |                  `'left'` | Alineación del texto seleccionado.                                                     |
| `readonly`     | `boolean`                        |                   `false` | Impide modificar la selección.                                                         |
| `disabled`     | `boolean`                        |                   `false` | Deshabilita el componente cuando no está ligado a Forms.                               |
| `required`     | `boolean \| null`                |                    `null` | Indica si el campo es obligatorio. Con `null`, se detecta automáticamente desde Forms. |
| `invalid`      | `boolean`                        |                   `false` | Permite establecer manualmente el estado inválido sin Angular Forms.                   |
| `errorMessage` | `string \| null`                 |                    `null` | Mensaje de error explícito. Sobrescribe el mensaje automático.                         |
| `helpText`     | `string \| null`                 |                    `null` | Texto de ayuda.                                                                        |
| `id`           | `string \| null`                 |                    `null` | ID proporcionado por el consumidor.                                                    |
| `name`         | `string \| null`                 |                    `null` | Nombre del control.                                                                    |

### Model

| Model   | Tipo                   | Descripción                                          |
| ------- | ---------------------- | ---------------------------------------------------- |
| `value` | `any \| any[] \| null` | Valor para utilizar el componente sin Angular Forms. |

El tipo efectivo depende de `multiple`:

**Single**

```ts
T | null;
```

**Multiple**

```ts
T[]
```

### Outputs

| Output               | Tipo                   | Descripción                                   |
| -------------------- | ---------------------- | --------------------------------------------- |
| `selectValueChanged` | `any \| any[] \| null` | Se emite cada vez que cambia la selección.    |

```html
<aesy-select [options]="countries" (selectValueChanged)="onCountrySelected($event)" />
```

---

## `SelectOption`

Las opciones tienen la siguiente estructura:

```ts
export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}
```

### Propiedades

| Propiedad  | Tipo      | Descripción                     |
| ---------- | --------- | ------------------------------- |
| `label`    | `string`  | Texto mostrado al usuario.      |
| `value`    | `any`     | Valor asociado a la opción.     |
| `disabled` | `boolean` | Impide seleccionar esta opción. |

---

## Uso sin Angular Forms

El componente puede utilizarse mediante `[(value)]`.

### Selección simple

```ts
countries = [
  { label: 'España', value: 'ES' },
  { label: 'Francia', value: 'FR' },
  { label: 'Italia', value: 'IT' },
  { label: 'Portugal', value: 'PT' }
];

country = 'ES';
```

```html
<aesy-select label="País" [options]="countries" [(value)]="country" placeholder="Selecciona un país" [clearable]="true" />
```

El valor seleccionado será:

```ts
'ES';
```

Al limpiar la selección:

```ts
null;
```

---

## Selección múltiple

Para activar la selección múltiple:

```html
<aesy-select label="Países" [options]="countries" [multiple]="true" [(value)]="selectedCountries" [clearable]="true" />
```

```ts
selectedCountries = ['ES', 'FR'];
```

El valor tendrá la forma:

```ts
['ES', 'FR'];
```

Al limpiar:

```ts
[];
```

---

## Valores complejos

El valor de una opción puede ser un objeto.

```ts
countries = [
  {
    label: 'España',
    value: {
      id: 1,
      code: 'ES'
    }
  },
  {
    label: 'Francia',
    value: {
      id: 2,
      code: 'FR'
    }
  }
];

selectedCountry = {
  id: 2,
  code: 'FR'
};
```

La selección se determina mediante `areValuesEqual()`.

Por tanto, el componente puede reconocer como seleccionado un objeto equivalente aunque no sea necesariamente la misma referencia de objeto.

---

## Reactive Forms

El componente implementa `ControlValueAccessor`, por lo que puede utilizarse con `formControlName`.

```ts
form = new FormGroup({
  country: new FormControl<string | null>(null, Validators.required),

  countries: new FormControl<string[]>([], Validators.required)
});
```

### Single

```html
<aesy-select label="País" [options]="countries" formControlName="country" [clearable]="true" />
```

### Multiple

```html
<aesy-select label="Países" [options]="countries" [multiple]="true" formControlName="countries" [clearable]="true" />
```

---

## Integración con validación

Cuando el componente está conectado a un `FormControl`, obtiene automáticamente el estado del formulario.

Se contemplan:

- `required`.
- `invalid`.
- `touched`.
- `dirty`.
- Errores del `FormControl`.

El `required` se detecta automáticamente mediante:

```ts
hasRequiredValidator(this.control);
```

Por ejemplo:

```ts
country = new FormControl<string | null>(null, Validators.required);
```

El componente detectará que el campo es obligatorio sin necesidad de:

```html
[required]="true"
```

También puede sobrescribirse manualmente:

```html
[required]="false"
```

o:

```html
[required]="true"
```

---

## Mensajes de error

Los mensajes de validación se obtienen mediante:

```ts
getValidationErrorMessage(...)
```

También se puede proporcionar un mensaje explícito:

```html
<aesy-select label="País" [options]="countries" formControlName="country" errorMessage="Debes seleccionar un país." />
```

El `errorMessage` explícito sobrescribe el mensaje automático.

---

## Estado `invalid` sin Forms

Cuando el componente se utiliza sin Angular Forms, el estado de error puede establecerse manualmente:

```html
<aesy-select label="País" [options]="countries" [(value)]="country" [invalid]="hasError" errorMessage="Selecciona un país." />
```

En este modo no depende de `touched` o `dirty` de un `FormControl`.

---

## `clearable`

Permite limpiar la selección actual.

```html
<aesy-select [options]="countries" [(value)]="country" [clearable]="true" />
```

Comportamiento:

- Single → `null`.
- Multiple → `[]`.

El botón de limpieza solamente está disponible cuando existe una selección y el componente no está `disabled` ni `readonly`.

---

## Búsqueda (`searchable`)

Para listas largas, `searchable` añade un campo arriba del desplegable que filtra las opciones por su `label`, sin distinguir mayúsculas ni tildes: «espana» encuentra «España».

```html
<aesy-select label="País" [searchable]="true" [options]="countries" [(value)]="country" />

<aesy-select
  label="Tecnologías"
  searchPlaceholder="Buscar tecnología…"
  noSearchResultsText="Ninguna tecnología coincide"
  [searchable]="true"
  [multiple]="true"
  [options]="skills"
  [(value)]="selectedSkills" />
```

Comportamiento:

- Al abrir, el foco va al campo de búsqueda.
- Con el select cerrado, escribir sobre él lo abre y empieza a buscar con lo escrito.
- Las flechas recorren las opciones filtradas y Enter elige la resaltada; Escape cierra y devuelve el foco al select.
- En selección múltiple el desplegable sigue abierto y la búsqueda se mantiene mientras eliges.
- Al cerrar, la búsqueda se vacía.
- El filtrado es solo visual: el valor y las opciones (`options`) no cambian.

Variables CSS del buscador (decláralas sobre `aesy-select`, porque se copian al overlay): `--aesy-select-dropdown-search-background` y `--aesy-select-dropdown-search-height`. La altura máxima del desplegable es `--aesy-select-dropdown-max-height` (`16rem`).

---

## `disabled`

### Sin Forms

```html
<aesy-select [options]="countries" [(value)]="country" [disabled]="true" />
```

### Con Forms

El estado `disabled` se obtiene del `FormControl` mediante `ControlValueAccessor`.

```ts
form.controls.country.disable();
```

En este caso, el estado del componente se actualiza automáticamente.

---

## `readonly`

`readonly` impide modificar la selección pero mantiene el componente visible y operativo como elemento de lectura.

```html
<aesy-select [options]="countries" [(value)]="country" [readonly]="true" />
```

---

## Opciones deshabilitadas

Una opción individual puede deshabilitarse:

```ts
countries = [
  { label: 'España', value: 'ES' },
  { label: 'Francia', value: 'FR', disabled: true },
  { label: 'Italia', value: 'IT' }
];
```

Una opción `disabled`:

- No puede seleccionarse.
- No participa en la navegación mediante teclado.
- Se muestra visualmente como deshabilitada.

---

## Teclado

El dropdown proporciona navegación básica mediante teclado.

| Tecla       | Comportamiento                                        |
| ----------- | ----------------------------------------------------- |
| `ArrowDown` | Abre el dropdown o mueve el highlight hacia abajo.    |
| `ArrowUp`   | Abre el dropdown o mueve el highlight hacia arriba.   |
| `Enter`     | Abre el dropdown o selecciona la opción destacada.    |
| `Space`     | Abre el dropdown o selecciona la opción destacada.    |
| `Escape`    | Cierra el dropdown.                                   |
| `Tab`       | Cierra el dropdown y permite continuar la navegación. |

Las opciones `disabled` se saltan durante la navegación.

Con `searchable`, dentro del campo de búsqueda: `ArrowDown` / `ArrowUp` mueven el highlight por las opciones filtradas, `Enter` selecciona la destacada, `Escape` cierra y `Tab` cierra y continúa. Con el select cerrado, cualquier carácter lo abre y empieza la búsqueda.

---

## Accesibilidad

El componente utiliza:

- `aria-invalid`.
- `aria-required`.
- `aria-expanded`.
- `aria-controls`.
- `aria-haspopup="listbox"`.
- `aria-selected`.
- `aria-disabled`.
- `aria-multiselectable`.
- `role="listbox"`.
- `role="option"`.
- `role="alert"` para errores.
- Con `searchable`: el campo es un `role="combobox"` con `aria-controls` hacia la lista y `aria-activedescendant` hacia la opción resaltada; «sin resultados» se anuncia con `role="status"`.

El `label` se asocia con el trigger mediante el ID del componente.

---

## IDs

Si se proporciona:

```html
<aesy-select id="country" />
```

el ID interno del select será:

```text
country-select
```

El listbox utiliza:

```text
country-select-listbox
```

Si no se proporciona un ID, el componente genera uno automáticamente:

```text
aesy-select-0-select
aesy-select-1-select
...
```

---

## Arquitectura interna

El componente mantiene tres piezas principales de estado cuando está integrado con Forms:

```ts
formValue;
formDisabled;
formStateVersion;
```

### `formValue`

Representa el valor recibido desde el `FormControl`.

### `formDisabled`

Representa el estado `disabled` proporcionado por Angular Forms.

### `formStateVersion`

Se utiliza para provocar la reevaluación visual cuando cambia el estado interno del `FormControl`, incluyendo cambios relacionados con:

- value
- status
- touched
- dirty
- pristine

El componente escucha `control.events` para mantenerse sincronizado con cambios realizados externamente sobre el `FormControl`.

---

## ControlValueAccessor

El componente implementa:

```ts
writeValue(...)
registerOnChange(...)
registerOnTouched(...)
setDisabledState(...)
```

Esto permite que Angular Forms controle el valor y estado del componente de forma equivalente a otros controles de formulario.

---

## Comparación de valores

La selección no depende únicamente de igualdad por referencia.

Para determinar si una opción está seleccionada se utiliza:

```ts
areValuesEqual(value, option.value);
```

Esto permite trabajar con valores complejos y mantener el mismo comportamiento definido para otros componentes que utilizan esta utilidad.

---

## Dropdown

El componente utiliza un dropdown propio.

No utiliza:

```html
<select></select>
```

ni depende del comportamiento visual del elemento `<select>` nativo.

El dropdown:

- Se posiciona debajo del trigger.
- Tiene scroll cuando existen muchas opciones.
- Permite navegación por teclado.
- Destaca la opción actualmente navegada.
- Marca visualmente las opciones seleccionadas.
- Soporta opciones deshabilitadas.
- Muestra un estado vacío cuando no hay opciones.
- Al abrirse, se desplaza hasta la opción seleccionada.
- Con `searchable`, muestra un campo de búsqueda fijo arriba; solo hace scroll la lista.

---

## OnPush y Signals

El componente utiliza:

```ts
ChangeDetectionStrategy.OnPush;
```

y Signals para el estado interno.

Entre los estados gestionados mediante Signals se encuentran:

```ts
isOpen;
highlightedIndex;
formValue;
formDisabled;
formStateVersion;
```

Esto mantiene el componente alineado con la arquitectura utilizada por `InputText` y `Textarea`.

---

## Nota de implementación

La implementación inicial del template debe evitar colocar botones dentro del botón principal del trigger.

En particular, en selección múltiple los tags no deberían implementar la eliminación individual mediante:

```html
<button>
  ...
  <button>...</button>
</button>
```

ya que esto produce un `<button>` anidado dentro de otro `<button>`, que es HTML inválido.

La versión definitiva debería resolver la interacción de los tags sin botones interactivos anidados, manteniendo la semántica y accesibilidad del trigger.

---

## Decisiones de diseño

### Se mantiene

- Arquitectura `ControlValueAccessor`.
- Integración con `NgControl`.
- Signals.
- `OnPush`.
- Validación automática.
- `touched` / `dirty`.
- `required` automático.
- `areValuesEqual()`.
- Single y multiple.
- `clearable`.
- `disabled`.
- `readonly`.
- Dropdown propio.
- Accesibilidad básica.
- Búsqueda de opciones (`searchable`).

### No se incluye todavía

- Async options.
- Virtual scrolling.
- Agrupación de opciones.
- Custom templates para opciones.
- Posicionamiento avanzado del dropdown.

Estas funcionalidades no forman parte del alcance definido para esta versión.
