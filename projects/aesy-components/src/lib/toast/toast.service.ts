import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { afterNextRender, ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable, Injector, PLATFORM_ID, signal } from '@angular/core';
import { ActiveToast } from './models/active-toast.interface';
import { AESY_TOAST_CONFIG } from './models/aesy-toast-config.token';
import { AESY_TOAST_SERVICE } from './models/aesy-toast-service.token';
import { TOAST_GLOBAL_CONFIG_DEFAULT } from './models/toast-global-config-default.const';
import { ToastGlobalConfig } from './models/toast-global-config.interface';
import { ToastDismissReason } from './models/toast-dismiss-reason.type';
import { TOAST_LEAVE_ANIMATION_MS } from './models/toast-leave-animation-ms.const';
import { ToastOptions } from './models/toast-options.interface';
import { ToastShortcutOptions } from './models/toast-shortcut-options.type';
import { ToastTimer } from './models/toast-timer.interface';
import { ToastContainerComponent } from './toast-container/toast-container.component';
import { ToastRef } from './toast-ref';

/**
 * Muestra notificaciones temporales. No hace falta poner nada en la plantilla: el servicio crea su contenedor en el `body`.
 *
 * ```ts
 * this.toastService.success('Cambios guardados');
 * this.toastService.error('No se pudo guardar', { title: 'Error', duration: 0 });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly applicationRef = inject(ApplicationRef);
  private readonly document = inject(DOCUMENT);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly injectedConfig = inject(AESY_TOAST_CONFIG, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);

  private readonly configState = signal<ToastGlobalConfig>({ ...TOAST_GLOBAL_CONFIG_DEFAULT, ...this.injectedConfig });
  private readonly toastsState = signal<ActiveToast[]>([]);
  private readonly timers = new Map<number, ToastTimer>();
  private containerComponentRef: ComponentRef<ToastContainerComponent> | null = null;
  private nextToastId = 0;

  readonly config = this.configState.asReadonly();
  /** @internal Toasts en pantalla, para el contenedor. */
  readonly toasts = this.toastsState.asReadonly();

  constructor() {
    // El contenedor (una región aria-live) debe existir antes del primer toast para que los lectores de pantalla lo anuncien
    afterNextRender(() => this.ensureContainer());
  }

  private ensureContainer(): void {
    if (this.containerComponentRef || !isPlatformBrowser(this.platformId)) return;
    const containerInjector = Injector.create({ providers: [{ provide: AESY_TOAST_SERVICE, useValue: this }] });
    this.containerComponentRef = createComponent(ToastContainerComponent, { environmentInjector: this.environmentInjector, elementInjector: containerInjector });
    this.applicationRef.attachView(this.containerComponentRef.hostView);
    this.document.body.appendChild(this.containerComponentRef.location.nativeElement);
  }

  // #region PUBLIC METHODS
  show(options: ToastOptions): ToastRef {
    this.ensureContainer();
    const config = this.configState();
    const toastId = ++this.nextToastId;
    const toast: ActiveToast = {
      action: options.action ?? null,
      cssClass: options.cssClass ?? '',
      duration: options.duration ?? config.duration,
      id: toastId,
      isDismissible: options.dismissible ?? true,
      isLeaving: false,
      message: options.message,
      ref: new ToastRef(toastId, () => this.dismiss(toastId)),
      showProgress: options.showProgress ?? config.showProgress,
      title: options.title ?? '',
      type: options.type ?? 'neutral'
    };
    this.toastsState.update(toasts => [...toasts, toast]);
    this.startTimer(toast);
    this.dismissOverflowingToasts();
    this.containerComponentRef?.instance.bringToFront();
    return toast.ref;
  }

  private startTimer(toast: ActiveToast): void {
    if (toast.duration <= 0) return;
    this.timers.set(toast.id, { remainingMs: toast.duration, startedAt: Date.now(), timeoutId: setTimeout(() => this.dismiss(toast.id, 'timeout'), toast.duration) });
  }

  private dismissOverflowingToasts(): void {
    const visibleToasts = this.toastsState().filter(toast => !toast.isLeaving);
    const overflowingToastsCount = visibleToasts.length - this.configState().maxVisible;
    for (const toast of visibleToasts.slice(0, Math.max(0, overflowingToastsCount))) this.dismiss(toast.id, 'limit');
  }

  success(message: string, options: ToastShortcutOptions = {}): ToastRef {
    return this.show({ ...options, message, type: 'success' });
  }

  info(message: string, options: ToastShortcutOptions = {}): ToastRef {
    return this.show({ ...options, message, type: 'info' });
  }

  warning(message: string, options: ToastShortcutOptions = {}): ToastRef {
    return this.show({ ...options, message, type: 'warning' });
  }

  error(message: string, options: ToastShortcutOptions = {}): ToastRef {
    return this.show({ ...options, message, type: 'error' });
  }

  dismiss(toastId: number, reason: ToastDismissReason = 'manual'): void {
    const toast = this.toastsState().find(activeToast => activeToast.id === toastId && !activeToast.isLeaving);
    if (!toast) return;
    this.clearTimer(toastId);
    this.toastsState.update(toasts => toasts.map(activeToast => (activeToast.id === toastId ? { ...activeToast, isLeaving: true } : activeToast)));
    toast.ref.notifyDismissed(reason);
    setTimeout(() => this.toastsState.update(toasts => toasts.filter(activeToast => activeToast.id !== toastId)), TOAST_LEAVE_ANIMATION_MS);
  }

  private clearTimer(toastId: number): void {
    const timer = this.timers.get(toastId);
    if (timer?.timeoutId) clearTimeout(timer.timeoutId);
    this.timers.delete(toastId);
  }

  dismissAll(): void {
    for (const toast of this.toastsState()) this.dismiss(toast.id);
  }

  /** Cambia la configuración global en caliente (posición, duración por defecto, máximo visible…). */
  configure(config: Partial<ToastGlobalConfig>): void {
    this.configState.update(currentConfig => ({ ...currentConfig, ...config }));
    this.dismissOverflowingToasts();
  }
  // #endregion PUBLIC METHODS

  // #region CONTAINER API (uso interno de aesy-toast-container)
  /** @internal Pausa la cuenta atrás mientras el usuario lo mira (hover o foco). */
  pauseTimer(toastId: number): void {
    const timer = this.timers.get(toastId);
    if (!timer?.timeoutId) return;
    clearTimeout(timer.timeoutId);
    timer.remainingMs -= Date.now() - timer.startedAt;
    timer.timeoutId = null;
  }

  /** @internal */
  resumeTimer(toastId: number): void {
    const timer = this.timers.get(toastId);
    if (!timer || timer.timeoutId) return;
    timer.startedAt = Date.now();
    timer.timeoutId = setTimeout(() => this.dismiss(toastId, 'timeout'), timer.remainingMs);
  }

  /** @internal */
  triggerAction(toastId: number): void {
    this.toastsState()
      .find(toast => toast.id === toastId)
      ?.ref.notifyAction();
    this.dismiss(toastId, 'action');
  }
  // #endregion CONTAINER API
}
