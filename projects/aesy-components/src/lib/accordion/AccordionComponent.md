# AccordionComponent

Paneles desplegables agrupados: `aesy-accordion` coordina varios `aesy-accordion-item`, cada uno con una cabecera que abre y cierra su contenido.

Selectores: `aesy-accordion` y `aesy-accordion-item`.

## Características

- Un solo ítem abierto a la vez o varios con `multi`, y `openAll()` / `closeAll()`.
- Tres apariencias con `appearance`: `joined`, `separated` y `flat`.
- `expanded` es un `model`: se controla desde fuera con `[(expanded)]`; `opened` y `closed` avisan de cada cambio.
- Título y descripción por input (`label`, `description`) o proyectados con HTML propio, más una fila de acciones al pie.
- Contenido diferido con `ng-template[aesyAccordionContent]`: no se crea hasta la primera apertura.
- Icono configurable: posición, oculto, otro SVG y cuánto gira al abrir.
- Accesible: cabeceras `button` con `aria-expanded` dentro de un `role="heading"`, paneles `role="region"` e `inert` al cerrarse, navegación con flechas, Inicio y Fin.
- Animación de altura solo con CSS, desactivada con `prefers-reduced-motion`.
- Todo el aspecto se personaliza con variables CSS `--aesy-accordion-*`, que se heredan.
- Standalone y `OnPush`. Los ítems funcionan también sin acordeón.

---

# Importación

```ts
import { AccordionComponent, AccordionItemComponent } from 'aesy-components';

@Component({
  imports: [AccordionComponent, AccordionItemComponent]
})
export class ExampleComponent {}
```

Para el contenido diferido importa también `AccordionItemContentDirective`. Tipos: `AccordionAppearance`, `AccordionTogglePosition` y `AccordionHeadingLevel`.

---

# Uso básico

```html
<aesy-accordion>
  <aesy-accordion-item label="¿Cuánto tarda el envío?" [expanded]="true">
    Entre 2 y 3 días laborables.
  </aesy-accordion-item>
  <aesy-accordion-item label="¿Puedo devolver un producto?">
    Sí, tienes 30 días desde la entrega.
  </aesy-accordion-item>
</aesy-accordion>
```

Por defecto solo puede haber un ítem abierto: al abrir otro, el anterior se cierra (y emite `closed`).

---

# Varios abiertos

```html
<aesy-button label="Abrir todos" (buttonClick)="faqAccordion.openAll()" />
<aesy-button label="Cerrar todos" (buttonClick)="faqAccordion.closeAll()" />

<aesy-accordion #faqAccordion [multi]="true">…</aesy-accordion>
```

`openAll()` solo funciona con `multi` y se salta los ítems deshabilitados. `closeAll()` funciona siempre.

---

# Apariencia

```html
<aesy-accordion appearance="separated">…</aesy-accordion>
```

| Valor | Aspecto |
|---|---|
| `joined` (defecto) | Un bloque con borde y separadores entre ítems. |
| `separated` | Cada ítem es una tarjeta, separadas por `--aesy-accordion-gap`. |
| `flat` | Sin fondo ni borde exterior, solo separadores. Útil para listas tipo FAQ o acordeones anidados. |

Un `aesy-accordion-item` suelto (sin acordeón) usa el aspecto `separated`.

---

# Contenido personalizado

```html
<aesy-accordion-item description="Calle Mayor 12, Madrid">
  <span aesyAccordionTitle>
    Dirección de envío
    <span class="badge">Principal</span>
  </span>

  <p>Calle Mayor 12, 3.º B · 28013 Madrid</p>

  <aesy-button type="tertiary" label="Eliminar" aesyAccordionActions />
  <aesy-button type="secondary" label="Editar" aesyAccordionActions />
</aesy-accordion-item>
```

| Atributo | Dónde va |
|---|---|
| `aesyAccordionTitle` | En el título, detrás de `label`. |
| `aesyAccordionDescription` | En la descripción, detrás de `description`. |
| `aesyAccordionActions` | En una fila al pie del panel, alineada a la derecha. Sin acciones, la fila no se pinta. |
| (sin atributo) | Cuerpo del panel. |

> No pongas elementos interactivos (botones, enlaces) en el título o la descripción: van dentro del `button` de la cabecera.

---

# Estado controlado y eventos

```ts
protected readonly isOrderDetailsExpanded = signal<boolean>(true);
```

```html
<aesy-accordion-item
  label="Detalles del pedido"
  [(expanded)]="isOrderDetailsExpanded"
  (opened)="onOrderDetailsOpened()"
  (closed)="onOrderDetailsClosed()">
  …
</aesy-accordion-item>
```

`opened` y `closed` se emiten en cada cambio (clic, teclado, código, binding o porque el acordeón lo cierra al abrir otro), pero no en la carga inicial.

Por código, con una referencia al ítem: `open()`, `close()`, `toggle()` y `focusHeader()`.

---

# Deshabilitado

```html
<aesy-accordion-item label="Plan Equipo" [disabled]="!isAdmin()">…</aesy-accordion-item>
```

No se puede abrir ni cerrar desde la cabecera y la navegación con teclado lo salta. Sí cambia por código o con `[(expanded)]`.

---

# Icono

```html
<aesy-accordion togglePosition="before">…</aesy-accordion>
<aesy-accordion [hideToggle]="true">…</aesy-accordion>
<aesy-accordion class="plus-accordion" [toggleIconSvg]="PLUS_ICON_PATH">…</aesy-accordion>
```

```css
.plus-accordion {
  /* Un + que gira 45° se convierte en × */
  --aesy-accordion-toggle-icon-rotation-expanded: 45deg;
}
```

`toggleIconSvg` recibe el atributo `d` de un `<path>` en un `viewBox` de 20×20, como el `iconSvg` del botón.

`togglePosition`, `hideToggle`, `toggleIconSvg` y `headingLevel` se ponen en el acordeón y cada ítem puede sobrescribirlos (en el ítem valen `null` por defecto, que significa "lo que diga el acordeón").

---

# Carga diferida

```html
<aesy-accordion-item label="Equipo">
  <ng-template aesyAccordionContent>
    <aesy-table [data]="people()" [config]="TABLE_CONFIG" [paginationMetaConfig]="TABLE_PAGINATION" />
  </ng-template>
</aesy-accordion-item>
```

El contenido del `ng-template` no se crea hasta que el ítem se abre por primera vez y después se conserva al cerrar. Úsalo para contenido pesado o que pide datos al iniciarse. Se puede combinar con contenido normal en el mismo ítem.

---

# Anidados

```html
<aesy-accordion>
  <aesy-accordion-item label="Frontend">
    <aesy-accordion appearance="flat" [headingLevel]="4">
      <aesy-accordion-item label="Angular">…</aesy-accordion-item>
    </aesy-accordion>
  </aesy-accordion-item>
</aesy-accordion>
```

Cada acordeón gestiona solo sus propios ítems (apertura, `openAll`, teclado). Baja el `headingLevel` del interior para mantener la jerarquía.

---

# Accesibilidad

- La cabecera es un `<button>` con `aria-expanded` y `aria-controls`, dentro de un elemento con `role="heading"` y `aria-level` (`headingLevel`, por defecto 3).
- El panel es un `role="region"` con `aria-labelledby` apuntando a su cabecera. Cerrado lleva `inert`: su contenido no recibe el foco ni lo leen los lectores de pantalla.
- Teclado: <kbd>Enter</kbd>/<kbd>Espacio</kbd> abren y cierran; <kbd>↓</kbd>/<kbd>↑</kbd> van a la cabecera siguiente/anterior (en bucle); <kbd>Inicio</kbd>/<kbd>Fin</kbd> a la primera/última. Los deshabilitados se saltan.
- Sin animación con `prefers-reduced-motion: reduce`.

---

# API

## aesy-accordion · Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `multi` | `boolean` | `false` | Permite varios ítems abiertos a la vez. |
| `appearance` | `AccordionAppearance` | `'joined'` | `'joined' \| 'separated' \| 'flat'`. |
| `togglePosition` | `AccordionTogglePosition` | `'after'` | `'before' \| 'after'`. |
| `hideToggle` | `boolean` | `false` | Oculta el icono. |
| `toggleIconSvg` | `string \| null` | `null` | Path SVG (viewBox 20×20). `null` = chevron. |
| `headingLevel` | `AccordionHeadingLevel` | `3` | `aria-level` de las cabeceras (1-6). |

## aesy-accordion · Métodos

| Método | Descripción |
|---|---|
| `openAll()` | Abre los ítems habilitados. Solo con `multi`. |
| `closeAll()` | Cierra todos los ítems. |

## aesy-accordion-item · Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Título de la cabecera. |
| `description` | `string` | `''` | Texto secundario junto al título. |
| `disabled` | `boolean` | `false` | Impide abrir y cerrar desde la cabecera. |
| `togglePosition` | `AccordionTogglePosition \| null` | `null` | `null` = el del acordeón, o `'after'`. |
| `hideToggle` | `boolean \| null` | `null` | `null` = el del acordeón, o `false`. |
| `toggleIconSvg` | `string \| null` | `null` | `null` = el del acordeón, o el chevron. |
| `headingLevel` | `AccordionHeadingLevel \| null` | `null` | `null` = el del acordeón, o `3`. |

## aesy-accordion-item · Model

| Model | Tipo | Default | Descripción |
|---|---|---|---|
| `expanded` | `boolean` | `false` | Abierto o cerrado. `[(expanded)]` para controlarlo desde fuera. |

## aesy-accordion-item · Outputs

| Output | Tipo | Descripción |
|---|---|---|
| `opened` | `void` | Se ha abierto. No se emite en la carga inicial. |
| `closed` | `void` | Se ha cerrado. No se emite en la carga inicial. |

## aesy-accordion-item · Métodos

| Método | Descripción |
|---|---|
| `open()`, `close()`, `toggle()` | Cambian `expanded`. |
| `focusHeader()` | Pone el foco en la cabecera. |

## Tipos

```ts
export type AccordionAppearance = 'joined' | 'separated' | 'flat';
export type AccordionTogglePosition = 'before' | 'after';
export type AccordionHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
```

---

# CSS Variables

A diferencia del resto de componentes, **no se declaran en `:host`**: se leen con su valor por defecto (`var(--aesy-accordion-x, defecto)`). Por eso se heredan y puedes declararlas en `aesy-accordion`, en un `aesy-accordion-item` concreto o en cualquier contenedor, incluido `:root`.

| Variable | Defecto |
|---|---|
| `--aesy-accordion-background` | `#ffffff` |
| `--aesy-accordion-border-color` | `#e5e7eb` |
| `--aesy-accordion-border-radius` | `0.5rem` |
| `--aesy-accordion-border-width` | `1px` |
| `--aesy-accordion-gap` | `0.75rem` (solo `separated`) |
| `--aesy-accordion-text-color` | `#374151` |
| `--aesy-accordion-padding-x` | `1rem` |
| `--aesy-accordion-header-padding-y` | `0.75rem` |
| `--aesy-accordion-header-min-height` | `3.25rem` |
| `--aesy-accordion-header-gap` | `0.75rem` |
| `--aesy-accordion-header-background` | `transparent` |
| `--aesy-accordion-header-background-hover` | `#f9fafb` |
| `--aesy-accordion-header-background-expanded` | `transparent` |
| `--aesy-accordion-title-font-size` | `0.9375rem` |
| `--aesy-accordion-title-font-weight` | `600` |
| `--aesy-accordion-description-color` | `#6b7280` |
| `--aesy-accordion-description-font-size` | `0.875rem` |
| `--aesy-accordion-toggle-icon-color` | `#6b7280` |
| `--aesy-accordion-toggle-icon-size` | `1.25rem` |
| `--aesy-accordion-toggle-icon-rotation-expanded` | `180deg` |
| `--aesy-accordion-body-text-color` | `inherit` |
| `--aesy-accordion-body-font-size` | `0.875rem` |
| `--aesy-accordion-body-padding-bottom` | `1rem` |
| `--aesy-accordion-actions-gap` | `0.5rem` |
| `--aesy-accordion-actions-justify-content` | `flex-end` |
| `--aesy-accordion-focus-color` | `#3b82f6` |
| `--aesy-accordion-disabled-text-color` | `#9ca3af` |
| `--aesy-accordion-transition-duration` | `0.2s` |

Ejemplo:

```css
aesy-accordion.brand-accordion {
  --aesy-accordion-border-radius: 14px;
  --aesy-accordion-focus-color: #7c3aed;
  --aesy-accordion-header-background-expanded: #f1e9ff;
  --aesy-accordion-toggle-icon-color: #7c3aed;
}
```
