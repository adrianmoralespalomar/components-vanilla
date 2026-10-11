import { ComponentApi } from '../../../models/component-api.interface';

export const SIDEBAR_ITEM_API: ComponentApi = {
  inputs: [
    { name: 'label', type: 'string', defaultValue: "''", description: 'Texto del ítem. Plegado a iconos se muestra en un title.' },
    { name: 'iconSvg', type: 'string | null', defaultValue: 'null', description: 'Path SVG (viewBox 20×20). Para otro icono proyecta un elemento con aesySidebarItemIcon. Sin icono, plegado muestra la inicial.' },
    { name: 'link', type: 'SidebarItemLink | null', defaultValue: 'null', description: 'Ruta de Angular (lo que pasarías a routerLink). Se marca activo solo según la ruta.' },
    { name: 'linkActiveExact', type: 'boolean | null', defaultValue: 'null (false)', description: 'Activo solo con la ruta exacta (útil para "/").' },
    { name: 'href', type: 'string | null', defaultValue: 'null', description: 'Enlace externo.' },
    { name: 'target', type: 'string | null', defaultValue: 'null', description: "target del enlace. '_blank' añade rel=\"noopener noreferrer\"." },
    { name: 'badge', type: 'number | string | null', defaultValue: 'null', description: 'Contador o etiqueta. Plegado se ve como un punto sobre el icono.' },
    { name: 'active', type: 'boolean | null', defaultValue: 'null', description: 'Lo marca como activo a mano. null = según la ruta si tiene link.' },
    { name: 'disabled', type: 'boolean | null', defaultValue: 'null (false)', description: 'No se puede pulsar ni navegar.' },
    { name: 'item', type: 'SidebarItem | null', defaultValue: 'null', description: 'El ítem en forma de datos (lo usa aesy-sidebar con [items]). Los inputs sueltos tienen prioridad.' }
  ],
  models: [{ name: 'expanded', type: 'boolean', defaultValue: 'false', description: 'Submenú abierto o cerrado. Se abre solo si contiene el ítem activo.' }],
  outputs: [{ name: 'itemClick', type: 'PointerEvent', description: 'Se ha pulsado y navega o hace una acción (no se emite al abrir o cerrar su submenú).' }],
  types: [
    {
      name: 'Contenido proyectado',
      properties: [
        { name: '[aesySidebarItemIcon]', type: 'elemento', description: 'Sustituye al icono: un logo, un avatar… Se sigue viendo plegado a iconos.' },
        { name: 'aesy-sidebar-item', type: 'componente', description: 'Ítems dentro de otro ítem: forman su submenú (a cualquier profundidad).' }
      ]
    }
  ]
};
