import { ComponentApi } from '../../../models/component-api.interface';

export const SIDEBAR_API: ComponentApi = {
  inputs: [
    { name: 'items', type: 'readonly SidebarEntry[]', defaultValue: '[]', description: 'Menú por datos: ítems sueltos (SidebarItem) y grupos (SidebarGroup). Se pinta antes del contenido proyectado.' },
    { name: 'variant', type: "SidebarVariant ('standard' | 'floating' | 'inset')", defaultValue: "'standard'", description: 'standard: pegado al borde con una línea; floating: panel separado con sombra; inset: sin fondo propio y el contenido como tarjeta.' },
    { name: 'collapsible', type: "SidebarCollapsible ('icon' | 'offcanvas' | 'none')", defaultValue: "'icon'", description: 'Cómo se pliega: a una columna de iconos, fuera de la pantalla o nunca.' },
    { name: 'side', type: "SidebarSide ('left' | 'right')", defaultValue: "'left'", description: 'Lado en el que se coloca, sea cual sea su posición en el HTML.' },
    { name: 'overlay', type: 'boolean', defaultValue: 'false', description: 'Al abrirse se coloca por encima del contenido en lugar de empujarlo. Así se cierra con Escape, pulsando fuera o al elegir un ítem.' },
    { name: 'backdrop', type: 'boolean', defaultValue: 'false', description: 'Oscurece el contenido mientras está abierto por encima. Necesita aesy-sidebar-layout.' },
    { name: 'openOnHover', type: 'boolean', defaultValue: 'false', description: 'Plegado, se despliega al pasar el ratón y se vuelve a plegar al salir.' },
    { name: 'hoverOpenDelay', type: 'number', defaultValue: '50', description: 'Milisegundos antes de desplegarse con openOnHover.' },
    { name: 'hoverCloseDelay', type: 'number', defaultValue: '150', description: 'Milisegundos antes de plegarse al salir con openOnHover.' },
    { name: 'rail', type: 'boolean', defaultValue: 'false', description: 'Franja fina en el borde interior que pliega y despliega al pulsarla.' },
    { name: 'mobileBreakpoint', type: 'number | null', defaultValue: 'null', description: 'Ancho de ventana (px) por debajo del cual pasa a offcanvas por encima del contenido con fondo oscuro. Al volver a escritorio recupera su estado.' },
    { name: 'width', type: 'string | null', defaultValue: "null (16rem)", description: 'Ancho abierto, cualquier longitud CSS. Equivale a --aesy-sidebar-width.' },
    { name: 'iconWidth', type: 'string | null', defaultValue: "null (3.5rem)", description: 'Ancho plegado en modo icon. Equivale a --aesy-sidebar-icon-width.' },
    { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Escape lo cierra mientras está abierto por encima.' },
    { name: 'closeOnOutsideClick', type: 'boolean', defaultValue: 'true', description: 'Pulsar fuera (incluido el fondo oscuro) lo cierra mientras está abierto por encima. Los botones con aesySidebarTrigger no cuentan.' },
    { name: 'closeOnItemClick', type: 'boolean', defaultValue: 'true', description: 'Elegir un ítem que navega o hace una acción lo cierra mientras está abierto por encima.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Menú lateral'", description: 'Nombre accesible del panel.' }
  ],
  models: [{ name: 'open', type: 'boolean', defaultValue: 'true', description: 'Abierto (expandido) o cerrado (plegado). [(open)] para controlarlo desde fuera. Con collapsible none siempre está abierto.' }],
  outputs: [{ name: 'itemClick', type: 'SidebarItem', description: 'Ítem de [items] pulsado, si navega o hace una acción (no los que abren un submenú).' }],
  types: [
    {
      name: 'Métodos públicos',
      properties: [
        { name: 'show()', type: 'void', description: 'Lo abre.' },
        { name: 'hide()', type: 'void', description: 'Lo cierra (también si estaba desplegado por el hover).' },
        { name: 'toggle()', type: 'void', description: 'Lo abre o lo cierra. Si estaba desplegado solo por el hover, lo deja abierto.' },
        { name: 'isExpanded()', type: 'boolean', description: 'Si se ve abierto (por open, por el hover o porque collapsible es none).' },
        { name: 'isIconMode()', type: 'boolean', description: 'Si está plegado a la columna de iconos.' },
        { name: 'isOverlay()', type: 'boolean', description: 'Si se abre por encima del contenido (overlay o móvil).' }
      ]
    },
    {
      name: 'SidebarItem',
      properties: [
        { name: 'label', type: 'string', description: 'Texto del ítem.' },
        { name: 'id', type: 'string', description: 'Opcional. Para identificarlo en itemClick.' },
        { name: 'iconSvg', type: 'string', description: 'Opcional. Path SVG (viewBox 20×20).' },
        { name: 'link', type: 'SidebarItemLink', description: 'Opcional. Ruta de Angular, lo mismo que routerLink (string, array de comandos o UrlTree).' },
        { name: 'linkActiveExact', type: 'boolean', description: 'Opcional. Activo solo con la ruta exacta.' },
        { name: 'href', type: 'string', description: 'Opcional. Enlace externo.' },
        { name: 'target', type: 'string', description: "Opcional. target del enlace ('_blank' añade rel=\"noopener noreferrer\")." },
        { name: 'badge', type: 'number | string', description: 'Opcional. Contador o etiqueta a la derecha; plegado se ve como un punto.' },
        { name: 'active', type: 'boolean', description: 'Opcional. Lo marca como activo a mano.' },
        { name: 'disabled', type: 'boolean', description: 'Opcional.' },
        { name: 'children', type: 'readonly SidebarItem[]', description: 'Opcional. Submenú. Un ítem con hijos solo abre y cierra su submenú.' },
        { name: 'expanded', type: 'boolean', description: 'Opcional. Submenú abierto al empezar.' }
      ]
    },
    {
      name: 'SidebarGroup',
      properties: [
        { name: 'items', type: 'readonly SidebarItem[]', description: 'Ítems del grupo.' },
        { name: 'label', type: 'string', description: 'Opcional. Título del grupo.' }
      ]
    }
  ]
};
