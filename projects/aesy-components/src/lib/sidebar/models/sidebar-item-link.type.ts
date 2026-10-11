import { UrlTree } from '@angular/router';

/** Lo mismo que admite `routerLink`: una ruta, un array de comandos o un `UrlTree` (para query params o fragmento). */
export type SidebarItemLink = string | readonly unknown[] | UrlTree;
