# IconComponent

Set de iconos propios de aesy-components: 40 iconos SVG dibujados en un `viewBox` de 20×20, con un único path relleno que toma el color del texto. Se usan de tres formas: con el componente `aesy-icon`, con su constante en cualquier `iconSvg` de la librería o copiando el SVG desde la galería del showcase.

Selector: `aesy-icon`.

## Características

- `<aesy-icon name="home" />`: por nombre, con `size` y el color del texto (`currentColor`).
- Una constante por icono (`AESY_ICON_HOME`…) con su path, para el `iconSvg` de button, sidebar, accordion, stepper… Solo entra en el bundle lo que importes.
- `AESY_ICONS` con todos por nombre, y el tipo `AesyIconName`.
- Decorativos por defecto (`aria-hidden`); con `ariaLabel` se anuncian como imagen.
- Son los que usan los propios componentes: el chevron del acordeón y del sidebar, el aspa del diálogo y de los toasts, los iconos de los toasts, la paginación de la tabla…
- Propios: sin licencias de terceros.

---

# Importación

```ts
import { IconComponent } from 'aesy-components';

@Component({
  imports: [IconComponent]
})
export class ExampleComponent {}
```

---

# Uso

```html
<aesy-icon name="home" />
<aesy-icon name="check-circle" size="2rem" class="success-icon" />
<aesy-icon name="warning" ariaLabel="Aviso" />
```

```css
.success-icon {
  color: #16a34a;
}

/* El tamaño de todos los iconos de una zona */
.toolbar {
  --aesy-icon-size: 1.5rem;
}
```

---

# En otros componentes

```ts
import { AESY_ICON_PLUS } from 'aesy-components';

protected readonly AESY_ICON_PLUS: string = AESY_ICON_PLUS;
```

```html
<aesy-button type="secondary" ariaLabel="Añadir" [iconSvg]="AESY_ICON_PLUS" />
```

Si eliges el icono en tiempo de ejecución, usa `AESY_ICONS[nombre]` (incluye el set completo en el bundle).

---

# Fuera de Angular

Cada icono es un SVG normal: copia o descarga el que quieras desde la galería del showcase (`/components/icon`), con el tamaño y el color que elijas.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="24" height="24" fill="currentColor"><path d="…"/></svg>
```

---

# API

## Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `name` | `AesyIconName` | — | Obligatorio. Nombre del icono. |
| `size` | `string \| null` | `null` | Alto y ancho (longitud CSS). `null` = `--aesy-icon-size` (`1.25rem`). |
| `ariaLabel` | `string \| null` | `null` | Nombre accesible. Sin él, el icono es decorativo. |

## Exportaciones

| Exportación | Tipo | Descripción |
|---|---|---|
| `AESY_ICON_<NOMBRE>` | `string` | Path SVG de cada icono. |
| `AESY_ICONS` | `Record<AesyIconName, string>` | Todos por nombre. |
| `AesyIconName` | `type` | Unión de los nombres. |

## CSS Variables

| Variable | Defecto |
|---|---|
| `--aesy-icon-size` | `1.25rem` (se hereda) |

---

# Iconos

| Nombre | Constante | Descripción |
|---|---|---|
| `bell` | `AESY_ICON_BELL` | Campana, avisos |
| `calendar` | `AESY_ICON_CALENDAR` | Calendario, fecha |
| `card` | `AESY_ICON_CARD` | Tarjeta, pago |
| `cart` | `AESY_ICON_CART` | Carrito, pedido |
| `chart` | `AESY_ICON_CHART` | Gráfica de barras, analítica |
| `chat` | `AESY_ICON_CHAT` | Mensaje, comentario |
| `check` | `AESY_ICON_CHECK` | Check, hecho |
| `check-circle` | `AESY_ICON_CHECK_CIRCLE` | Éxito, correcto |
| `chevron-down` | `AESY_ICON_CHEVRON_DOWN` | Abrir, desplegar |
| `chevron-left` | `AESY_ICON_CHEVRON_LEFT` | Anterior |
| `chevron-right` | `AESY_ICON_CHEVRON_RIGHT` | Siguiente |
| `chevron-up` | `AESY_ICON_CHEVRON_UP` | Cerrar, plegar |
| `chevrons-left` | `AESY_ICON_CHEVRONS_LEFT` | Primero |
| `chevrons-right` | `AESY_ICON_CHEVRONS_RIGHT` | Último |
| `close` | `AESY_ICON_CLOSE` | Cerrar, quitar |
| `copy` | `AESY_ICON_COPY` | Copiar, duplicar |
| `download` | `AESY_ICON_DOWNLOAD` | Descargar |
| `edit` | `AESY_ICON_EDIT` | Editar, lápiz |
| `exclamation` | `AESY_ICON_EXCLAMATION` | Error, atención |
| `folder` | `AESY_ICON_FOLDER` | Carpeta, archivos |
| `heart` | `AESY_ICON_HEART` | Favorito, me gusta |
| `home` | `AESY_ICON_HOME` | Inicio, casa |
| `inbox` | `AESY_ICON_INBOX` | Bandeja de entrada |
| `info-circle` | `AESY_ICON_INFO_CIRCLE` | Información |
| `lock` | `AESY_ICON_LOCK` | Candado, privado |
| `mail` | `AESY_ICON_MAIL` | Correo, sobre |
| `menu` | `AESY_ICON_MENU` | Menú, hamburguesa |
| `minus` | `AESY_ICON_MINUS` | Menos, restar |
| `more-vertical` | `AESY_ICON_MORE_VERTICAL` | Más opciones |
| `plus` | `AESY_ICON_PLUS` | Más, añadir |
| `search` | `AESY_ICON_SEARCH` | Buscar, lupa |
| `sidebar` | `AESY_ICON_SIDEBAR` | Menú lateral, panel |
| `sliders` | `AESY_ICON_SLIDERS` | Ajustes, filtros |
| `star` | `AESY_ICON_STAR` | Estrella, destacado |
| `trash` | `AESY_ICON_TRASH` | Papelera, borrar |
| `truck` | `AESY_ICON_TRUCK` | Envío, camión |
| `user` | `AESY_ICON_USER` | Usuario, perfil |
| `users` | `AESY_ICON_USERS` | Usuarios, equipo |
| `warning` | `AESY_ICON_WARNING` | Aviso, advertencia |
| `x-circle` | `AESY_ICON_X_CIRCLE` | Error, cancelar |

## Añadir un icono

1. Dibújalo en 20×20 con un único `path` relleno, sin trazos. Los huecos van con el sentido de giro contrario al contorno, para que funcionen con el `fill-rule` por defecto.
2. Crea `models/icon-paths/aesy-icon-<nombre>.const.ts` y añádelo a `AESY_ICONS` y a `public-api.ts`.
3. Añádelo a la galería del showcase (`icon-page/models/icon-gallery-items.const.ts`).
