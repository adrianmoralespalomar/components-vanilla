import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable, Injector, reflectComponentType, Type } from '@angular/core';
import { DialogRef } from './dialog-ref';
import { DialogComponent } from './dialog.component';
import { AESY_DIALOG_DATA } from './models/aesy-dialog-data.token';
import { DialogConfig } from './models/dialog-config.interface';

/**
 * Abre diálogos desde código: crea un `aesy-dialog` en el `body` con tu componente dentro y lo destruye al cerrarse.
 *
 * ```ts
 * this.dialogService.open(ConfirmDeleteDialogComponent, { title: 'Eliminar', data: { userName } })
 *   .afterClosed()
 *   .subscribe(isConfirmed => …);
 * ```
 */
@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly applicationRef = inject(ApplicationRef);
  private readonly document = inject(DOCUMENT);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);

  open<TComponent, TData = unknown, TResult = unknown>(component: Type<TComponent>, config: DialogConfig<TData> = {}): DialogRef<TResult> {
    const dialogRef = new DialogRef<TResult>();
    const contentInjector = Injector.create({
      parent: config.injector ?? this.injector,
      providers: [
        { provide: DialogRef, useValue: dialogRef },
        { provide: AESY_DIALOG_DATA, useValue: config.data }
      ]
    });
    const contentComponentRef = createComponent(component, { environmentInjector: this.environmentInjector, elementInjector: contentInjector });
    const dialogComponentRef = createComponent(DialogComponent, {
      environmentInjector: this.environmentInjector,
      projectableNodes: this.getProjectableNodes(contentComponentRef.location.nativeElement)
    });

    this.applyConfig(dialogComponentRef, config);
    dialogRef.attachCloseHandler(result => dialogComponentRef.instance.close(result));
    const closedSubscription = dialogComponentRef.instance.closed.subscribe(result => {
      closedSubscription.unsubscribe();
      dialogRef.notifyClosed(result as TResult | undefined);
      void this.destroyAfterCloseAnimation(dialogComponentRef, contentComponentRef);
    });

    this.applicationRef.attachView(contentComponentRef.hostView);
    this.applicationRef.attachView(dialogComponentRef.hostView);
    this.document.body.appendChild(dialogComponentRef.location.nativeElement);
    dialogComponentRef.setInput('open', true);
    return dialogRef;
  }

  /** El componente va al hueco por defecto (`<ng-content />`) de aesy-dialog. */
  private getProjectableNodes(contentElement: Node): Node[][] {
    const contentSelectors = reflectComponentType(DialogComponent)?.ngContentSelectors ?? ['*'];
    return contentSelectors.map(contentSelector => (contentSelector === '*' ? [contentElement] : []));
  }

  private applyConfig(dialogComponentRef: ComponentRef<DialogComponent>, config: DialogConfig<unknown>): void {
    if (config.ariaLabel !== undefined) dialogComponentRef.setInput('ariaLabel', config.ariaLabel);
    if (config.closeButtonAriaLabel !== undefined) dialogComponentRef.setInput('closeButtonAriaLabel', config.closeButtonAriaLabel);
    if (config.closeOnBackdropClick !== undefined) dialogComponentRef.setInput('closeOnBackdropClick', config.closeOnBackdropClick);
    if (config.closeOnEscape !== undefined) dialogComponentRef.setInput('closeOnEscape', config.closeOnEscape);
    if (config.role !== undefined) dialogComponentRef.setInput('role', config.role);
    if (config.showCloseButton !== undefined) dialogComponentRef.setInput('showCloseButton', config.showCloseButton);
    if (config.size !== undefined) dialogComponentRef.setInput('size', config.size);
    if (config.title !== undefined) dialogComponentRef.setInput('title', config.title);
  }

  private async destroyAfterCloseAnimation(dialogComponentRef: ComponentRef<DialogComponent>, contentComponentRef: ComponentRef<unknown>): Promise<void> {
    await dialogComponentRef.instance.waitForCloseAnimation();
    this.applicationRef.detachView(dialogComponentRef.hostView);
    this.applicationRef.detachView(contentComponentRef.hostView);
    contentComponentRef.destroy();
    dialogComponentRef.destroy();
  }
}
