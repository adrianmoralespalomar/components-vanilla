import { Observable, Subject } from 'rxjs';
import { ToastDismissReason } from './models/toast-dismiss-reason.type';

/** Referencia a un toast abierto con `ToastService`. */
export class ToastRef {
  private readonly actionSubject = new Subject<void>();
  private readonly afterDismissedSubject = new Subject<ToastDismissReason>();

  constructor(
    readonly id: number,
    private readonly dismissToast: () => void
  ) {}

  dismiss(): void {
    this.dismissToast();
  }

  /** Emite si el usuario pulsa el botón de acción. Termina al cerrarse el toast. */
  onAction(): Observable<void> {
    return this.actionSubject.asObservable();
  }

  /** Emite una vez, al cerrarse, con el motivo, y termina. */
  afterDismissed(): Observable<ToastDismissReason> {
    return this.afterDismissedSubject.asObservable();
  }

  /** @internal */
  notifyAction(): void {
    this.actionSubject.next();
  }

  /** @internal */
  notifyDismissed(reason: ToastDismissReason): void {
    this.afterDismissedSubject.next(reason);
    this.afterDismissedSubject.complete();
    this.actionSubject.complete();
  }
}
