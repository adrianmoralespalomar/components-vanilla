import { ChangeDetectionStrategy, Component, computed, contentChildren } from '@angular/core';
import { SidebarComponent } from '../sidebar.component';

/**
 * Contenedor de la aplicación: coloca uno o varios `aesy-sidebar` junto a `aesy-sidebar-main`,
 * pinta el fondo oscuro (`backdrop`) y el fondo de la variante `inset`.
 */
@Component({
  selector: 'aesy-sidebar-layout',
  template: `
    <ng-content />
    <div class="sidebar-layout-backdrop" aria-hidden="true" [class.sidebar-layout-backdrop-visible]="isBackdropVisible()"></div>
  `,
  styleUrl: './sidebar-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-inset]': "hasInsetSidebar() ? '' : null" }
})
export class SidebarLayoutComponent {
  readonly sidebars = contentChildren(SidebarComponent, { descendants: true });

  readonly hasInsetSidebar = computed<boolean>(() => this.sidebars().some(sidebar => sidebar.variant() === 'inset'));
  protected readonly isBackdropVisible = computed<boolean>(() => this.sidebars().some(sidebar => sidebar.isBackdropVisible()));
}
