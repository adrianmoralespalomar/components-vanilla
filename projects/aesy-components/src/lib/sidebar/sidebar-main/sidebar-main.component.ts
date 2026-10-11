import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidebarLayoutComponent } from '../sidebar-layout/sidebar-layout.component';

/** Contenido principal junto al sidebar. Ocupa el resto del ancho y hace scroll por su cuenta. */
@Component({
  selector: 'aesy-sidebar-main',
  template: '<ng-content />',
  styleUrl: './sidebar-main.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-inset]': "layout?.hasInsetSidebar() ? '' : null" }
})
export class SidebarMainComponent {
  protected readonly layout = inject(SidebarLayoutComponent, { optional: true });
}
