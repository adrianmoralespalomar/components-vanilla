# CheckboxComponent

Casilla de verificación con estado indeterminado, tamaños y uso con o sin Angular Forms.

Selector: `aesy-checkbox`.

## Características

- Implementa `ControlValueAccessor` e integra `NgControl`: funciona con `[formControl]`, `formControlName` y `[(value)]`.
- Detecta `Validators.required` y `Validators.requiredTrue` (asterisco incluido) y muestra el error al tocarlo.
- Estado indeterminado (`indeterminate`), también expuesto al input nativo para lectores de pantalla.
- Etiqueta a la izquierda o a la derecha (`labelPosition`).
- Tamaños `small`, `medium` y `large`.
- Estados `disabled` y `readonly`.
- Texto de ayuda y mensaje de error.
- Variables CSS `--aesy-checkbox-*`.

---

# Importación

```ts
import { CheckboxComponent } from 'aesy-components';

@Component({
  imports: [CheckboxComponent]
})
export class ExampleComponent {}
```

---

# Uso sin Angular Forms

```ts
protected readonly acceptedTerms = signal<boolean>(false);
```

```html
<aesy-checkbox label="Acepto las condiciones" [(value)]="acceptedTerms" />
```

---

# Estado indeterminado

Útil para una casilla "seleccionar todo" cuando solo hay algunas hijas marcadas:

```ts
protected readonly selectedNotifications = signal<boolean[]>([true, false, false]);
protected readonly areAllSelected = computed<boolean>(() => this.selectedNotifications().every(Boolean));
protected readonly areSomeSelected = computed<boolean>(() => this.selectedNotifications().some(Boolean) && !this.areAllSelected());

protected onAllNotificationsChanged(isChecked: boolean): void {
  this.selectedNotifications.update(selected => selected.map(() => isChecked));
}
```

```html
<aesy-checkbox
  label="Todas las notificaciones"
  [value]="areAllSelected()"
  [indeterminate]="areSomeSelected()"
  (valueChange)="onAllNotificationsChanged($event)" />
```

---

# Posición de la etiqueta y tamaños

```html
<aesy-checkbox label="Etiqueta a la izquierda" labelPosition="left" />

<aesy-checkbox label="Small" size="small" />
<aesy-checkbox label="Medium" size="medium" />
<aesy-checkbox label="Large" size="large" />
```

---

# Disabled y readonly

```html
<aesy-checkbox label="Deshabilitado" [disabled]="true" [value]="true" />
<aesy-checkbox label="Solo lectura" [readonly]="true" [value]="true" />
```

`readonly` mantiene el aspecto normal pero ignora los clics.

---

# Ayuda y errores

```html
<aesy-checkbox label="Quiero recibir el boletín" helpText="Un correo al mes, sin spam." />

<aesy-checkbox
  label="Acepto la política de privacidad"
  [invalid]="true"
  errorMessage="Debes aceptar la política para continuar." />
```

Sin Angular Forms, el error solo se muestra si `invalid` es `true` **y** hay `errorMessage`.

---

# Reactive Forms

```ts
protected readonly termsControl = new FormControl<boolean>(false, {
  nonNullable: true,
  validators: [Validators.requiredTrue]
});
```

```html
<aesy-checkbox
  label="Acepto las condiciones"
  errorMessage="Debes aceptar las condiciones."
  [formControl]="termsControl" />
```

El asterisco aparece solo y el error se muestra cuando el control está `touched` o `dirty`. Sin `errorMessage` se usa el mensaje automático (`Campo obligatorio`), o el `message` de un validador propio.

---

# API

## Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Texto de la casilla. |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Lado de la etiqueta. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamaño. |
| `indeterminate` | `boolean` | `false` | Estado mixto. |
| `readonly` | `boolean` | `false` | Impide cambiar el valor sin deshabilitar. |
| `disabled` | `boolean` | `false` | Deshabilita la casilla sin Angular Forms. |
| `required` | `boolean \| null` | `null` | Obligatorio. Con `null` se detecta desde `Validators.required` o `Validators.requiredTrue`. |
| `invalid` | `boolean` | `false` | Estado inválido sin Angular Forms. |
| `errorMessage` | `string \| null` | `null` | Mensaje de error explícito. Sobrescribe el automático. |
| `helpText` | `string \| null` | `null` | Texto de ayuda. |
| `id` | `string \| null` | `null` | Id base; el input interno usa `${id}-checkbox`. |
| `name` | `string \| null` | `null` | Nombre del control. |

## Model

| Model | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `boolean` | `false` | Estado marcado sin Angular Forms. |

---

# CSS Variables

Declaradas en `:host` con el prefijo `--aesy-checkbox-`:

```css
:host {
  --aesy-checkbox-border-color: #d1d5db;
  --aesy-checkbox-border-hover-color: #9ca3af;
  --aesy-checkbox-border-focus-color: #3b82f6;
  --aesy-checkbox-border-checked-color: #3b82f6;

  --aesy-checkbox-background: #ffffff;
  --aesy-checkbox-disabled-background: #f3f4f6;
  --aesy-checkbox-readonly-background: #f9fafb;

  --aesy-checkbox-text-color: #374151;
  --aesy-checkbox-disabled-text-color: #9ca3af;
  --aesy-checkbox-error-color: #dc2626;
  --aesy-checkbox-label-color: #374151;
  --aesy-checkbox-help-color: #6b7280;

  --aesy-checkbox-checked-background: #3b82f6;
  --aesy-checkbox-checked-border-color: #3b82f6;
  --aesy-checkbox-check-color: #ffffff;
  --aesy-checkbox-indeterminate-color: #ffffff;

  --aesy-checkbox-size: 18px;
  --aesy-checkbox-radius: 4px;
  --aesy-checkbox-gap: 0.5rem;
}
```
