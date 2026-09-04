# InputTextComponent

Componente reutilizable de Angular para introducir texto, diseñado para funcionar tanto de forma independiente como integrado con **Angular Reactive Forms**.

El componente está construido únicamente con **Angular, HTML y CSS**, sin dependencias de librerías externas de componentes UI.

## Características

- Soporte para texto, email y contraseña.
- Uso independiente de formularios.
- Soporte para `[formControl]`.
- Soporte para `formControlName`.
- Implementación de `ControlValueAccessor`.
- Detección automática de `Validators.required`.
- Indicador `*` automático para campos obligatorios.
- Mensajes de validación automáticos.
- Soporte para mensajes de error personalizados.
- Soporte para `maxlength`.
- Contador de caracteres.
- Posibilidad de permitir valores inválidos temporalmente.
- Estado `disabled`.
- Estado `readonly`.
- Texto de ayuda.
- Iconos.
- Mostrar/ocultar contraseña.
- Diferentes tamaños.
- Estados visuales de error.
- Compatible con Angular Standalone Components.

---

# Instalación

El componente es standalone, por lo que solamente es necesario importarlo donde se vaya a utilizar.

```ts
import { InputTextComponent } from './input-text/input-text.component';

@Component({
  standalone: true,
  imports: [
    InputTextComponent
  ]
})
export class ExampleComponent {}
```

Si se utiliza con Reactive Forms, también será necesario importar `ReactiveFormsModule`.

```ts
import { ReactiveFormsModule } from '@angular/forms';
```

Por ejemplo:

```ts
@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextComponent
  ]
})
export class ExampleComponent {}
```

---

# Formas de uso

El componente puede utilizarse de tres formas diferentes.

## 1. Uso independiente

Cuando no necesitamos Angular Forms podemos utilizar `[(value)]`.

### TypeScript

```ts
nombre = '';
```

### HTML

```html
<app-input-text
  label="Nombre"
  placeholder="Introduce tu nombre"
  [(value)]="nombre"
/>
```

El valor del componente queda sincronizado con la variable:

```ts
nombre
```

---

## 2. Uso con `[formControl]`

Podemos utilizar directamente un `FormControl`.

### TypeScript

```ts
nombreControl = new FormControl('', {
  validators: [
    Validators.required,
    Validators.maxLength(50)
  ]
});
```

### HTML

```html
<app-input-text
  label="Nombre"
  placeholder="Introduce tu nombre"
  [formControl]="nombreControl"
/>
```

El componente se integra automáticamente con Angular Forms.

No es necesario indicar manualmente:

```html
[required]="true"
```

El componente detectará que el `FormControl` tiene:

```ts
Validators.required
```

y mostrará automáticamente el `*` en el label.

---

## 3. Uso con `formControlName`

También puede utilizarse dentro de un `FormGroup`.

### TypeScript

```ts
form = new FormGroup({
  nombre: new FormControl('', {
    validators: [
      Validators.required,
      Validators.maxLength(50)
    ]
  }),

  email: new FormControl('', {
    validators: [
      Validators.required,
      Validators.email
    ]
  })
});
```

### HTML

```html
<form [formGroup]="form">

  <app-input-text
    label="Nombre"
    placeholder="Introduce tu nombre"
    formControlName="nombre"
  />

  <app-input-text
    label="Email"
    placeholder="Introduce tu email"
    type="email"
    formControlName="email"
  />

</form>
```

---

# Validaciones

El componente utiliza las validaciones proporcionadas por Angular Forms.

Por ejemplo:

```ts
nombreControl = new FormControl('', {
  validators: [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)
  ]
});
```

Los errores se muestran automáticamente cuando el campo ha sido tocado o modificado.

## Mensajes por defecto

| Validator | Mensaje |
|---|---|
| `required` | Campo obligatorio |
| `minlength` | La longitud mínima es X caracteres |
| `maxlength` | La longitud máxima es X caracteres |
| `email` | Formato de email inválido |
| `pattern` | Formato inválido |
| `min` | El valor mínimo es X |
| `max` | El valor máximo es X |
| Otro error | Valor inválido |

---

# Mensajes personalizados

Los validators pueden devolver su propio mensaje.

Por ejemplo:

```ts
const nombreValidator = (
  control: AbstractControl
) => {
  if (control.value !== 'Adrian') {
    return {
      nombreInvalido: {
        message: 'El nombre introducido no es válido'
      }
    };
  }

  return null;
};
```

El componente detectará automáticamente el `message` y lo mostrará.

También podemos proporcionar un mensaje directamente al componente:

```html
<app-input-text
  label="Nombre"
  [formControl]="nombreControl"
  errorMessage="El nombre no es válido"
/>
```

El `errorMessage` proporcionado al componente tiene prioridad sobre el mensaje automático.

---

# Campo obligatorio

No es necesario indicar `required` manualmente cuando utilizamos Angular Forms.

Por ejemplo:

```ts
nombreControl = new FormControl('', Validators.required);
```

```html
<app-input-text
  label="Nombre"
  [formControl]="nombreControl"
/>
```

El componente detectará automáticamente el validator y mostrará:

```text
Nombre *
```

También podemos forzar manualmente el estado:

```html
<app-input-text
  label="Nombre"
  [required]="true"
/>
```

Si queremos desactivarlo explícitamente:

```html
<app-input-text
  label="Nombre"
  [required]="false"
/>
```

Cuando `required` no se especifica, el componente intenta detectarlo automáticamente desde el `FormControl`.

---

# Longitud máxima

Podemos establecer `maxlength` directamente:

```html
<app-input-text
  label="Nombre"
  maxlength="50"
/>
```

También podemos establecerlo desde el validator:

```ts
nombreControl = new FormControl('', Validators.maxLength(50));
```

```html
<app-input-text
  label="Nombre"
  [formControl]="nombreControl"
/>
```

---

# Contador de caracteres

Podemos mostrar un contador mediante:

```html
<app-input-text
  label="Nombre"
  maxlength="50"
  [showCharCount]="true"
/>
```

El resultado será similar a:

```text
Nombre
┌──────────────────────────────────┐
│ Adrian                           │
└──────────────────────────────────┘
                         6 / 50
```

El contador funciona tanto utilizando `maxlength` como obteniendo el límite desde `Validators.maxLength`.

---

# Permitir valores inválidos

Por defecto, cuando existe `maxlength`, el atributo HTML `maxlength` impide que el usuario escriba más caracteres.

```html
<app-input-text
  label="Nombre"
  maxlength="10"
/>
```

Si queremos permitir que el usuario escriba más caracteres y que sea Angular Forms quien marque el campo como inválido:

```html
<app-input-text
  label="Nombre"
  maxlength="10"
  [allowTypeInvalidValue]="true"
  [formControl]="nombreControl"
/>
```

Esto permite mostrar, por ejemplo:

```text
123456789012345
❌ La longitud máxima es 10 caracteres
```

Esta opción es especialmente útil cuando queremos que el usuario pueda visualizar el error de validación en lugar de impedir físicamente la entrada.

---

# Contraseña

Podemos utilizar:

```html
<app-input-text
  label="Contraseña"
  type="password"
/>
```

El componente incorpora un botón para mostrar u ocultar la contraseña.

También puede utilizarse con Angular Forms:

```ts
passwordControl = new FormControl('', Validators.required);
```

```html
<app-input-text
  label="Contraseña"
  type="password"
  [formControl]="passwordControl"
/>
```

---

# Email

```html
<app-input-text
  label="Email"
  type="email"
  placeholder="usuario@ejemplo.com"
/>
```

Con Reactive Forms:

```ts
emailControl = new FormControl('', [
  Validators.required,
  Validators.email
]);
```

```html
<app-input-text
  label="Email"
  type="email"
  [formControl]="emailControl"
/>
```

---

# Readonly

Para impedir que el usuario modifique el valor:

```html
<app-input-text
  label="Nombre"
  [readonly]="true"
  [(value)]="nombre"
/>
```

`readonly` permite seguir seleccionando y copiando el contenido.

---

# Disabled

## Sin formulario

```html
<app-input-text
  label="Nombre"
  [disabled]="true"
/>
```

## Con Reactive Forms

El estado `disabled` debe gestionarse normalmente desde el `FormControl`:

```ts
nombreControl = new FormControl({
  value: 'Adrian',
  disabled: true
});
```

o:

```ts
nombreControl.disable();
```

El componente detectará automáticamente el estado.

---

# Texto de ayuda

Podemos mostrar información adicional debajo del campo:

```html
<app-input-text
  label="Nombre de usuario"
  helpText="Utiliza entre 3 y 50 caracteres."
/>
```

El texto de ayuda desaparece cuando se está mostrando un error.

---

# Iconos

Podemos añadir un icono:

```html
<app-input-text
  label="Buscar"
  icon="search"
  iconPosition="left"
/>
```

También podemos situarlo a la derecha:

```html
<app-input-text
  label="Buscar"
  icon="search"
  iconPosition="right"
/>
```

Actualmente `icon` representa el contenido visual del icono. La librería puede sustituir posteriormente esta implementación por un sistema de iconos propio sin modificar el funcionamiento del componente.

---

# Tamaños

Existen tres tamaños:

```text
small
medium
large
```

Por defecto:

```html
<app-input-text
  label="Nombre"
/>
```

equivale a:

```html
<app-input-text
  label="Nombre"
  size="medium"
/>
```

Tamaño pequeño:

```html
<app-input-text
  label="Nombre"
  size="small"
/>
```

Tamaño grande:

```html
<app-input-text
  label="Nombre"
  size="large"
/>
```

---

# Estado de error sin Angular Forms

Cuando utilizamos el componente fuera de un formulario también podemos controlar manualmente el estado de error:

```html
<app-input-text
  label="Nombre"
  [(value)]="nombre"
  [invalid]="nombreInvalido"
  errorMessage="El nombre no es válido"
/>
```

Por ejemplo:

```ts
nombreInvalido = true;
```

Esto permite utilizar el componente en escenarios donde no necesitamos `FormControl`.

---

# Propiedades disponibles

| Propiedad | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Texto del label |
| `placeholder` | `string` | `''` | Placeholder |
| `type` | `'text' \| 'password' \| 'email'` | `'text'` | Tipo de input |
| `autocomplete` | `string` | `'off'` | Valor de autocomplete |
| `maxlength` | `number \| null` | `null` | Longitud máxima |
| `showCharCount` | `boolean` | `false` | Muestra contador |
| `allowTypeInvalidValue` | `boolean` | `false` | Permite superar `maxlength` |
| `readonly` | `boolean` | `false` | Campo de solo lectura |
| `required` | `boolean \| null` | `null` | Estado obligatorio |
| `invalid` | `boolean` | `false` | Error para uso sin Forms |
| `errorMessage` | `string \| null` | `null` | Mensaje personalizado |
| `helpText` | `string \| null` | `null` | Texto de ayuda |
| `icon` | `string \| null` | `null` | Icono |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Posición del icono |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamaño |
| `id` | `string \| null` | `null` | ID HTML |
| `value` | `string` | `''` | Valor para uso independiente |
| `disabled` | `boolean` | `false` | Disabled para uso independiente |

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

Por tanto, **no es necesario implementar lógica adicional en el componente padre**.

Ejemplo completo:

```ts
form = new FormGroup({
  nombre: new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)
  ]),

  email: new FormControl('', [
    Validators.required,
    Validators.email
  ])
});
```

```html
<form [formGroup]="form">

  <app-input-text
    label="Nombre"
    placeholder="Introduce tu nombre"
    formControlName="nombre"
    [showCharCount]="true"
  />

  <app-input-text
    label="Email"
    type="email"
    placeholder="usuario@ejemplo.com"
    formControlName="email"
  />

</form>
```

---

# Arquitectura

El componente está separado en dos partes principales:

```text
input-text/
├── input-text.component.ts
├── input-text.component.html
├── input-text.component.css
└── validation.utils.ts
```

`input-text.component` contiene exclusivamente la lógica específica del input.

`validation.utils.ts` contiene funciones reutilizables relacionadas con validaciones y mensajes de error.

Esto permite que otros componentes de la librería puedan reutilizar la misma lógica:

```text
components/
├── input-text/
├── input-number/
├── select/
├── button/
└── ...
    
shared/
└── validation.utils.ts
```

De esta forma evitamos duplicar la lógica de validación en cada componente.

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

---

# Ejemplo completo

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
  InputTextComponent
} from './input-text/input-text.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextComponent
  ],
  templateUrl: './example.component.html'
})
export class ExampleComponent {

  form = new FormGroup({

    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ])
  });

}
```

```html
<form [formGroup]="form">

  <app-input-text
    label="Nombre"
    placeholder="Introduce tu nombre"
    formControlName="nombre"
    [showCharCount]="true"
  />

  <app-input-text
    label="Email"
    type="email"
    placeholder="usuario@ejemplo.com"
    formControlName="email"
  />

  <app-input-text
    label="Contraseña"
    type="password"
    placeholder="Introduce tu contraseña"
    formControlName="password"
  />

</form>
```

El resultado es un componente reutilizable que puede utilizarse tanto como un input independiente como un control completamente integrado con Angular Reactive Forms.