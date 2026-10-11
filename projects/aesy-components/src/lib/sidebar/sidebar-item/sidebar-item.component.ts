import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChildren, effect, inject, input, model, output, Signal, signal, untracked, viewChildren } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AESY_ICON_CHEVRON_DOWN } from '../../icon/models/icon-paths/aesy-icon-chevron-down.const';
import { AESY_SIDEBAR } from '../models/aesy-sidebar.token';
import { SidebarItemLink } from '../models/sidebar-item-link.type';
import { SidebarItem } from '../models/sidebar-item.interface';
import { SidebarGroupComponent } from '../sidebar-group/sidebar-group.component';

let nextSidebarItemId = 0;

/**
 * Entrada del menú. Según lo que reciba es un enlace del router (`link`), un enlace externo (`href`),
 * una acción (`itemClick`) o, si tiene ítems hijos (proyectados o en `item.children`), el botón de un submenú.
 *
 * Cada input tiene prioridad sobre el mismo campo de `item`, que es como lo usa `aesy-sidebar` con `[items]`.
 */
@Component({
  selector: 'aesy-sidebar-item',
  imports: [NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': "parentItem || parentGroup ? 'listitem' : null",
    '[class.aesy-sidebar-item-collapsed]': 'isIconMode()',
    '[class.aesy-sidebar-item-nested]': '!!parentItem'
  }
})
export class SidebarItemComponent {
  // #region INPUTS
  /** Lo marca como activo a mano. null = según la ruta si tiene `link`. */
  readonly active = input<boolean | null>(null);
  readonly badge = input<number | string | null>(null);
  readonly disabled = input<boolean | null>(null);
  /** Submenú abierto o cerrado. Permite: [(expanded)]="estaAbierto". Se abre solo si contiene el ítem activo. */
  readonly expanded = model<boolean>(false);
  /** URL externa (o cualquier enlace fuera del router de Angular). */
  readonly href = input<string | null>(null);
  /** Path SVG (viewBox 20×20). Para otro icono (avatar, logo…) proyecta un elemento con `aesySidebarItemIcon`. */
  readonly iconSvg = input<string | null>(null);
  /** Ítem en forma de datos. Lo usa `aesy-sidebar` con `[items]`; los inputs sueltos tienen prioridad sobre él. */
  readonly item = input<SidebarItem | null>(null);
  readonly label = input<string>('');
  /** Ruta de Angular: lo mismo que pasarías a `routerLink`. */
  readonly link = input<SidebarItemLink | null>(null);
  /** Activo solo si la ruta coincide exactamente (útil para `'/'`). */
  readonly linkActiveExact = input<boolean | null>(null);
  readonly target = input<string | null>(null);
  // #endregion INPUTS

  // #region OUTPUTS
  /** Se emite al pulsar el ítem si navega o hace una acción (no si abre un submenú). */
  readonly itemClick = output<PointerEvent>();
  // #endregion OUTPUTS

  // #region INTERNAL STATE
  protected readonly parentGroup = inject(SidebarGroupComponent, { optional: true });
  /** Ítem del que cuelga como submenú, si lo hay. */
  readonly parentItem = inject(SidebarItemComponent, { optional: true, skipSelf: true });
  private readonly sidebar = inject(AESY_SIDEBAR, { optional: true });

  private readonly descendantProjectedItems = contentChildren(SidebarItemComponent, { descendants: true });
  private readonly isRouterLinkActive = signal<boolean>(false);
  private readonly renderedChildItems = viewChildren(SidebarItemComponent);
  /** Solo sus hijos directos, no los de submenús más profundos. */
  private readonly projectedChildItems = computed<readonly SidebarItemComponent[]>(() => this.descendantProjectedItems().filter(childItem => childItem.parentItem === this));

  protected readonly SUBMENU_ICON_PATH: string = AESY_ICON_CHEVRON_DOWN;
  protected readonly submenuId = `aesy-sidebar-item-${++nextSidebarItemId}-submenu`;

  protected readonly childItemsData = computed<readonly SidebarItem[]>(() => this.item()?.children ?? []);
  protected readonly currentBadge = computed<number | string | null>(() => this.badge() ?? this.item()?.badge ?? null);
  protected readonly currentHref = computed<string | null>(() => this.href() ?? this.item()?.href ?? null);
  protected readonly currentIconSvg = computed<string | null>(() => this.iconSvg() ?? this.item()?.iconSvg ?? null);
  protected readonly currentLabel = computed<string>(() => this.label() || this.item()?.label || '');
  protected readonly currentLink = computed<SidebarItemLink | null>(() => this.link() ?? this.item()?.link ?? null);
  protected readonly currentTarget = computed<string | null>(() => this.target() ?? this.item()?.target ?? null);
  protected readonly hasSubmenu = computed<boolean>(() => this.childItemsData().length > 0 || this.projectedChildItems().length > 0);
  protected readonly isDisabled = computed<boolean>(() => this.disabled() ?? this.item()?.disabled ?? false);
  protected readonly isIconMode = computed<boolean>(() => this.sidebar?.isIconMode() ?? false);
  protected readonly isLinkActiveExact = computed<boolean>(() => this.linkActiveExact() ?? this.item()?.linkActiveExact ?? false);
  protected readonly isSubmenuVisible = computed<boolean>(() => this.expanded() && !this.isIconMode());

  readonly isActive = computed<boolean>(() => this.active() ?? this.item()?.active ?? this.isRouterLinkActive());
  /** Algún ítem de su submenú (a cualquier profundidad) está activo. */
  readonly hasActiveDescendant: Signal<boolean> = computed<boolean>(() =>
    [...this.projectedChildItems(), ...this.renderedChildItems()].some((childItem: SidebarItemComponent): boolean => childItem.isActive() || childItem.hasActiveDescendant())
  );
  // #endregion INTERNAL STATE

  constructor() {
    effect(() => {
      const isItemExpanded = this.item()?.expanded;
      if (isItemExpanded !== undefined) untracked(() => this.expanded.set(isItemExpanded));
    });
    effect(() => {
      if (this.hasActiveDescendant()) untracked(() => this.expanded.set(true));
    });
  }

  protected onRouterLinkActiveChanged(isActive: boolean): void {
    this.isRouterLinkActive.set(isActive);
  }

  protected onItemElementClicked(event: PointerEvent): void {
    if (this.isDisabled()) return event.preventDefault();
    if (!this.hasSubmenu()) return this.notifyItemClicked(event);
    if (!this.isIconMode()) return this.expanded.update(isExpanded => !isExpanded);
    // Plegado a iconos el submenú no se ve: se expande el sidebar y se abre
    this.sidebar?.show();
    this.expanded.set(true);
  }

  private notifyItemClicked(event: PointerEvent): void {
    this.itemClick.emit(event);
    this.sidebar?.onItemClicked(this.item());
  }
}
