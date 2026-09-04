# RadioButton

Componente de Radio Buttons reutilizable para Angular, desarrollado con Angular nativo, Signals y HTML/CSS, sin dependencias externas.

Permite seleccionar una única opción de un conjunto de valores, soportando valores primitivos y objetos, orientación horizontal o vertical, integración con Angular Forms, estados de validación, `disabled`, `readonly`, tamaños y personalización mediante CSS variables.

---

## Características

- Standalone Component.
- Angular Signals.
- `model()` para two-way binding.
- Integración con Angular Forms mediante `ControlValueAccessor`.
- Soporte para `[(value)]`.
- Soporte para `formControl` y `formControlName`.
- Opciones configurables mediante `options`.
- `label` opcional por opción.
- Valores de cualquier tipo mediante `value`.
- Soporte para valores primitivos.
- Soporte para objetos y arrays como valores.
- Comparación profunda de valores.
- Orientación horizontal o vertical.
- Estados `disabled` y `readonly`.
- Estado `invalid`.
- Mensaje de error.
- Texto de ayuda.
- Estado `required`.
- Tamaños `small`, `medium` y `large`.
- Soporte para `name` e `id`.
- Accesibilidad mediante elementos nativos `input[type="radio"]`.
- Navegación y comportamiento nativo de radio buttons.
- Personalización mediante CSS variables.
- Sin dependencias externas.

---

# Instalación

El componente es standalone, por lo que puede importarse directamente en el componente que lo utilice.

```ts
import { RadioButtonComponent } from './radio-button/radio-button.component';

@Component({
  standalone: true,
  imports: [
    RadioButtonComponent
  ]
})
export class MyComponent {}
```

---

# Uso básico

Definimos las opciones:

```ts
options = [
  { label: 'Hombre', value: 'M' },
  { label: 'Mujer', value: 'F' },
  { label: 'Otro', value: 'O' }
];

gender = 'M';
```

Y utilizamos el componente:

```html
<app-radio-button
  label="Género"
  [options]="options"
  [(value)]="gender"
/>
```

El valor seleccionado estará disponible en:

```ts
gender === 'M';
```

---

# Options

La propiedad principal del componente es `options`.

Cada opción utiliza la siguiente interfaz:

```ts
export interface RadioButtonOption {
  label?: string;
  value: any;
}
```

Por ejemplo:

```ts
options = [
  {
    label: 'España',
    value: 'ES'
  },
  {
    label: 'Francia',
    value: 'FR'
  },
  {
    label: 'Italia',
    value: 'IT'
  }
];
```

El `label` es opcional:

```ts
options = [
  {
    value: 'ES'
  },
  {
    value: 'FR'
  }
];
```

El `value` puede ser cualquier tipo de dato.

---

# Valores como objetos

El componente permite utilizar objetos como valores:

```ts
options = [
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

```html
<app-radio-button
  label="País"
  [options]="options"
  [(value)]="selectedCountry"
/>
```

En este caso se seleccionará correctamente `Francia`.

El componente no depende de que el objeto seleccionado sea la misma referencia que el objeto contenido en `options`.

Por ejemplo, estos dos objetos son diferentes referencias:

```ts
{ id: 2, code: 'FR' }
```

pero representan el mismo valor para el componente.

Para determinar si una opción está seleccionada se utiliza una comparación profunda mediante `areValuesEqual()`.

---

# Comparación de valores

El componente compara los valores de la siguiente manera:

1. Primero comprueba igualdad mediante `Object.is()`.
2. Si ambos valores son objetos o arrays, realiza una comparación profunda.
3. Los objetos pueden contener otros objetos o arrays.
4. Los valores primitivos se comparan directamente.

Por ejemplo:

```ts
value = {
  id: 1,
  country: {
    code: 'ES'
  }
};
```

es considerado igual que:

```ts
value = {
  id: 1,
  country: {
    code: 'ES'
  }
};
```

aunque sean referencias diferentes.

La utilidad utilizada para esta comparación es:

```ts
export function areValuesEqual(
  valueA: any,
  valueB: any
): boolean {
  if (Object.is(valueA, valueB)) {
    return true;
  }

  if (
    valueA === null ||
    valueB === null ||
    valueA === undefined ||
    valueB === undefined
  ) {
    return false;
  }

  if (
    typeof valueA !== 'object' ||
    typeof valueB !== 'object'
  ) {
    return false;
  }

  if (Array.isArray(valueA) !== Array.isArray(valueB)) {
    return false;
  }

  if (Array.isArray(valueA)) {
    if (valueA.length !== valueB.length) {
      return false;
    }

    return valueA.every((item, index) =>
      areValuesEqual(item, valueB[index])
    );
  }

  const keysA = Object.keys(valueA);
  const keysB = Object.keys(valueB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every(
    key =>
      Object.prototype.hasOwnProperty.call(valueB, key) &&
      areValuesEqual(valueA[key], valueB[key])
  );
}
```

---

# Two-way binding

El valor seleccionado se expone mediante `model()`:

```ts
readonly value = model<any>(null);
```

Por tanto, se puede utilizar:

```html
<app-radio-button
  [options]="options"
  [(value)]="selectedValue"
/>
```

También es posible establecer solamente el valor:

```html
<app-radio-button
  [options]="options"
  [value]="selectedValue"
/>
```

---

# Orientación

La propiedad `orientation` permite elegir entre orientación vertical y horizontal.

Por defecto:

```ts
orientation = 'vertical';
```

### Vertical

```html
<app-radio-button
  [options]="options"
  orientation="vertical"
/>
```

Resultado conceptual:

```text
○ Opción 1
○ Opción 2
○ Opción 3
```

### Horizontal

```html
<app-radio-button
  [options]="options"
  orientation="horizontal"
/>
```

Resultado conceptual:

```text
○ Opción 1    ○ Opción 2    ○ Opción 3
```

---

# Angular Forms

El componente implementa `ControlValueAccessor`, por lo que puede utilizarse directamente con Angular Forms.

## Reactive Forms

```ts
form = this.fb.group({
  gender: ['M']
});

options = [
  { label: 'Hombre', value: 'M' },
  { label: 'Mujer', value: 'F' },
  { label: 'Otro', value: 'O' }
];
```

```html
<form [formGroup]="form">

  <app-radio-button
    formControlName="gender"
    label="Género"
    [options]="options"
  />

</form>
```

El `FormControl` almacena únicamente el valor seleccionado:

```ts
'M'
```

No almacena el objeto completo:

```ts
{
  label: 'Hombre',
  value: 'M'
}
```

---

# FormControl con objetos

También es posible utilizar objetos como valor del `FormControl`:

```ts
options = [
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

form = this.fb.group({
  country: [
    {
      id: 2,
      code: 'FR'
    }
  ]
});
```

```html
<app-radio-button
  formControlName="country"
  label="País"
  [options]="options"
/>
```

La comparación profunda permite que Francia aparezca seleccionada aunque el objeto del `FormControl` sea una referencia diferente.

---

# Disabled

El componente puede deshabilitarse mediante:

```html
<app-radio-button
  [options]="options"
  [disabled]="true"
/>
```

Cuando está deshabilitado:

- No permite seleccionar opciones.
- Los inputs nativos están deshabilitados.
- Se aplica el estilo visual correspondiente.
- Si se utiliza Angular Forms, también respeta el estado disabled del `FormControl`.

También puede utilizarse:

```ts
form.controls['gender'].disable();
```

---

# Readonly

Los radio buttons nativos no disponen de un atributo `readonly`.

El componente implementa este comportamiento de forma controlada:

```html
<app-radio-button
  [options]="options"
  [readonly]="true"
/>
```

Cuando está en `readonly`:

- Se muestra la opción seleccionada.
- El usuario no puede cambiarla.
- El componente no se marca como `disabled`.
- El valor continúa formando parte de Angular Forms.
- El componente mantiene su valor actual.

La diferencia conceptual es:

| Estado | Puede cambiarse | FormControl |
|---|---:|---|
| Normal | Sí | Normal |
| Readonly | No | Normal |
| Disabled | No | Disabled |

---

# Required

Puede marcarse como obligatorio:

```html
<app-radio-button
  label="Método de pago"
  [options]="paymentOptions"
  [required]="true"
/>
```

Se mostrará:

```text
Método de pago *
```

`required` es principalmente una propiedad semántica/visual. Para validaciones de negocio en Angular Forms se recomienda utilizar también el validador correspondiente:

```ts
payment: [
  null,
  Validators.required
]
```

---

# Validación

El componente dispone de:

```ts
invalid
errorMessage
helpText
```

Por ejemplo:

```html
<app-radio-button
  label="Método de pago"
  [options]="paymentOptions"
  [invalid]="true"
  errorMessage="Debes seleccionar un método de pago"
/>
```

El estado inválido modifica visualmente los radio buttons y muestra el mensaje.

---

# Help text

También puede mostrarse información adicional:

```html
<app-radio-button
  label="Método de pago"
  [options]="paymentOptions"
  helpText="Selecciona el método que prefieras."
/>
```

El `helpText` se muestra cuando no existe un error visible.

---

# Tamaños

Se soportan tres tamaños:

```ts
'small' | 'medium' | 'large'
```

Por defecto:

```ts
size = 'medium';
```

Ejemplo:

```html
<app-radio-button
  size="small"
  ...
/>
```

```html
<app-radio-button
  size="medium"
  ...
/>
```

```html
<app-radio-button
  size="large"
  ...
/>
```

---

# Name

Puede especificarse el atributo `name` del grupo:

```html
<app-radio-button
  name="gender"
  [options]="genderOptions"
/>
```

Todos los radio buttons pertenecientes al mismo grupo utilizan ese `name`.

Si no se especifica, el componente genera automáticamente un nombre único para el grupo.

---

# ID

Puede especificarse un `id` base:

```html
<app-radio-button
  id="gender"
  [options]="genderOptions"
/>
```

El componente genera internamente IDs individuales para cada opción:

```text
gender-0
gender-1
gender-2
```

Esto permite asociar correctamente cada `label` con su radio button correspondiente.

---

# Accesibilidad

El componente utiliza elementos nativos:

```html
<input type="radio">
```

en lugar de simular completamente el comportamiento mediante elementos `div`.

Además, el grupo utiliza:

```html
role="radiogroup"
```

y se proporcionan atributos ARIA cuando son necesarios:

- `aria-labelledby`
- `aria-invalid`
- `aria-required`
- `aria-describedby`

Esto permite mantener un comportamiento accesible y compatible con tecnologías de asistencia.

---

# API

| Input / Model | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `options` | `RadioButtonOption[]` | `[]` | Opciones disponibles |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Orientación del grupo |
| `label` | `string` | `''` | Label del grupo |
| `required` | `boolean \| null` | `null` | Indica si el campo es obligatorio |
| `readonly` | `boolean` | `false` | Impide modificar la selección |
| `disabled` | `boolean` | `false` | Deshabilita el componente |
| `invalid` | `boolean` | `false` | Indica estado inválido |
| `errorMessage` | `string \| null` | `null` | Mensaje de error |
| `helpText` | `string \| null` | `null` | Texto de ayuda |
| `name` | `string \| null` | `null` | Nombre del grupo |
| `id` | `string \| null` | `null` | ID base del componente |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamaño |
| `value` | `any` | `null` | Valor seleccionado |

---

# RadioButtonOption

```ts
export interface RadioButtonOption {
  label?: string;
  value: any;
}
```

Ejemplo:

```ts
const options: RadioButtonOption[] = [
  {
    label: 'España',
    value: 'ES'
  },
  {
    label: 'Francia',
    value: 'FR'
  }
];
```

---

# CSS Variables

El componente utiliza variables CSS específicas con el prefijo:

```text
--radio-button-*
```

Esto evita conflictos con otros componentes.

Las principales variables disponibles son:

```css
:host {
  --radio-button-border-color: #d1d5db;
  --radio-button-border-hover-color: #9ca3af;
  --radio-button-border-focus-color: #3b82f6;
  --radio-button-border-checked-color: #3b82f6;

  --radio-button-background: #ffffff;
  --radio-button-disabled-background: #f3f4f6;
  --radio-button-readonly-background: #f9fafb;

  --radio-button-text-color: #374151;
  --radio-button-disabled-text-color: #9ca3af;

  --radio-button-error-color: #dc2626;
  --radio-button-label-color: #374151;
  --radio-button-help-color: #6b7280;

  --radio-button-control-background: #ffffff;
  --radio-button-control-border-color: #9ca3af;
  --radio-button-control-checked-color: #3b82f6;

  --radio-button-radius: 50%;
  --radio-button-size: 18px;

  --radio-button-gap: 0.5rem;
  --radio-button-options-gap: 0.75rem;

  --radio-button-font-size: 0.875rem;

  --radio-button-container-width: 100%;
}
```

---

# Personalización desde el componente consumidor

Las variables pueden sobrescribirse desde el componente que utiliza `RadioButton`.

Por ejemplo:

```css
.my-radio {
  --radio-button-control-checked-color: #10b981;
  --radio-button-border-focus-color: #10b981;
  --radio-button-options-gap: 1rem;
}
```

```html
<app-radio-button
  class="my-radio"
  label="País"
  [options]="countryOptions"
/>
```

De esta forma no es necesario modificar el CSS interno del componente.

---

# Ancho del contenedor

El ancho del contenedor interno también está expuesto mediante:

```css
--radio-button-container-width
```

Por defecto:

```css
--radio-button-container-width: 100%;
```

Puede modificarse desde el consumidor:

```css
.my-radio {
  --radio-button-container-width: 50%;
}
```

```html
<app-radio-button
  class="my-radio"
  [options]="options"
/>
```

Esto modifica el ancho del `.radio-button-container` interno sin necesidad de utilizar `::ng-deep`.

---

# Ejemplo completo

### TypeScript

```ts
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  RadioButtonComponent,
  RadioButtonOption
} from './radio-button';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RadioButtonComponent
  ],
  templateUrl: './example.component.html'
})
export class ExampleComponent {

  readonly countryOptions: RadioButtonOption[] = [
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
    },
    {
      label: 'Italia',
      value: {
        id: 3,
        code: 'IT'
      }
    }
  ];

  readonly form = this.fb.group({
    country: [
      {
        id: 2,
        code: 'FR'
      },
      Validators.required
    ]
  });

  constructor(
    private readonly fb: FormBuilder
  ) {}
}
```

### HTML

```html
<form [formGroup]="form">

  <app-radio-button
    id="country"
    name="country"
    label="País"
    [options]="countryOptions"
    orientation="vertical"
    formControlName="country"
    required
  />

</form>
```

Aunque el objeto del `FormControl` y el objeto de la opción sean referencias diferentes, la opción `Francia` será seleccionada correctamente gracias a la comparación profunda.

---

# Principio de diseño

El componente mantiene una separación clara entre:

### Configuración de las opciones

```ts
options = [
  {
    label: 'España',
    value: 'ES'
  }
];
```

### Valor de negocio

```ts
value = 'ES';
```

`options` define **qué opciones existen y cómo se muestran**.

`value` representa **qué opción está seleccionada**.

Por tanto, Angular Forms almacena siempre el `value`, no el objeto completo de `RadioButtonOption`.

---

# Dependencias

El componente no utiliza librerías externas.

Utiliza únicamente:

- Angular
- Angular Forms
- HTML nativo
- CSS
- Signals
- `ControlValueAccessor`

---

# Estructura recomendada

```text
radio-button/
├── radio-button.component.ts
├── radio-button.component.html
├── radio-button.component.css
├── radio-button.types.ts
└── are-values-equal.ts
```

Esta estructura mantiene separadas:

- lógica del componente
- template
- estilos
- tipos públicos
- utilidades de comparación

y permite reutilizar `areValuesEqual()` en futuros componentes que necesiten comparar valores complejos.