import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonComponent, DialogActionsComponent, DialogComponent, RadioButtonComponent, RadioButtonOption, ToastGlobalConfig, ToastPosition, ToastService } from 'aesy-components';
import { ComponentApi } from '../../models/component-api.interface';
import { ApiReferenceComponent } from '../../ui/api-reference/api-reference.component';
import { DocPageComponent } from '../../ui/doc-page/doc-page.component';
import { DocSectionComponent } from '../../ui/doc-section/doc-section.component';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { TOAST_API } from './models/toast-api.const';
import { TOAST_BURST_COUNT } from './models/toast-burst-count.const';
import { TOAST_EVENTS_LOG_MAX_LENGTH } from './models/toast-events-log-max-length.const';
import { TOAST_MAX_VISIBLE_OPTIONS } from './models/toast-max-visible-options.const';
import { TOAST_POSITION_OPTIONS } from './models/toast-position-options.const';
import { TOAST_SNIPPETS } from './models/toast-snippets.const';
import { TOAST_THEME_OPTIONS } from './models/toast-theme-options.const';
import { ToastTypeDemo } from './models/toast-type-demo.interface';
import { TOAST_TYPE_DEMOS } from './models/toast-type-demos.const';
import { TOAST_UPLOAD_DURATION_MS } from './models/toast-upload-duration-ms.const';

@Component({
  selector: 'app-toast-page',
  imports: [ApiReferenceComponent, ButtonComponent, DialogActionsComponent, DialogComponent, DocPageComponent, DocSectionComponent, RadioButtonComponent, ValuePreviewComponent],
  templateUrl: './toast-page.component.html',
  styleUrl: './toast-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  protected readonly API: ComponentApi = TOAST_API;
  protected readonly BURST_COUNT: number = TOAST_BURST_COUNT;
  protected readonly MAX_VISIBLE_OPTIONS: RadioButtonOption[] = TOAST_MAX_VISIBLE_OPTIONS;
  protected readonly POSITION_OPTIONS: RadioButtonOption[] = TOAST_POSITION_OPTIONS;
  protected readonly SNIPPETS = TOAST_SNIPPETS;
  protected readonly THEME_OPTIONS: RadioButtonOption[] = TOAST_THEME_OPTIONS;
  protected readonly TYPE_DEMOS: ToastTypeDemo[] = TOAST_TYPE_DEMOS;

  /** La configuración es global: se guarda la de entrada para restaurarla al salir de la página. */
  private readonly initialToastConfig: ToastGlobalConfig = this.toastService.config();

  protected readonly isDialogOpen = signal<boolean>(false);
  protected readonly isUploading = signal<boolean>(false);
  protected readonly selectedThemeCssClass = signal<string>('toast-theme-filled');
  protected readonly toastConfig = this.toastService.config;
  protected readonly toastEventsLog = signal<string[]>([]);

  constructor() {
    this.destroyRef.onDestroy(() => this.toastService.configure(this.initialToastConfig));
  }

  protected onTypeButtonClicked(typeDemo: ToastTypeDemo): void {
    this.toastService.show({ message: typeDemo.message, type: typeDemo.type });
  }

  protected onArchiveConversationButtonClicked(): void {
    const toastRef = this.toastService.show({ action: { label: 'Deshacer' }, message: 'La conversación con Lucía se ha movido al archivo.', title: 'Conversación archivada' });
    toastRef
      .onAction()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.addToastEventToLog('onAction → conversación restaurada'));
    toastRef
      .afterDismissed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(reason => this.addToastEventToLog(`afterDismissed → '${reason}'`));
  }

  private addToastEventToLog(toastEvent: string): void {
    this.toastEventsLog.update(toastEventsLog => [toastEvent, ...toastEventsLog].slice(0, TOAST_EVENTS_LOG_MAX_LENGTH));
  }

  protected onShortToastButtonClicked(): void {
    this.toastService.info('Me voy en 2 segundos.', { duration: 2000 });
  }

  protected onLongToastButtonClicked(): void {
    this.toastService.info('Tienes 10 segundos para leerme (o pon el ratón encima).', { duration: 10000 });
  }

  protected onStickyToastButtonClicked(): void {
    this.toastService.warning('No me cierro solo: usa el aspa.', { duration: 0, title: 'Revisa tu método de pago' });
  }

  protected onNoProgressToastButtonClicked(): void {
    this.toastService.success('Sin barra de progreso.', { showProgress: false });
  }

  protected onDismissAllButtonClicked(): void {
    this.toastService.dismissAll();
  }

  protected onUploadFileButtonClicked(): void {
    this.isUploading.set(true);
    const uploadingToastRef = this.toastService.show({ dismissible: false, duration: 0, message: 'Subiendo informe-anual.pdf…' });
    const uploadTimeoutId = setTimeout(() => {
      uploadingToastRef.dismiss();
      this.isUploading.set(false);
      this.toastService.success('informe-anual.pdf se ha subido.');
    }, TOAST_UPLOAD_DURATION_MS);
    this.destroyRef.onDestroy(() => clearTimeout(uploadTimeoutId));
  }

  protected onPositionChanged(position: ToastPosition): void {
    this.toastService.configure({ position });
    this.toastService.info(`Ahora salgo en ${position}.`);
  }

  protected onMaxVisibleChanged(maxVisible: number): void {
    this.toastService.configure({ maxVisible });
  }

  protected onBurstButtonClicked(): void {
    for (let toastNumber = 1; toastNumber <= TOAST_BURST_COUNT; toastNumber++) this.toastService.show({ message: `Notificación ${toastNumber} de ${TOAST_BURST_COUNT}` });
  }

  protected onOpenDialogButtonClicked(): void {
    this.isDialogOpen.set(true);
  }

  protected onSaveDraftButtonClicked(): void {
    this.toastService.success('Borrador guardado.', { title: 'Listo' });
  }

  protected onThemedToastButtonClicked(typeDemo: ToastTypeDemo): void {
    this.toastService.show({ cssClass: this.selectedThemeCssClass(), message: typeDemo.message, type: typeDemo.type });
  }

  protected onThemedToastWithActionButtonClicked(): void {
    this.toastService.success('El pedido #10482 ya está en camino.', { action: { label: 'Ver pedido' }, cssClass: this.selectedThemeCssClass(), title: 'Pedido enviado' });
  }
}
