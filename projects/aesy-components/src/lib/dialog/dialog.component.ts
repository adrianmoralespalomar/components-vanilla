import { DOCUMENT } from '@angular/common';
import { afterRenderEffect, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input, model, output, untracked, viewChild } from '@angular/core';
import { DIALOG_CLOSE_ICON_PATH } from './models/dialog-close-icon-path.const';
import { DialogRole } from './models/dialog-role.type';
import { DialogSize } from './models/dialog-size.type';

let nextDialogId = 0;
/** Diálogos abiertos en la página: el scroll del documento se bloquea con el primero y se libera con el último. */
let openDialogsCount = 0;

/**
 * Diálogo modal basado en el elemento `<dialog>` nativo: el navegador se encarga de la capa superior,
 * de atrapar el foco, de dejar inerte el resto de la página y de cerrar con Escape.
 */
@Component({
  selector: 'aesy-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent {
  // #region INPUTS
  /** Nombre accesible cuando no hay `title`. */
  readonly ariaLabel = input<string>('');
  readonly closeButtonAriaLabel = input<string>('Cerrar');
  readonly closeOnBackdropClick = input<boolean>(true);
  /** Ojo: el navegador puede ignorarlo si se pulsa Escape dos veces seguidas. */
  readonly closeOnEscape = input<boolean>(true);
  /** Abierto o cerrado. Permite: [(open)]="estaAbierto" */
  readonly open = model<boolean>(false);
  readonly role = input<DialogRole>('dialog');
  readonly showCloseButton = input<boolean>(true);
  readonly size = input<DialogSize>('medium');
  readonly title = input<string>('');
  // #endregion INPUTS

  // #region OUTPUTS
  readonly opened = output<void>();
  /** Se emite al cerrarse con el valor pasado a `close(result)` (undefined si se cierra con Escape, el fondo o el aspa). */
  readonly closed = output<unknown>();
  // #endregion OUTPUTS

  // #region INTERNAL STATE
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  private readonly dialogElement = viewChild.required<ElementRef<HTMLDialogElement>>('dialogElement');
  private readonly panelElement = viewChild.required<ElementRef<HTMLElement>>('panelElement');
  private isScrollLocked = false;
  private pendingResult: unknown = undefined;
  private previouslyFocusedElement: HTMLElement | null = null;

  protected readonly CLOSE_ICON_PATH: string = DIALOG_CLOSE_ICON_PATH;
  protected readonly titleId = `aesy-dialog-${++nextDialogId}-title`;
  // #endregion INTERNAL STATE

  constructor() {
    afterRenderEffect(() => {
      const isOpen = this.open();
      untracked(() => this.syncNativeDialog(isOpen));
    });
    this.destroyRef.onDestroy(() => this.unlockScroll());
  }

  private syncNativeDialog(isOpen: boolean): void {
    const dialogElement = this.dialogElement().nativeElement;
    if (isOpen && !dialogElement.open) return this.showNativeDialog(dialogElement);
    if (!isOpen && dialogElement.open) dialogElement.close();
  }

  private showNativeDialog(dialogElement: HTMLDialogElement): void {
    this.previouslyFocusedElement = this.document.activeElement as HTMLElement | null;
    dialogElement.showModal();
    this.lockScroll();
    // Sin un [autofocus] dentro, el foco va al panel y no al primer botón (que sería el aspa de cerrar)
    if (!dialogElement.querySelector('[autofocus]')) this.panelElement().nativeElement.focus();
    this.opened.emit();
  }

  private lockScroll(): void {
    if (this.isScrollLocked) return;
    this.isScrollLocked = true;
    if (openDialogsCount++ === 0) this.document.documentElement.style.overflow = 'hidden';
  }

  private unlockScroll(): void {
    if (!this.isScrollLocked) return;
    this.isScrollLocked = false;
    if (--openDialogsCount === 0) this.document.documentElement.style.overflow = '';
  }

  // #region PUBLIC METHODS
  /** Cierra el diálogo. `result` llega en `closed` (y en `afterClosed()` si se abrió con `DialogService`). */
  close(result?: unknown): void {
    this.pendingResult = result;
    const dialogElement = this.dialogElement().nativeElement;
    if (dialogElement.open) return dialogElement.close();
    this.open.set(false);
  }

  /** Resuelve cuando termina la animación de cierre (al momento si no hay animación). */
  async waitForCloseAnimation(): Promise<void> {
    const dialogElement = this.dialogElement().nativeElement;
    await Promise.allSettled(dialogElement.getAnimations({ subtree: true }).map(animation => animation.finished));
  }
  // #endregion PUBLIC METHODS

  protected onDialogCancelled(event: Event): void {
    if (!this.closeOnEscape()) event.preventDefault();
  }

  /** Evento `close` nativo: llega tanto si se cierra con `close()` como con Escape. */
  protected onDialogClosed(): void {
    const result = this.pendingResult;
    this.pendingResult = undefined;
    this.unlockScroll();
    this.open.set(false);
    if (this.previouslyFocusedElement?.isConnected) this.previouslyFocusedElement.focus();
    this.closed.emit(result);
  }

  /** Un clic cuyo destino es el propio `<dialog>` solo puede venir del fondo: el panel ocupa todo su interior. */
  protected onDialogClicked(event: MouseEvent): void {
    if (event.target === this.dialogElement().nativeElement && this.closeOnBackdropClick()) this.close();
  }

  protected onCloseButtonClicked(): void {
    this.close();
  }
}
