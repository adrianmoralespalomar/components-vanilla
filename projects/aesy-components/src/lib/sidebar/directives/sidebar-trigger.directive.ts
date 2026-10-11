import { afterRenderEffect, computed, Directive, effect, ElementRef, inject, input } from '@angular/core';
import { SidebarLayoutComponent } from '../sidebar-layout/sidebar-layout.component';
import { SidebarComponent } from '../sidebar.component';

/**
 * Convierte un botón en el interruptor de un sidebar: lo abre y lo cierra al pulsarlo y le pone
 * `aria-controls` y `aria-expanded`. Funciona en un `<button>` nativo y en `aesy-button`
 * (los atributos van al `<button>` de dentro).
 *
 * ```html
 * <aesy-button ariaLabel="Menú" [iconSvg]="AESY_ICON_MENU" [aesySidebarTrigger]="nav" />  <!-- el sidebar con #nav -->
 * <button aesySidebarTrigger>…</button>  <!-- el sidebar que lo contiene o el único del layout -->
 * ```
 */
@Directive({
  selector: '[aesySidebarTrigger]',
  host: {
    '[attr.aria-controls]': 'isHostInteractive ? (targetSidebar()?.panelId ?? null) : null',
    '[attr.aria-expanded]': 'isHostInteractive ? (targetSidebar()?.isExpanded() ?? null) : null',
    '(click)': 'onHostClicked()'
  }
})
export class SidebarTriggerDirective {
  /** Sidebar que controla. Sin valor: el sidebar en el que está o, si no, el primero de `aesy-sidebar-layout`. */
  readonly sidebar = input<SidebarComponent | null, SidebarComponent | '' | null>(null, {
    alias: 'aesySidebarTrigger',
    transform: (sidebar: SidebarComponent | '' | null) => sidebar || null
  });

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly layout = inject(SidebarLayoutComponent, { optional: true });
  private readonly parentSidebar = inject(SidebarComponent, { optional: true });

  /** false si está en un componente que envuelve al botón (como `aesy-button`): los atributos ARIA van al botón de dentro. */
  protected readonly isHostInteractive: boolean = this.elementRef.nativeElement.matches('button, a, [role="button"]');
  protected readonly targetSidebar = computed<SidebarComponent | null>(() => this.sidebar() ?? this.parentSidebar ?? this.layout?.sidebars()[0] ?? null);

  constructor() {
    effect(onCleanup => {
      const targetSidebar = this.targetSidebar();
      if (!targetSidebar) return;
      targetSidebar.registerTrigger(this.elementRef.nativeElement);
      onCleanup(() => targetSidebar.unregisterTrigger(this.elementRef.nativeElement));
    });
    afterRenderEffect(() => {
      if (this.isHostInteractive) return;
      const innerButton = this.elementRef.nativeElement.querySelector<HTMLElement>('button, a, [role="button"]');
      const targetSidebar = this.targetSidebar();
      if (!innerButton || !targetSidebar) return;
      innerButton.setAttribute('aria-controls', targetSidebar.panelId);
      innerButton.setAttribute('aria-expanded', String(targetSidebar.isExpanded()));
    });
  }

  protected onHostClicked(): void {
    this.targetSidebar()?.toggle();
  }
}
