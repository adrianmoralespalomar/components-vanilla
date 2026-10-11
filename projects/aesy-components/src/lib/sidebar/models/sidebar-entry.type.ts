import { SidebarGroup } from './sidebar-group.interface';
import { SidebarItem } from './sidebar-item.interface';

/** Cada elemento de `[items]`: un ítem suelto o un grupo (se distingue porque el grupo tiene `items`). */
export type SidebarEntry = SidebarGroup | SidebarItem;
