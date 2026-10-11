import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, ElementRef, forwardRef, inject, input, model, output, signal, untracked } from '@angular/core';
import { AESY_SIDEBAR } from './models/aesy-sidebar.token';
import { SidebarCollapsible } from './models/sidebar-collapsible.type';
import { SidebarEntry } from './models/sidebar-entry.type';
import { SidebarGroup } from './models/sidebar-group.interface';
import { SidebarItem } from './models/sidebar-item.interface';
import { SidebarSide } from './models/sidebar-side.type';
import { SidebarVariant } from './models/sidebar-variant.type';
import { SidebarGroupComponent } from './sidebar-group/sidebar-group.component';
import { SidebarItemComponent } from './sidebar-item/sidebar-item.component';

let nextSidebarId = 0;

/**
 * Menú lateral. Se puede pintar desde datos con `[items]` o maquetar a mano proyectando grupos, ítems
 * o cualquier HTML. Dentro de `aesy-sidebar-layout` empuja (o tapa, con `overlay`) a `aesy-sidebar-main`.
 */
@Component({
  selector: 'aesy-sidebar',
  imports: [SidebarGroupComponent, SidebarItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: AESY_SIDEBAR, useExisting: forwardRef(() => SidebarComponent) }],
  host: {
    '[attr.data-collapsible]': 'currentCollapsible()',
    '[attr.data-overlay]': "isOverlay() ? '' : null",
    '[attr.data-side]': 'side()',
    '[attr.data-state]': "isExpanded() ? 'expanded' : 'collapsed'",
    '[attr.data-variant]': 'variant()',
    '[style.--aesy-sidebar-icon-width]': 'iconWidth()',
    '[style.--aesy-sidebar-width]': 'width()',
    '(document:keydown.escape)': 'onDocumentEscapeKeydown($event)',
    '(document:pointerdown)': 'onDocumentPointerdown($event)',
    '(pointerenter)': 'onHostPointerenter($event)',
    '(pointerleave)': 'onHostPointerleave()'
  }
})
export class SidebarComponent {
  // #region INPUTS
  /** Nombre accesible del panel (`<aside>`). */
  readonly ariaLabel = input<string>('Menú lateral');
  /** Oscurece el contenido mientras el sidebar está abierto por encima (`overlay`). Necesita `aesy-sidebar-layout`. */
  readonly backdrop = input<boolean>(false);
  /** Escape cierra el sidebar mientras está abierto por encima (`overlay`). */
  readonly closeOnEscape = input<boolean>(true);
  /** Pulsar un ítem que navega o hace una acción cierra el sidebar mientras está abierto por encima (`overlay`). */
  readonly closeOnItemClick = input<boolean>(true);
  /** Pulsar fuera (incluido el fondo de `backdrop`) cierra el sidebar mientras está abierto por encima (`overlay`). */
  readonly closeOnOutsideClick = input<boolean>(true);
  /** Cómo se pliega: a una columna de iconos, fuera de la pantalla o nunca. */
  readonly collapsible = input<SidebarCollapsible>('icon');
  readonly hoverCloseDelay = input<number>(150);
  readonly hoverOpenDelay = input<number>(50);
  /** Ancho plegado en modo `icon` (cualquier longitud CSS). null = `--aesy-sidebar-icon-width` (3.5rem). */
  readonly iconWidth = input<string | null>(null);
  /** Menú por datos: ítems sueltos y grupos. Se pinta antes del contenido proyectado. */
  readonly items = input<readonly SidebarEntry[]>([]);
  /** Ancho de ventana (px) por debajo del cual pasa a panel oculto, por encima del contenido y con fondo oscuro. null = nunca. */
  readonly mobileBreakpoint = input<number | null>(null);
  /** Abierto (expandido) o cerrado (plegado). Permite: [(open)]="estaAbierto" */
  readonly open = model<boolean>(true);
  /** Plegado, se expande al pasar el ratón y se vuelve a plegar al salir. */
  readonly openOnHover = input<boolean>(false);
  /** Al abrirse se coloca por encima del contenido en lugar de empujarlo. */
  readonly overlay = input<boolean>(false);
  /** Franja fina en el borde interior que pliega y despliega al pulsarla. */
  readonly rail = input<boolean>(false);
  readonly side = input<SidebarSide>('left');
  readonly variant = input<SidebarVariant>('standard');
  /** Ancho abierto (cualquier longitud CSS). null = `--aesy-sidebar-width` (16rem). */
  readonly width = input<string | null>(null);
  // #endregion INPUTS

  // #region OUTPUTS
  /** Se emite al pulsar un ítem de `[items]` que navega o hace una acción (no los que abren un submenú). */
  readonly itemClick = output<SidebarItem>();
  // #endregion OUTPUTS

  // #region INTERNAL STATE
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  private hoverTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private readonly isHoverExpanded = signal<boolean>(false);
  private readonly isMobile = signal<boolean>(false);
  /** Estado de `open` al pasar a móvil, para recuperarlo al volver a escritorio. */
  private openBeforeMobile = true;
  /** Botones con `aesySidebarTrigger` que lo controlan: pulsarlos no cuenta como pulsar fuera. */
  private readonly triggerElements = new Set<HTMLElement>();

  readonly panelId = `aesy-sidebar-${++nextSidebarId}`;
  /** En móvil siempre es `offcanvas`. */
  readonly currentCollapsible = computed<SidebarCollapsible>(() => (this.isMobile() ? 'offcanvas' : this.collapsible()));
  readonly isExpanded = computed<boolean>(() => this.currentCollapsible() === 'none' || this.open() || this.isHoverExpanded());
  /** Plegado a la columna de iconos: los ítems solo muestran el icono. */
  readonly isIconMode = computed<boolean>(() => this.currentCollapsible() === 'icon' && !this.isExpanded());
  readonly isOverlay = computed<boolean>(() => this.currentCollapsible() !== 'none' && (this.isMobile() || this.overlay()));
  /** Abierto por encima del contenido: es cuando se cierra con Escape, al pulsar fuera o al elegir un ítem. */
  readonly isOverlaying = computed<boolean>(() => this.isOverlay() && this.isExpanded());
  readonly isBackdropVisible = computed<boolean>(() => this.isOverlaying() && (this.backdrop() || this.isMobile()));
  // #endregion INTERNAL STATE

  constructor() {
    effect(onCleanup => {
      const mobileBreakpoint = this.mobileBreakpoint();
      const windowRef = this.document.defaultView;
      if (mobileBreakpoint === null || !windowRef?.matchMedia) return untracked(() => this.setMobile(false));
      const mobileMediaQuery = windowRef.matchMedia(`(max-width: ${mobileBreakpoint - 0.02}px)`);
      const onMobileMediaQueryChanged = (): void => this.setMobile(mobileMediaQuery.matches);
      untracked(onMobileMediaQueryChanged);
      mobileMediaQuery.addEventListener('change', onMobileMediaQueryChanged);
      onCleanup(() => mobileMediaQuery.removeEventListener('change', onMobileMediaQueryChanged));
    });
    this.destroyRef.onDestroy(() => this.clearHoverTimeout());
  }

  private setMobile(isMobile: boolean): void {
    if (isMobile === this.isMobile()) return;
    this.isMobile.set(isMobile);
    if (!isMobile) return this.open.set(this.openBeforeMobile);
    this.openBeforeMobile = this.open();
    this.hide();
  }

  // #region PUBLIC METHODS
  show(): void {
    this.open.set(true);
  }

  hide(): void {
    this.clearHoverTimeout();
    this.isHoverExpanded.set(false);
    this.open.set(false);
  }

  /** Si estaba expandido solo por el hover, lo deja abierto. */
  toggle(): void {
    if (this.open()) return this.hide();
    this.show();
  }

  /** Lo llaman los ítems al pulsarse (los que navegan o hacen una acción). */
  onItemClicked(sidebarItem: SidebarItem | null): void {
    if (sidebarItem) this.itemClick.emit(sidebarItem);
    if (this.isOverlaying() && this.closeOnItemClick()) this.hide();
  }

  registerTrigger(triggerElement: HTMLElement): void {
    this.triggerElements.add(triggerElement);
  }

  unregisterTrigger(triggerElement: HTMLElement): void {
    this.triggerElements.delete(triggerElement);
  }
  // #endregion PUBLIC METHODS

  protected isSidebarGroup(entry: SidebarEntry): entry is SidebarGroup {
    return 'items' in entry;
  }

  protected onRailClicked(): void {
    this.toggle();
  }

  // #region HOST LISTENERS
  protected onDocumentEscapeKeydown(event: Event): void {
    if (event.defaultPrevented || !this.isOverlaying() || !this.closeOnEscape()) return;
    const hasFocusInside = this.elementRef.nativeElement.contains(this.document.activeElement);
    this.hide();
    // El panel se oculta: el foco vuelve al botón que lo abre para no perderse
    if (hasFocusInside) this.triggerElements.values().next().value?.focus();
  }

  protected onDocumentPointerdown(event: PointerEvent): void {
    if (!this.isOverlaying() || !this.closeOnOutsideClick()) return;
    const target = event.target as Node | null;
    if (!target || this.elementRef.nativeElement.contains(target)) return;
    for (const triggerElement of this.triggerElements) if (triggerElement.contains(target)) return;
    this.hide();
  }

  protected onHostPointerenter(event: PointerEvent): void {
    if (!this.openOnHover() || this.isMobile() || this.open() || event.pointerType !== 'mouse') return;
    this.scheduleHoverExpanded(true, this.hoverOpenDelay());
  }

  private scheduleHoverExpanded(isHoverExpanded: boolean, delayMs: number): void {
    this.clearHoverTimeout();
    this.hoverTimeoutId = setTimeout(() => {
      this.hoverTimeoutId = null;
      this.isHoverExpanded.set(isHoverExpanded);
    }, delayMs);
  }

  private clearHoverTimeout(): void {
    if (this.hoverTimeoutId === null) return;
    clearTimeout(this.hoverTimeoutId);
    this.hoverTimeoutId = null;
  }

  protected onHostPointerleave(): void {
    if (!this.isHoverExpanded()) return this.clearHoverTimeout();
    this.scheduleHoverExpanded(false, this.hoverCloseDelay());
  }
  // #endregion HOST LISTENERS
}
