import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AESY_SIDEBAR } from '../models/aesy-sidebar.token';

let nextSidebarGroupId = 0;

/** Bloque de ítems con título. Plegado a iconos, el título se oculta y deja el hueco como separación. */
@Component({
  selector: 'aesy-sidebar-group',
  templateUrl: './sidebar-group.component.html',
  styleUrl: './sidebar-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-labelledby]': 'label() ? labelId : null',
    '[attr.role]': "label() ? 'group' : null",
    '[class.aesy-sidebar-group-collapsed]': 'isIconMode()'
  }
})
export class SidebarGroupComponent {
  readonly label = input<string>('');

  private readonly sidebar = inject(AESY_SIDEBAR, { optional: true });

  protected readonly isIconMode = computed<boolean>(() => this.sidebar?.isIconMode() ?? false);
  protected readonly labelId = `aesy-sidebar-group-${++nextSidebarGroupId}-label`;
}
