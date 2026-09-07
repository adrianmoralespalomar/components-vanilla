# InputNumberComponent

Componente numérico reutilizable desarrollado exclusivamente con **Angular, HTML y CSS**.

Está diseñado para trabajar tanto de forma independiente como integrado con **Angular Reactive Forms**.

No depende de PrimeNG ni de ninguna otra librería externa de componentes.

---

## Características

- Valor interno siempre como `number | null`.
- Soporte para `[(value)]`.
- Soporte para `[formControl]`.
- Soporte para `formControlName`.
- Integración completa con `ControlValueAccessor`.
- Detección automática de `Validators.required`.
- Mensajes de validación automáticos.
- Mensajes de error personalizados.
- Formato numérico mediante `Intl.NumberFormat`.
- Soporte para diferentes locales.
- Separadores de miles.
- Separador decimal dependiente del locale.
- Formateo dinámico durante la edición.
- Conservación de la posición lógica del cursor al aplicar separadores.
- Configuración de decimales mínimos y máximos.
- Restricción de decimales durante la edición.
- Redondeo o truncado visual.
- Límite seguro basado en `Number.MAX_SAFE_INTEGER`.
- Prefijo.
- Sufijo.
- Alineación izquierda, centrada o derecha.
- Valores mínimos y máximos.
- `step`.
- Botones de incremento/decremento opcionales.
- Posibilidad de permitir o impedir valores negativos.
- Formateo final al perder el foco.
- Estado `disabled`.
- Estado `readonly`.
- Estado `invalid` externo.
- Texto de ayuda.
- Label.
- Indicador automático de campo requerido.
- Iconos.
- Diferentes tamaños.
- Compatible con Angular Standalone Components.

---

# Instalación

Importar el componente directamente:

```ts
import { InputNumberComponent } from '@/form-controls/input-number/input-number.component';

@Component({
  imports: [
    InputNumberComponent
  ]
})
export class ExampleComponent {}
```

No es necesario importar ningún módulo adicional de una librería externa.

Si se utiliza con Angular Reactive Forms, será necesario importar `ReactiveFormsModule`:

```ts
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [
    ReactiveFormsModule,
    InputNumberComponent
  ]
})
export class ExampleComponent {}
```

---

# Formas de uso

El componente dispone de tres formas principales de utilización.

## 1. Uso independiente

```html
<app-input-number
  label="Precio"
  [value]="1234.56"
/>
```

El valor interno será:

```ts
1234.56
```

---

## 2. Two-way binding

```ts
precio = 1234.56;
```

```html
<app-input-number
  label="Precio"
  [(value)]="precio"
/>
```

El valor de `precio` siempre será un `number | null`.

Por ejemplo:

```ts
console.log(precio);
```

devuelve:

```ts
1234.56
```

Nunca devuelve:

```ts
'1.234,56'
```

ni:

```ts
'1234,56 €'
```

El formato mostrado al usuario es independiente del valor interno.

---

# 3. Uso con FormControl

```ts
precio = new FormControl<number | null>(1234.56);
```

```html
<app-input-number
  label="Precio"
  [formControl]="precio"
/>
```

El valor del `FormControl` será:

```ts
1234.56
```

Esto permite utilizar directamente el valor para realizar peticiones HTTP:

```ts
this.http.post('/api/precio', {
  precio: this.precio.value
});
```

No es necesario convertir el valor desde un string formateado.

---

# 4. Uso con formControlName

```ts
form = new FormGroup({
  precio: new FormControl<number | null>(1234.56)
});
```

```html
<form [formGroup]="form">

  <app-input-number
    label="Precio"
    formControlName="precio"
  />

</form>
```

---

# Formato numérico

El formato se controla mediante `locale`.

El componente utiliza `Intl.NumberFormat` para determinar automáticamente:

- Separador de miles.
- Separador decimal.
- Formato numérico correspondiente al locale.

## Español

```html
<app-input-number
  [value]="1234567.89"
  [locale]="'es-ES'"
/>
```

Muestra:

```text
1.234.567,89
```

Internamente:

```ts
1234567.89
```

## Inglés

```html
<app-input-number
  [value]="1234567.89"
  [locale]="'en-US'"
/>
```

Muestra:

```text
1,234,567.89
```

## Alemán

```html
<app-input-number
  [value]="1234567.89"
  [locale]="'de-DE'"
/>
```

Muestra:

```text
1.234.567,89
```

---

# Edición y formato dinámico

El valor mantiene el formato correspondiente al `locale` incluso mientras el usuario está editando.

Por ejemplo, utilizando:

```html
<app-input-number
  [value]="3444.57"
  [locale]="'es-ES'"
/>
```

El valor se muestra como:

```text
3.444,57
```

Al recibir el foco, el formato se mantiene:

```text
3.444,57
```

Los separadores de miles se actualizan dinámicamente cuando el usuario modifica la parte entera.

Por ejemplo:

```text
3.444,57
33.444,57
333.444,57
3.333.444,57
```

El componente mantiene la posición lógica del cursor aunque se añadan o eliminen separadores de miles.

Esto permite editar directamente el número formateado sin cambiar a un formato interno diferente durante el foco.

---

# Separador de miles

Por defecto se utilizan separadores de miles:

```ts
useGrouping = true
```

Por ejemplo:

```html
<app-input-number
  [value]="1234567.89"
  [locale]="'es-ES'"
/>
```

Muestra:

```text
1.234.567,89
```

Para desactivarlo:

```html
<app-input-number
  [value]="1234567.89"
  [useGrouping]="false"
/>
```

Muestra:

```text
1234567,89
```

---

# Decimales

Se pueden configurar los decimales mínimos y máximos mediante:

- `minFractionDigits`
- `maxFractionDigits`

Por ejemplo:

```html
<app-input-number
  [value]="1234.5"
  [minFractionDigits]="2"
  [maxFractionDigits]="2"
/>
```

Muestra:

```text
1.234,50
```

## Diferencia entre mínimo y máximo

```html
<app-input-number
  [value]="1234.5"
  [minFractionDigits]="2"
  [maxFractionDigits]="4"
/>
```

Resultados:

```text
1234     → 1.234,00
1234.5   → 1.234,50
1234.5678 → 1.234,5678
```

---

# Límite de decimales durante la edición

`maxFractionDigits` también establece el número máximo de decimales que el usuario puede introducir.

Por ejemplo:

```html
<app-input-number
  [maxFractionDigits]="2"
/>
```

Permite:

```text
12
12,3
12,34
```

Pero no permite:

```text
12,345
```

El tercer decimal no se acepta.

El componente no permite introducir un valor con más decimales para posteriormente redondearlo o truncarlo.

Esto evita modificaciones implícitas del valor introducido por el usuario.

---

# Redondeo y truncado

La propiedad:

```ts
roundingMode
```

admite:

```ts
'round'
'truncate'
```

Por defecto:

```ts
roundingMode = 'round'
```

## Redondeo

```html
<app-input-number
  [value]="12.789"
  [maxFractionDigits]="2"
  [roundingMode]="'round'"
/>
```

Muestra:

```text
12,79
```

## Truncado

```html
<app-input-number
  [value]="12.789"
  [maxFractionDigits]="2"
  [roundingMode]="'truncate'"
/>
```

Muestra:

```text
12,78
```

### Importante

El redondeo o truncado se utiliza para la **representación visual del valor**.

Por ejemplo, si un valor externo es:

```ts
12.789
```

y se configura:

```ts
maxFractionDigits = 2
roundingMode = 'round'
```

se mostrará:

```text
12,79
```

pero el valor interno continúa siendo:

```ts
12.789
```

Durante la edición, sin embargo, `maxFractionDigits` limita directamente los decimales que el usuario puede introducir.

---

# Límite seguro de Number

El valor interno del componente utiliza el tipo JavaScript:

```ts
number
```

JavaScript no puede representar con precisión arbitraria todos los números.

Por este motivo, el componente respeta el límite:

```ts
Number.MAX_SAFE_INTEGER
```

cuyo valor es:

```text
9007199254740991
```

En `es-ES`:

```text
9.007.199.254.740.991
```

La parte entera introducida por el usuario no puede superar este límite.

Por ejemplo:

```text
9.007.199.254.740.991
```

es válido.

Pero intentar introducir:

```text
9.007.199.254.740.992
```

es rechazado.

Cuando se intenta superar este límite:

- Se mantiene el último valor válido.
- No se actualiza el `FormControl`.
- No se modifica el valor de `[(value)]`.
- No se marca el `FormControl` como inválido.
- Se muestra un `console.warn`.

La restricción no representa un error de negocio ni una validación de Angular Forms, sino una limitación técnica necesaria para trabajar con valores `number`.

---

# Prefijo

Se puede añadir texto antes del número mediante `prefix`.

```html
<app-input-number
  label="Precio"
  [value]="1234.56"
  prefix="€ "
/>
```

Muestra:

```text
€ 1.234,56
```

El prefijo no forma parte del valor.

El valor sigue siendo:

```ts
1234.56
```

---

# Sufijo

También se puede añadir texto después del número mediante `suffix`.

```html
<app-input-number
  label="Descuento"
  [value]="15.5"
  suffix=" %"
/>
```

Muestra:

```text
15,5 %
```

El valor interno sigue siendo:

```ts
15.5
```

---

# Prefijo y sufijo simultáneamente

```html
<app-input-number
  label="Importe"
  [value]="1234.56"
  prefix="≈ "
  suffix=" €"
/>
```

Muestra:

```text
≈ 1.234,56 €
```

Ni el prefijo ni el sufijo forman parte del valor interno.

---

# Alineación

El contenido del input puede alinearse mediante `textAlign`.

Valores disponibles:

```ts
'left'
'center'
'right'
```

Por defecto:

```ts
textAlign = 'left'
```

## Izquierda

```html
<app-input-number
  [value]="1234.56"
  [textAlign]="'left'"
/>
```

## Centrado

```html
<app-input-number
  [value]="1234.56"
  [textAlign]="'center'"
/>
```

## Derecha

```html
<app-input-number
  [value]="1234.56"
  [textAlign]="'right'"
/>
```

La alineación únicamente afecta a la presentación visual.

---

# Valores mínimos y máximos

Se pueden indicar límites mediante `min` y `max`:

```html
<app-input-number
  [min]="0"
  [max]="100"
/>
```

También se pueden utilizar los validadores de Angular:

```ts
control = new FormControl<number | null>(null, {
  validators: [
    Validators.min(0),
    Validators.max(100)
  ]
});
```

En componentes conectados a Angular Forms se recomienda utilizar los validadores del `FormControl` como fuente principal de validación.

Los valores `min` y `max` también se utilizan para limitar los botones de incremento y decremento.

---

# Valores negativos

Por defecto:

```ts
allowNegative = true
```

Para impedir valores negativos:

```html
<app-input-number
  [allowNegative]="false"
/>
```

El signo negativo nunca forma parte de un prefijo o sufijo; forma parte del valor numérico.

---

# Step y botones

El incremento utilizado por los botones se define mediante `step`.

```html
<app-input-number
  [value]="10"
  [step]="1"
  [showButtons]="true"
/>
```

Permite:

```text
10
11
12
13
...
```

Para cantidades decimales:

```html
<app-input-number
  [value]="10"
  [step]="0.5"
  [showButtons]="true"
/>
```

Permite:

```text
10
10,5
11
11,5
...
```

Los botones respetan:

- `min`
- `max`
- `disabled`
- `readonly`

---

# Validación

El componente utiliza la validación de Angular Forms cuando está conectado a un `FormControl`.

Por ejemplo:

```ts
importe = new FormControl<number | null>(null, {
  validators: [
    Validators.required,
    Validators.min(0),
    Validators.max(10000)
  ]
});
```

```html
<app-input-number
  label="Importe"
  prefix="€ "
  [formControl]="importe"
/>
```

El componente detectará automáticamente que el campo es obligatorio y mostrará:

```text
*
```

junto al label.

Los mensajes predeterminados incluyen:

```text
Campo obligatorio

El valor mínimo es 0

El valor máximo es 10000

Formato inválido

Valor inválido
```

---

# Mensaje de error personalizado

Se puede sobrescribir el mensaje automático:

```html
<app-input-number
  label="Importe"
  [formControl]="importe"
  errorMessage="Introduce un importe válido"
/>
```

El mensaje personalizado tiene prioridad sobre el mensaje predeterminado.

También permite trabajar con errores personalizados que proporcionen un mensaje:

```ts
const validator = (control: AbstractControl) => {

  if (control.value !== 100) {
    return {
      importeInvalido: {
        message: 'El importe debe ser exactamente 100'
      }
    };
  }

  return null;
};
```

El componente utilizará automáticamente el `message`.

---

# Estado readonly

```html
<app-input-number
  [value]="1234.56"
  [readonly]="true"
/>
```

El usuario podrá visualizar y seleccionar el valor, pero no modificarlo.

---

# Estado disabled

```html
<app-input-number
  [value]="1234.56"
  [disabled]="true"
/>
```

Cuando se utiliza Angular Forms también se respeta:

```ts
control.disable();

control.enable();
```

El estado `disabled` del `FormControl` tiene prioridad cuando el componente está integrado con Angular Forms.

---

# Texto de ayuda

```html
<app-input-number
  label="Importe"
  helpText="Introduce el importe sin impuestos"
/>
```

El texto aparece debajo del campo cuando no se está mostrando un mensaje de error.

---

# Iconos

Se puede proporcionar un icono mediante:

```html
<app-input-number
  label="Importe"
  icon="€"
/>
```

La posición puede ser:

```html
<app-input-number
  icon="€"
  [iconPosition]="'left'"
/>
```

o:

```html
<app-input-number
  icon="€"
  [iconPosition]="'right'"
/>
```

Actualmente `icon` representa el contenido visual del icono. La implementación puede sustituirse posteriormente por un sistema de iconos propio sin modificar el funcionamiento del componente.

---

# Tamaños

Admite tres tamaños:

```ts
'small'
'medium'
'large'
```

Por defecto:

```ts
size = 'medium'
```

Ejemplo:

```html
<app-input-number
  [size]="'small'"
/>
```

```html
<app-input-number
  [size]="'medium'"
/>
```

```html
<app-input-number
  [size]="'large'"
/>
```

---

# API

| Propiedad | Tipo | Default | Descripción |
|---|---|---:|---|
| `value` | `number \| null` | `null` | Valor del componente |
| `label` | `string` | `''` | Etiqueta |
| `placeholder` | `string` | `''` | Placeholder |
| `locale` | `string` | `'es-ES'` | Locale utilizado para el formato |
| `useGrouping` | `boolean` | `true` | Utiliza separadores de miles |
| `minFractionDigits` | `number` | `0` | Mínimo de decimales mostrados |
| `maxFractionDigits` | `number` | `2` | Máximo de decimales permitidos |
| `roundingMode` | `'round' \| 'truncate'` | `'round'` | Redondeo o truncado visual |
| `formatOnBlur` | `boolean` | `true` | Aplica el formato final al perder el foco |
| `allowNegative` | `boolean` | `true` | Permite valores negativos |
| `min` | `number \| null` | `null` | Valor mínimo |
| `max` | `number \| null` | `null` | Valor máximo |
| `step` | `number \| null` | `null` | Incremento utilizado por los botones |
| `prefix` | `string` | `''` | Texto antes del valor |
| `suffix` | `string` | `''` | Texto después del valor |
| `textAlign` | `'left' \| 'center' \| 'right'` | `'left'` | Alineación del valor |
| `showButtons` | `boolean` | `false` | Muestra botones de incremento/decremento |
| `readonly` | `boolean` | `false` | Solo lectura |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `required` | `boolean \| null` | `null` | Required manual o automático |
| `invalid` | `boolean` | `false` | Estado inválido externo |
| `errorMessage` | `string \| null` | `null` | Mensaje de error personalizado |
| `helpText` | `string \| null` | `null` | Texto de ayuda |
| `icon` | `string \| null` | `null` | Icono |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Posición del icono |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamaño |
| `id` | `string \| null` | `null` | ID HTML personalizado |

---

# Integración con Angular Forms

El componente implementa `ControlValueAccessor`, por lo que Angular Forms gestiona automáticamente:

- Valor.
- Cambios.
- `touched`.
- `dirty`.
- `disabled`.
- Validaciones.
- Errores.
- `formControl`.
- `formControlName`.

No es necesario implementar lógica adicional en el componente padre.

Ejemplo:

```ts
form = new FormGroup({

  precio: new FormControl<number | null>(1234.5, [
    Validators.required,
    Validators.min(0),
    Validators.max(100000)
  ]),

  descuento: new FormControl<number | null>(15.5, [
    Validators.min(0),
    Validators.max(100)
  ])

});
```

```html
<form [formGroup]="form">

  <app-input-number
    label="Precio"
    formControlName="precio"
    prefix="€ "
    [locale]="'es-ES'"
    [minFractionDigits]="2"
    [maxFractionDigits]="2"
    [textAlign]="'right'"
  />

  <app-input-number
    label="Descuento"
    formControlName="descuento"
    suffix=" %"
    [minFractionDigits]="2"
    [maxFractionDigits]="2"
    [textAlign]="'right'"
  />

</form>
```

Angular mantiene:

```ts
form.value
```

como:

```ts
{
  precio: 1234.5,
  descuento: 15.5
}
```

No se almacenan los separadores, prefijos, sufijos ni el formato visual.

---

# Ejemplo completo

### TypeScript

```ts
import {
  Component
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  InputNumberComponent
} from './input-number/input-number.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputNumberComponent
  ],
  templateUrl: './example.component.html'
})
export class ExampleComponent {

  form = new FormGroup({

    precio: new FormControl<number | null>(1234.5, {
      validators: [
        Validators.required,
        Validators.min(0),
        Validators.max(100000)
      ]
    }),

    descuento: new FormControl<number | null>(15.5, {
      validators: [
        Validators.min(0),
        Validators.max(100)
      ]
    }),

    cantidad: new FormControl<number | null>(10, {
      validators: [
        Validators.required,
        Validators.min(0)
      ]
    })

  });

}
```

### HTML

```html
<form [formGroup]="form">

  <app-input-number
    label="Precio"
    formControlName="precio"
    prefix="€ "
    [locale]="'es-ES'"
    [minFractionDigits]="2"
    [maxFractionDigits]="2"
    [textAlign]="'right'"
  />

  <app-input-number
    label="Descuento"
    formControlName="descuento"
    suffix=" %"
    [minFractionDigits]="2"
    [maxFractionDigits]="2"
    [textAlign]="'right'"
  />

  <app-input-number
    label="Cantidad"
    formControlName="cantidad"
    [step]="1"
    [showButtons]="true"
  />

</form>
```

Visualmente:

```text
Precio

€                         1.234,50

Descuento

                           15,50 %

Cantidad

                              10
                           ▲
                           ▼
```

Mientras que Angular mantiene:

```ts
form.value
```

como:

```ts
{
  precio: 1234.5,
  descuento: 15.5,
  cantidad: 10
}
```

---

# Arquitectura

```text
input-number/
├── input-number.component.ts
├── input-number.component.html
├── input-number.component.css
├── number.utils.ts
└── validation.utils.ts
```

## `input-number.component.ts`

Responsable de:

- API pública.
- Integración con Angular Forms.
- `ControlValueAccessor`.
- Estado del componente.
- Eventos de usuario.
- Incrementos/decrementos.
- Comunicación entre el valor interno y la representación visual.

## `number.utils.ts`

Responsable de:

- Conversión texto → número.
- Formateo número → texto.
- Localización.
- Detección de separadores.
- Formateo dinámico durante la edición.
- Gestión de decimales.
- Gestión del cursor.
- Redondeo.
- Truncado.
- Validación del límite seguro de `Number`.

## `validation.utils.ts`

Responsable de:

- Detección de `required`.
- Mensajes de validación.
- Errores personalizados.

---

# Dependencias

El componente no utiliza:

- PrimeNG.
- Angular Material.
- Bootstrap.
- Librerías externas de componentes.

Las únicas dependencias son las proporcionadas por Angular, principalmente:

- Angular Core.
- Angular Forms cuando se utiliza integración con formularios.
- APIs nativas del navegador como `Intl.NumberFormat`.

---

# Principio fundamental

El componente separa completamente:

**Valor de negocio**

```ts
1234567.89
```

de:

**Representación visual**

```text
1.234.567,89 €
```

El valor utilizado por Angular Forms y `[(value)]` siempre es:

```ts
number | null
```

mientras que el formato visual puede depender de:

- `locale`
- `useGrouping`
- `minFractionDigits`
- `maxFractionDigits`
- `roundingMode`
- `prefix`
- `suffix`

Esto permite utilizar el componente directamente con APIs, formularios y modelos TypeScript sin necesidad de convertir strings formateados a números antes de enviar los datos al backend.

Además, las restricciones técnicas de JavaScript `Number`, como `Number.MAX_SAFE_INTEGER`, se gestionan durante la edición para evitar almacenar valores que no puedan representarse de forma segura.