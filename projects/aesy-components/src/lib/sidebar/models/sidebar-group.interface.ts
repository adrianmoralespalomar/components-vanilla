import { SidebarItem } from './sidebar-item.interface';

/** Grupo de ítems con título opcional para `[items]` de `aesy-sidebar`. */
export interface SidebarGroup {
  items: readonly SidebarItem[];
  label?: string;
}
