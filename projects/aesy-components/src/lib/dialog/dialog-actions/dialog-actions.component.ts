import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Fila de botones al pie de un diálogo. Dentro de `aesy-dialog` se coloca fija al pie (el cuerpo hace scroll);
 * dentro de un componente abierto con `DialogService` queda al final de su contenido.
 */
@Component({
  selector: 'aesy-dialog-actions',
  template: '<ng-content />',
  styleUrl: './dialog-actions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogActionsComponent {}
