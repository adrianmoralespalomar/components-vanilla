import { SidebarItemLink } from './sidebar-item-link.type';

/** Ítem del menú para `[items]` de `aesy-sidebar`. Sin `link`, `href` ni `children` es una acción: avisa con `itemClick`. */
export interface SidebarItem {
  /** Lo marca como activo a mano. Sin él, los ítems con `link` se activan solos según la ruta actual. */
  active?: boolean;
  badge?: number | string;
  /** Submenú desplegable. Un ítem con hijos solo abre y cierra su submenú: no navega. */
  children?: readonly SidebarItem[];
  disabled?: boolean;
  /** Submenú abierto al empezar. Se abre solo si contiene el ítem activo. */
  expanded?: boolean;
  /** URL externa (o cualquier enlace fuera del router de Angular). */
  href?: string;
  /** Path SVG (viewBox 20×20). */
  iconSvg?: string;
  /** Para identificarlo en `itemClick`. */
  id?: string;
  label: string;
  /** Ruta de Angular: lo mismo que pasarías a `routerLink`. */
  link?: SidebarItemLink;
  /** Activo solo si la ruta coincide exactamente (útil para `'/'`). Por defecto también con sus rutas hijas. */
  linkActiveExact?: boolean;
  /** `target` del enlace (`'_blank'` añade `rel="noopener noreferrer"`). */
  target?: string;
}
