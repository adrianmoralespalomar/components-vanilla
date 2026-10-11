# SidebarComponent

Menú lateral de aplicación. Se pinta desde datos con `[items]` o se maqueta a mano con grupos, ítems y cualquier HTML. Junto a `aesy-sidebar-layout` y `aesy-sidebar-main` monta el esqueleto de la aplicación.

Selectores: `aesy-sidebar-layout`, `aesy-sidebar`, `aesy-sidebar-main`, `aesy-sidebar-group`, `aesy-sidebar-item` y la directiva `[aesySidebarTrigger]`.

## Características

- Menú por datos (`[items]`, con grupos, badges y submenús a cualquier profundidad) o maquetado a mano, y los dos a la vez.
- Ítems que son enlaces del router (`link`, activos solos según la ruta), enlaces externos (`href`), acciones (`itemClick`) o submenús desplegables.
- Tres variantes con `variant`: `standard`, `floating` e `inset`.
- Tres modos de plegado con `collapsible`: a una columna de iconos (`icon`), fuera de la pantalla (`offcanvas`) o nunca (`none`).
- A la izquierda o a la derecha (`side`), empujando el contenido o por encima (`overlay`), con fondo oscuro (`backdrop`), desplegado al pasar el ratón (`openOnHover`) y con franja para plegarlo (`rail`).
- Modo móvil automático con `mobileBreakpoint`.
- Cabecera y pie proyectados; los ítems admiten otro icono (logo, avatar) que se sigue viendo plegado.
- `open` es un `model` (`[(open)]`), con `show()`, `hide()` y `toggle()`; varios sidebars en el mismo layout.
- Accesible: `<aside>` con nombre, `<nav>`, listas, `aria-controls` / `aria-expanded` en el botón y los submenús, `aria-current` en el activo, Escape para cerrar.
- Todo el aspecto se personaliza con variables CSS `--aesy-sidebar-*`, que se heredan.
- Standalone y `OnPush`.

---

# Importación

```ts
import {
  SidebarComponent,
  SidebarGroupComponent,
  SidebarItemComponent,
  SidebarLayoutComponent,
  SidebarMainComponent,
  SidebarTriggerDirective
} from 'aesy-components';

@Component({
  imports: [SidebarComponent, SidebarGroupComponent, SidebarItemComponent, SidebarLayoutComponent, SidebarMainComponent, SidebarTriggerDirective]
})
export class AppShellComponent {}
```

Importa solo las piezas que uses: con `[items]` no hacen falta `SidebarGroupComponent` ni `SidebarItemComponent` (salvo para la cabecera y el pie). Tipos: `SidebarEntry`, `SidebarItem`, `SidebarGroup`, `SidebarItemLink`, `SidebarVariant`, `SidebarCollapsible` y `SidebarSide`.

---

# Uso básico (por datos)

```ts
protected readonly MENU_ENTRIES: SidebarEntry[] = [
  {
    label: 'Navegación',
    items: [
      { label: 'Inicio', iconSvg: AESY_ICON_HOME, link: '/', linkActiveExact: true },
      { label: 'Bandeja de entrada', iconSvg: AESY_ICON_INBOX, link: '/bandeja', badge: 12 }
    ]
  },
  {
    label: 'Proyectos',
    items: [
      {
        label: 'Analítica',
        iconSvg: AESY_ICON_CHART,
        children: [
          { label: 'Resumen', link: '/analitica/resumen' },
          { label: 'Informes', link: '/analitica/informes' }
        ]
      }
    ]
  }
];
```

```html
<aesy-sidebar-layout>
  <aesy-sidebar #nav [items]="MENU_ENTRIES">
    <aesy-sidebar-item aesySidebarHeader label="Acme Inc">
      <span class="logo" aesySidebarItemIcon>A</span>
    </aesy-sidebar-item>
  </aesy-sidebar>

  <aesy-sidebar-main>
    <header>
      <aesy-button ariaLabel="Mostrar u ocultar el menú" [iconSvg]="AESY_ICON_MENU" [aesySidebarTrigger]="nav" />
    </header>
    <router-outlet />
  </aesy-sidebar-main>
</aesy-sidebar-layout>
```

Cada elemento de `items` es un ítem suelto o un grupo: se distingue porque el grupo tiene `items`. Un ítem con `children` solo abre y cierra su submenú (no navega).

---

# Maquetado libre

Sin `[items]`, proyecta tú el contenido. Todo lo que no lleve `aesySidebarHeader` ni `aesySidebarFooter` va a la zona con scroll, después de `[items]` si los hay.

```html
<aesy-sidebar variant="floating">
  <aesy-sidebar-item aesySidebarHeader label="Acme Inc">
    <span class="logo" aesySidebarItemIcon>A</span>
  </aesy-sidebar-item>

  <aesy-input-text class="menu-search" placeholder="Buscar…" ariaLabel="Buscar en el menú" />

  <aesy-sidebar-group label="General">
    <aesy-sidebar-item label="Inicio" [iconSvg]="AESY_ICON_HOME" link="/" [linkActiveExact]="true" />
    <aesy-sidebar-item label="Analítica" [iconSvg]="AESY_ICON_CHART">
      <aesy-sidebar-item label="Resumen" link="/analitica/resumen" />
      <aesy-sidebar-item label="Informes" link="/analitica/informes" />
    </aesy-sidebar-item>
  </aesy-sidebar-group>

  <aesy-sidebar-item aesySidebarFooter label="Ajustes" [iconSvg]="AESY_ICON_SLIDERS" link="/ajustes" />
</aesy-sidebar>
```

- Un `aesy-sidebar-item` con ítems dentro es un submenú.
- `aesySidebarItemIcon` sustituye al icono SVG por cualquier elemento (logo, avatar). Sin icono, plegado a iconos se muestra la inicial.
- El HTML propio no se pliega solo: ocúltalo en modo iconos con `aesy-sidebar[data-state='collapsed'] .menu-search { display: none; }`.

---

# Ítems: enlace, acción o submenú

| Tiene | Se pinta como | Al pulsarlo |
|---|---|---|
| ítems hijos (`children` o proyectados) | `<button aria-expanded>` | Abre o cierra su submenú. Plegado a iconos, despliega el sidebar y lo abre. |
| `link` | `<a routerLink>` | Navega. Se marca activo solo según la ruta (`linkActiveExact` para la ruta exacta). |
| `href` | `<a href>` | Navega fuera (`target: '_blank'` añade `rel="noopener noreferrer"`). |
| nada de lo anterior | `<button>` | Emite `itemClick`. |

`link` admite lo mismo que `routerLink`: una ruta, un array de comandos o un `UrlTree` (para query params o fragmento). `active` marca el ítem como activo a mano y prevalece sobre la ruta. Un submenú que contiene el ítem activo se abre solo.

En `aesy-sidebar-item`, cada input tiene prioridad sobre el mismo campo de `item` (el objeto que le pasa `aesy-sidebar` con `[items]`).

---

# Variantes y modos

```html
<aesy-sidebar variant="inset" collapsible="icon" side="left" [overlay]="false" [openOnHover]="false" [backdrop]="false" [rail]="true" />
```

- `variant`: `standard` (pegado al borde con una línea), `floating` (panel separado con borde redondeado y sombra) o `inset` (sin fondo propio, sobre el fondo del layout, y el contenido como tarjeta).
- `collapsible`: `icon` (se queda en una columna de iconos de `iconWidth`), `offcanvas` (sale de la pantalla) o `none` (siempre abierto).
- `overlay`: al abrirse se coloca por encima del contenido en lugar de empujarlo. En `icon`, el hueco de la columna se mantiene.
- `backdrop`: oscurece el contenido mientras está por encima. Necesita `aesy-sidebar-layout`.
- `openOnHover`: plegado, se despliega al pasar el ratón (`hoverOpenDelay`) y se pliega al salir (`hoverCloseDelay`). No cambia `open`.
- `rail`: franja en el borde interior que lo pliega y despliega.
- `width` / `iconWidth`: anchos abierto y plegado. Equivalen a `--aesy-sidebar-width` y `--aesy-sidebar-icon-width`.

Abierto por encima del contenido (`overlay` o móvil) se cierra con Escape (`closeOnEscape`), al pulsar fuera (`closeOnOutsideClick`; los botones con `aesySidebarTrigger` no cuentan) y al elegir un ítem que navega o hace una acción (`closeOnItemClick`).

---

# Móvil

```html
<aesy-sidebar [mobileBreakpoint]="1024" [items]="MENU_ENTRIES" />
```

Por debajo de ese ancho de ventana pasa a `offcanvas`, por encima del contenido y con fondo oscuro, y se cierra. Al volver a escritorio recupera el `open` que tenía. Sin `mobileBreakpoint` no cambia nada: si prefieres controlarlo tú, cambia `collapsible`, `overlay` y `backdrop` con `matchMedia` o `BreakpointObserver`.

---

# Estado controlado

```html
<aesy-button label="Menú" (buttonClick)="nav.toggle()" />
<aesy-sidebar #nav [items]="MENU_ENTRIES" [(open)]="isMenuOpen" />
```

`open` es `true` por defecto. `show()`, `hide()` y `toggle()` lo cambian; si estaba desplegado solo por el hover, `toggle()` lo deja abierto.

---

# Botón de abrir y cerrar

```html
<aesy-button ariaLabel="Menú" [iconSvg]="AESY_ICON_MENU" [aesySidebarTrigger]="nav" /> <!-- el sidebar con #nav -->
<button aesySidebarTrigger>…</button> <!-- el sidebar que lo contiene o el primero del layout -->
```

Lo abre y cierra al pulsarlo y le añade `aria-controls` y `aria-expanded`. Funciona en un `<button>` nativo y en `aesy-button`: en ese caso los atributos van al `<button>` de dentro, sin tener que enlazar `ariaExpanded` ni `ariaControls`.

---

# Layout

- `aesy-sidebar-layout` coloca en fila los sidebars y `aesy-sidebar-main` (el lado lo decide `side`, no el orden en el HTML), pinta el fondo oscuro y el fondo de `inset`. Ocupa `--aesy-sidebar-layout-height` (`100dvh`) y es `aesy-sidebar-main` el que hace scroll.
- Admite varios sidebars, por ejemplo navegación a la izquierda y un panel de avisos `offcanvas` a la derecha.
- `aesy-sidebar` funciona también sin layout, dentro de tu propio contenedor flex (sin fondo oscuro). Necesita que el contenedor le dé alto.

---

# Accesibilidad

- El panel es un `<aside>` con `aria-label` (`ariaLabel`, por defecto «Menú lateral») y el menú de `[items]` va en un `<nav>`.
- Los grupos con título son `role="group"` con `aria-labelledby`; sus ítems y los de los submenús, `role="list"` / `role="listitem"`.
- El botón con `aesySidebarTrigger` y los ítems con submenú llevan `aria-controls` y `aria-expanded`; el submenú cerrado queda `inert`.
- El activo lleva `aria-current="page"` (enlaces) o `aria-current="true"` (acciones). Plegado a iconos, cada ítem muestra su nombre en un `title`.
- Abierto por encima del contenido, Escape lo cierra y devuelve el foco al botón que lo abre. Plegado `offcanvas` queda oculto y fuera del orden de tabulación.
- Sin animaciones con `prefers-reduced-motion: reduce`.

---

# API

## aesy-sidebar · Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `readonly SidebarEntry[]` | `[]` | Menú por datos. |
| `variant` | `SidebarVariant` | `'standard'` | `'standard' \| 'floating' \| 'inset'`. |
| `collapsible` | `SidebarCollapsible` | `'icon'` | `'icon' \| 'offcanvas' \| 'none'`. |
| `side` | `SidebarSide` | `'left'` | `'left' \| 'right'`. |
| `overlay` | `boolean` | `false` | Abierto, por encima del contenido. |
| `backdrop` | `boolean` | `false` | Fondo oscuro mientras está por encima. |
| `openOnHover` | `boolean` | `false` | Se despliega al pasar el ratón. |
| `hoverOpenDelay` | `number` | `50` | ms antes de desplegarse. |
| `hoverCloseDelay` | `number` | `150` | ms antes de plegarse al salir. |
| `rail` | `boolean` | `false` | Franja para plegar y desplegar. |
| `mobileBreakpoint` | `number \| null` | `null` | Ancho de ventana (px) del modo móvil. |
| `width` | `string \| null` | `null` | Ancho abierto. `null` = `--aesy-sidebar-width` (`16rem`). |
| `iconWidth` | `string \| null` | `null` | Ancho plegado a iconos. `null` = `--aesy-sidebar-icon-width` (`3.5rem`). |
| `closeOnEscape` | `boolean` | `true` | Escape lo cierra mientras está por encima. |
| `closeOnOutsideClick` | `boolean` | `true` | Pulsar fuera lo cierra mientras está por encima. |
| `closeOnItemClick` | `boolean` | `true` | Elegir un ítem lo cierra mientras está por encima. |
| `ariaLabel` | `string` | `'Menú lateral'` | Nombre accesible del panel. |

## aesy-sidebar · Model

| Model | Tipo | Default | Descripción |
|---|---|---|---|
| `open` | `boolean` | `true` | Abierto o plegado. `[(open)]` para controlarlo desde fuera. |

## aesy-sidebar · Outputs

| Output | Tipo | Descripción |
|---|---|---|
| `itemClick` | `SidebarItem` | Ítem de `[items]` pulsado que navega o hace una acción. |

## aesy-sidebar · Métodos y estado

| Miembro | Descripción |
|---|---|
| `show()`, `hide()`, `toggle()` | Cambian `open`. |
| `isExpanded()` | Si se ve abierto (por `open`, por el hover o por `collapsible: 'none'`). |
| `isIconMode()` | Si está plegado a la columna de iconos. |
| `isOverlay()` | Si se abre por encima del contenido (`overlay` o móvil). |

En el host: `data-state` (`expanded` / `collapsed`), `data-variant`, `data-collapsible`, `data-side` y `data-overlay`, para estilar tu contenido según el estado.

## aesy-sidebar · Contenido proyectado

| Selector | Dónde va |
|---|---|
| `[aesySidebarHeader]` | Arriba, fuera del scroll. |
| `[aesySidebarFooter]` | Abajo, fuera del scroll. |
| resto | Zona con scroll, después de `[items]`. |

## aesy-sidebar-item · Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Texto. |
| `iconSvg` | `string \| null` | `null` | Path SVG (viewBox 20×20). |
| `link` | `SidebarItemLink \| null` | `null` | Ruta de Angular (como `routerLink`). |
| `linkActiveExact` | `boolean \| null` | `null` | Activo solo con la ruta exacta. `null` = `false`. |
| `href` | `string \| null` | `null` | Enlace externo. |
| `target` | `string \| null` | `null` | `target` del enlace. |
| `badge` | `number \| string \| null` | `null` | Contador o etiqueta. |
| `active` | `boolean \| null` | `null` | Activo a mano. `null` = según la ruta. |
| `disabled` | `boolean \| null` | `null` | `null` = `false`. |
| `item` | `SidebarItem \| null` | `null` | El ítem como datos. Los inputs sueltos tienen prioridad. |

## aesy-sidebar-item · Model y outputs

| Nombre | Tipo | Descripción |
|---|---|---|
| `expanded` (model) | `boolean` | Submenú abierto. Se abre solo si contiene el activo. |
| `itemClick` (output) | `PointerEvent` | Pulsado, si navega o hace una acción. |

Contenido proyectado: `[aesySidebarItemIcon]` (otro icono) y `aesy-sidebar-item` (submenú).

## aesy-sidebar-group · Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Título. Plegado a iconos se oculta. |

## aesySidebarTrigger

| Input | Tipo | Descripción |
|---|---|---|
| `aesySidebarTrigger` | `SidebarComponent \| ''` | Sidebar que controla. Sin valor: el que lo contiene o el primero del layout. |

## Tipos

```ts
export type SidebarVariant = 'standard' | 'floating' | 'inset';
export type SidebarCollapsible = 'icon' | 'offcanvas' | 'none';
export type SidebarSide = 'left' | 'right';
export type SidebarItemLink = string | readonly unknown[] | UrlTree;
export type SidebarEntry = SidebarGroup | SidebarItem;

export interface SidebarGroup {
  items: readonly SidebarItem[];
  label?: string;
}

export interface SidebarItem {
  active?: boolean;
  badge?: number | string;
  children?: readonly SidebarItem[];
  disabled?: boolean;
  expanded?: boolean;
  href?: string;
  iconSvg?: string;
  id?: string;
  label: string;
  link?: SidebarItemLink;
  linkActiveExact?: boolean;
  target?: string;
}
```

---

# CSS Variables

Como en el acordeón, **no se declaran en `:host`**: se leen con su valor por defecto (`var(--aesy-sidebar-x, defecto)`). Por eso se heredan y puedes declararlas en `aesy-sidebar`, en `aesy-sidebar-layout` o en cualquier contenedor, incluido `:root`.

| Variable | Defecto |
|---|---|
| `--aesy-sidebar-width` | `16rem` |
| `--aesy-sidebar-icon-width` | `3.5rem` |
| `--aesy-sidebar-padding` | `0.5rem` |
| `--aesy-sidebar-gap` | `0.5rem` (hueco de `floating` e `inset`) |
| `--aesy-sidebar-content-gap` | `0.5rem` (entre grupos) |
| `--aesy-sidebar-background` | `#ffffff` |
| `--aesy-sidebar-text-color` | `#374151` |
| `--aesy-sidebar-border-color` | `#e5e7eb` |
| `--aesy-sidebar-overlay-shadow` | `0 10px 30px rgb(17 24 39 / 0.12)` |
| `--aesy-sidebar-floating-border-radius` | `0.75rem` |
| `--aesy-sidebar-floating-shadow` | `0 4px 16px rgb(17 24 39 / 0.08)` |
| `--aesy-sidebar-inset-background` | `#f4f4f5` |
| `--aesy-sidebar-z-index` | `20` |
| `--aesy-sidebar-item-height` | `2.25rem` |
| `--aesy-sidebar-item-border-radius` | `0.5rem` |
| `--aesy-sidebar-item-gap` | `0.625rem` |
| `--aesy-sidebar-item-spacing` | `0.125rem` |
| `--aesy-sidebar-item-font-size` | `0.875rem` |
| `--aesy-sidebar-item-font-weight` | `500` |
| `--aesy-sidebar-item-color` | `inherit` |
| `--aesy-sidebar-item-icon-size` | `1.125rem` |
| `--aesy-sidebar-item-icon-color` | `#6b7280` |
| `--aesy-sidebar-item-background-hover` | `#f3f4f6` |
| `--aesy-sidebar-item-active-background` | `#eef2ff` |
| `--aesy-sidebar-item-active-color` | `#4338ca` |
| `--aesy-sidebar-item-active-font-weight` | `600` |
| `--aesy-sidebar-subitem-height` | `2rem` |
| `--aesy-sidebar-subitem-font-weight` | `400` |
| `--aesy-sidebar-submenu-border-color` | `#e5e7eb` |
| `--aesy-sidebar-badge-background` | `#4f46e5` |
| `--aesy-sidebar-badge-color` | `#ffffff` |
| `--aesy-sidebar-badge-font-size` | `0.75rem` |
| `--aesy-sidebar-disabled-color` | `#9ca3af` |
| `--aesy-sidebar-focus-color` | `#3b82f6` |
| `--aesy-sidebar-group-label-color` | `#6b7280` |
| `--aesy-sidebar-group-label-font-size` | `0.75rem` |
| `--aesy-sidebar-group-label-font-weight` | `500` |
| `--aesy-sidebar-group-label-height` | `2rem` |
| `--aesy-sidebar-layout-height` | `100dvh` |
| `--aesy-sidebar-layout-background` | `transparent` |
| `--aesy-sidebar-backdrop-background` | `rgb(17 24 39 / 0.4)` |
| `--aesy-sidebar-main-background` | `#ffffff` |
| `--aesy-sidebar-main-inset-border-color` | `#e5e7eb` |
| `--aesy-sidebar-main-inset-border-radius` | `0.75rem` |
| `--aesy-sidebar-main-inset-shadow` | `0 1px 3px rgb(17 24 39 / 0.06)` |
| `--aesy-sidebar-rail-color` | `#d1d5db` |
| `--aesy-sidebar-scrollbar-color` | `#d1d5db` |
| `--aesy-sidebar-transition-duration` | `0.2s` |

Ejemplo:

```css
.dark-sidebar {
  --aesy-sidebar-background: #111827;
  --aesy-sidebar-border-color: #1f2937;
  --aesy-sidebar-item-active-background: #312e81;
  --aesy-sidebar-item-active-color: #e0e7ff;
  --aesy-sidebar-item-background-hover: #1f2937;
  --aesy-sidebar-item-icon-color: #9ca3af;
  --aesy-sidebar-text-color: #e5e7eb;
}
```
