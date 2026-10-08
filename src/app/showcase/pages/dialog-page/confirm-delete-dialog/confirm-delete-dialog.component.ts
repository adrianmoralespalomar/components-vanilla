import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AESY_DIALOG_DATA, ButtonComponent, DialogActionsComponent, DialogRef } from 'aesy-components';
import { ConfirmDeleteDialogData } from '../models/confirm-delete-dialog-data.interface';

/** Contenido de ejemplo para DialogService.open: recibe datos y se cierra devolviendo true o false. */
@Component({
  selector: 'app-confirm-delete-dialog',
  imports: [ButtonComponent, DialogActionsComponent],
  templateUrl: './confirm-delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDeleteDialogComponent {
  private readonly dialogRef = inject<DialogRef<boolean>>(DialogRef);

  protected readonly data = inject<ConfirmDeleteDialogData>(AESY_DIALOG_DATA);

  protected onCancelButtonClicked(): void {
    this.dialogRef.close(false);
  }

  protected onDeleteButtonClicked(): void {
    this.dialogRef.close(true);
  }
}
