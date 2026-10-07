# TextareaComponent

Campo de texto multilínea con filas, redimensionado, contador de caracteres y validación integrada con Angular Forms.

Selector: `aesy-textarea`.

## Características

- Implementa `ControlValueAccessor` e integra `NgControl`: detecta `Validators.required` y traduce los errores estándar (`required`, `minlength`, `maxlength`…) y los `message` de validadores propios.
- Uso independiente con `[(value)]`.
- Crece con el contenido (`field-sizing: content`); `rows` marca la altura mínima.
- Redimensionado configurable (`resize`).
- Contador de caracteres y `maxlength`.
- Estados `disabled` y `readonly`, texto de ayuda y mensaje de error.
- Usa las variables comunes `--aesy-form-controls-*`.

---

# Importación

```ts
import { TextareaComponent } from 'aesy-components';

@Component({
  imports: [TextareaComponent]
})
export class ExampleComponent {}
```

---

# Uso sin Angular Forms

```ts
protected readonly comments = signal<string>('');
```

```html
<aesy-textarea label="Comentarios" placeholder="Cuéntanos algo…" [(value)]="comments" />
```

---

# Filas y redimensionado

```html
<aesy-textarea label="Corto" [rows]="2" resize="none" />
<aesy-textarea label="Largo" [rows]="6" resize="both" />
```

`resize` admite `none`, `vertical` (por defecto), `horizontal` y `both`.

---

# Contador de caracteres

```html
<aesy-textarea label="Biografía" [maxlength]="160" [showCharCount]="true" [(value)]="bio" />
```

Con `allowTypeInvalidValue` se puede escribir por encima de `maxlength` para que se vea el error en lugar de cortar el texto.

---

# Reactive Forms

```ts
protected readonly feedbackForm = new FormGroup({
  message: new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(20), Validators.maxLength(200)]
  })
});
```

```html
<form [formGroup]="feedbackForm">
  <aesy-textarea
    label="Mensaje"
    formControlName="message"
    [maxlength]="200"
    [showCharCount]="true"
    [allowTypeInvalidValue]="true" />
</form>
```

---

# Errores sin Angular Forms

```html
<aesy-textarea label="Descripción" [invalid]="true" errorMessage="La descripción no puede estar vacía." />
```

---

# API

## Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Texto de la etiqueta. |
| `placeholder` | `string` | `''` | Texto con el campo vacío. |
| `rows` | `number` | `4` | Altura mínima en líneas. |
| `cols` | `number \| null` | `null` | Anchura en caracteres del textarea nativo. |
| `resize` | `TextareaResize` | `'vertical'` | Dirección de redimensionado. |
| `maxlength` | `number \| null` | `null` | Longitud máxima. |
| `showCharCount` | `boolean` | `false` | Muestra el contador. |
| `allowTypeInvalidValue` | `boolean` | `false` | Permite superar `maxlength`. |
| `textAlign` | `'left' \| 'center' \| 'right'` | `'left'` | Alineación del texto. |
| `readonly` | `boolean` | `false` | Solo lectura. |
| `disabled` | `boolean` | `false` | Deshabilitado sin Angular Forms. |
| `required` | `boolean \| null` | `null` | Obligatorio. Con `null` se detecta desde el `FormControl`. |
| `invalid` | `boolean` | `false` | Estado inválido sin Angular Forms. |
| `errorMessage` | `string \| null` | `null` | Mensaje de error explícito. |
| `helpText` | `string \| null` | `null` | Texto de ayuda. |
| `id` | `string \| null` | `null` | Id base del control. |
| `name` | `string \| null` | `null` | Nombre del control. |

## Model

| Model | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `string` | `''` | Texto sin Angular Forms. |

## Tipos

```ts
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';
```

---

# CSS Variables

No tiene variables propias: usa las comunes de los form controls (`--aesy-form-controls-*`), definidas en `:root` por el tema. Se pueden acotar a un solo campo:

```css
aesy-textarea {
  --aesy-form-controls-background: #fafaff;
  --aesy-form-controls-border-color-focus: #3b3bf0;
  --aesy-form-controls-radius: 0.75rem;
}
```
