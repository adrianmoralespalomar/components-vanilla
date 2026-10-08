import { Observable, Subject } from 'rxjs';

/**
 * Referencia a un diálogo abierto con `DialogService.open`. El componente del diálogo la recibe con
 * `inject(DialogRef)` para cerrarse devolviendo un resultado.
 */
export class DialogRef<TResult = unknown> {
  private readonly afterClosedSubject = new Subject<TResult | undefined>();
  private closeDialog: (result?: TResult) => void = () => {};

  close(result?: TResult): void {
    this.closeDialog(result);
  }

  /** Emite una vez, al cerrarse, con el resultado (undefined si se cerró con Escape, el fondo o el aspa) y termina. */
  afterClosed(): Observable<TResult | undefined> {
    return this.afterClosedSubject.asObservable();
  }

  /** @internal Lo usa DialogService para enlazar la referencia con el diálogo. */
  attachCloseHandler(closeDialog: (result?: TResult) => void): void {
    this.closeDialog = closeDialog;
  }

  /** @internal */
  notifyClosed(result: TResult | undefined): void {
    this.afterClosedSubject.next(result);
    this.afterClosedSubject.complete();
  }
}
