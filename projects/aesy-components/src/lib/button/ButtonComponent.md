# ButtonComponent

Botón con siete variantes semánticas, estado deshabilitado y la opción de mostrar un icono SVG en lugar de texto.

Selector: `aesy-button`.

## Características

- Siete variantes con `type`: `primary`, `secondary`, `tertiary`, `success`, `info`, `warning` y `danger`.
- Texto con `label` o icono SVG con `iconSvg`, con nombre accesible mediante `ariaLabel`.
- Estado deshabilitado: no emite `buttonClick`.
- Emite el `PointerEvent` original en cada clic.
- Todo el aspecto se personaliza con variables CSS `--aesy-button-*`.
- Standalone y `OnPush`.

---

# Importación

```ts
import { ButtonComponent, ButtonType } from 'aesy-components';

@Component({
  imports: [ButtonComponent]
})
export class ExampleComponent {}
```

---

# Uso básico

```html
<aesy-button label="Guardar" (buttonClick)="onSaveButtonClicked($event)" />
```

```ts
protected onSaveButtonClicked(event: PointerEvent): void {
  console.log(event.clientX, event.clientY);
}
```

---

# Variantes

```html
<aesy-button label="Primary" />
<aesy-button type="secondary" label="Secondary" />
<aesy-button type="tertiary" label="Tertiary" />
<aesy-button type="success" label="Success" />
<aesy-button type="info" label="Info" />
<aesy-button type="warning" label="Warning" />
<aesy-button type="danger" label="Danger" />
```

Para tiparlo en tu componente usa `ButtonType`:

```ts
protected readonly deleteButtonType: ButtonType = 'danger';
```

---

# Deshabilitado

```html
<aesy-button type="success" label="Guardar" [disabled]="isSaving()" />
```

Con `disabled` el botón usa los colores `-disabled` de su variante y no emite `buttonClick`.

---

# Solo icono

`iconSvg` recibe el atributo `d` de un `<path>` dibujado en un `viewBox` de 20×20:

```ts
// models/add-icon-path.const.ts
export const ADD_ICON_PATH: string = 'M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1z';
```

```html
<aesy-button type="secondary" ariaLabel="Añadir usuario" [iconSvg]="ADD_ICON_PATH" (buttonClick)="onAddButtonClicked()" />
```

Si se indican `label` e `iconSvg` a la vez, se muestra solo el texto.

## Accesibilidad

Los lectores de pantalla anuncian cada botón por su texto ("botón, Guardar"). Un botón solo con icono no tiene texto, así que se anunciaría como "botón" a secas. **Usa siempre `ariaLabel` en los botones de solo icono**: les da un nombre accesible sin cambiar nada visualmente. También lo usan el control por voz y los tests (`getByRole('button', { name: 'Añadir usuario' })`).

El SVG del icono está marcado con `aria-hidden`, así que no se anuncia como imagen.

---

# API

## Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `type` | `ButtonType` | `'primary'` | Variante visual. |
| `label` | `string \| null \| undefined` | `null` | Texto del botón. Tiene prioridad sobre el icono. |
| `iconSvg` | `string \| null \| undefined` | `null` | Path SVG (viewBox 20×20). Solo se muestra si no hay `label`. |
| `disabled` | `boolean \| undefined` | `false` | Deshabilita el botón. |
| `ariaLabel` | `string \| null` | `null` | Nombre accesible. Imprescindible en botones de solo icono. |

## Outputs

| Output | Tipo | Descripción |
|---|---|---|
| `buttonClick` | `PointerEvent` | Se emite en cada clic. No se emite si está deshabilitado. |

## Tipos

```ts
export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'success' | 'info' | 'warning' | 'danger';
```

---

# CSS Variables

Declaradas en `:host` con el prefijo `--aesy-button-`. `{type}` es cualquiera de las variantes.

| Grupo | Variables |
|---|---|
| Fondo | `--aesy-button-background-{type}`, `-{type}-hover`, `-{type}-disabled` |
| Texto | `--aesy-button-text-color-{type}`, `-{type}-disabled`, `--aesy-button-text-size`, `--aesy-button-text-weight` |
| Borde | `--aesy-button-border-color-{type}`, `--aesy-button-border-width`, `--aesy-button-border-radius` |
| Espaciado | `--aesy-button-padding-x`, `--aesy-button-padding-y`, `--aesy-button-gap` |
| Icono | `--aesy-button-icon-width`, `--aesy-button-icon-height` |
| Otros | `--aesy-button-display`, `--aesy-button-width`, `--aesy-button-cursor`, `--aesy-button-transition-duration` |

Ejemplo:

```css
aesy-button {
  --aesy-button-background-primary: #3b3bf0;
  --aesy-button-background-primary-hover: #2a2ad6;
  --aesy-button-text-color-primary: #ffffff;
  --aesy-button-border-radius: 999px;
}
```
