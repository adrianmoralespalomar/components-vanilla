import { DOCUMENT } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { ActiveToast } from '../models/active-toast.interface';
import { AESY_TOAST_SERVICE } from '../models/aesy-toast-service.token';
import { TOAST_ICON_PATHS } from '../models/toast-icon-paths.const';
import { ToastType } from '../models/toast-type.type';

/**
 * Contenedor de los toasts. Lo crea ToastService en el `body`; no se usa directamente.
 * Es un popover manual para estar en la capa superior del navegador, por encima de los diálogos modales.
 */
@Component({
  selector: 'aesy-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainerComponent {
  private readonly document = inject(DOCUMENT);
  private readonly toastService = inject(AESY_TOAST_SERVICE);

  private readonly containerElement = viewChild<ElementRef<HTMLElement>>('containerElement');

  protected readonly ICON_PATHS: Record<ToastType | 'close', string> = TOAST_ICON_PATHS;
  protected readonly config = this.toastService.config;
  /** Arriba, el más reciente va primero (junto al borde); abajo, el último. */
  protected readonly displayedToasts = computed<ActiveToast[]>(() => {
    const toasts = this.toastService.toasts();
    return this.config().position.startsWith('top') ? [...toasts].reverse() : toasts;
  });

  constructor() {
    afterNextRender(() => this.containerElement()?.nativeElement.showPopover());
  }

  /**
   * Un diálogo modal abierto después del contenedor queda por encima de él en la capa superior.
   * Si hay uno abierto, se vuelve a mostrar el popover para pasar delante.
   */
  bringToFront(): void {
    const containerElement = this.containerElement()?.nativeElement;
    if (!containerElement?.matches(':popover-open') || !this.document.querySelector('dialog:modal')) return;
    containerElement.hidePopover();
    containerElement.showPopover();
  }

  protected onToastPointerEntered(toastId: number): void {
    this.toastService.pauseTimer(toastId);
  }

  protected onToastPointerLeft(event: MouseEvent, toastId: number): void {
    if ((event.currentTarget as HTMLElement).matches(':focus-within')) return;
    this.toastService.resumeTimer(toastId);
  }

  protected onToastFocusEntered(toastId: number): void {
    this.toastService.pauseTimer(toastId);
  }

  protected onToastFocusLeft(event: FocusEvent, toastId: number): void {
    const toastElement = event.currentTarget as HTMLElement;
    if (toastElement.contains(event.relatedTarget as Node | null) || toastElement.matches(':hover')) return;
    this.toastService.resumeTimer(toastId);
  }

  protected onToastActionButtonClicked(toastId: number): void {
    this.toastService.triggerAction(toastId);
  }

  protected onToastCloseButtonClicked(toastId: number): void {
    this.toastService.dismiss(toastId, 'close');
  }
}
