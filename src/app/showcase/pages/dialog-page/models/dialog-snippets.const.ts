import { DocSnippet } from '../../../models/doc-snippet.interface';

export const DIALOG_SNIPPETS = {
  basic: {
    ts: `import { ButtonComponent, DialogActionsComponent, DialogComponent } from 'aesy-components';

@Component({
  imports: [ButtonComponent, DialogActionsComponent, DialogComponent]
})
export class ArticleComponent {
  protected readonly isPublishDialogOpen = signal<boolean>(false);

  protected onPublishButtonClicked(): void {
    this.isPublishDialogOpen.set(true);
  }

  protected onPublishDialogClosed(result: unknown): void {
    if (result === 'publicado') this.publishArticle();
  }
}`,
    html: `<aesy-button label="Publicar" (buttonClick)="onPublishButtonClicked()" />

<aesy-dialog
  #publishDialog
  title="Publicar artículo"
  [(open)]="isPublishDialogOpen"
  (closed)="onPublishDialogClosed($event)">
  <p>El artículo será visible para todos los lectores.</p>
  <aesy-dialog-actions>
    <aesy-button label="Cancelar" (buttonClick)="publishDialog.close('cancelado')" />
    <aesy-button type="secondary" label="Publicar" (buttonClick)="publishDialog.close('publicado')" />
  </aesy-dialog-actions>
</aesy-dialog>`
  },
  sizes: {
    html: `<aesy-dialog size="small">…</aesy-dialog>
<aesy-dialog>…</aesy-dialog> <!-- medium -->
<aesy-dialog size="large">…</aesy-dialog>
<aesy-dialog size="fullscreen">…</aesy-dialog>`,
    css: `/* Los anchos se cambian con variables */
:root {
  --aesy-dialog-width-small: 22rem;
  --aesy-dialog-width-medium: 34rem;
  --aesy-dialog-width-large: 56rem;
}`
  },
  form: {
    ts: `protected onSaveProfileButtonClicked(profileDialog: DialogComponent): void {
  if (this.profileForm.invalid) return this.profileForm.markAllAsTouched();
  profileDialog.close(this.profileForm.getRawValue());
}

/** Sin resultado (Cancelar, Escape, fondo o aspa) se descartan los cambios. */
protected onProfileDialogClosed(result: unknown): void {
  if (result) return this.savedProfile.set(result);
  this.profileForm.reset();
}`,
    html: `<aesy-dialog
  #profileDialog
  title="Editar perfil"
  size="small"
  [(open)]="isProfileDialogOpen"
  (closed)="onProfileDialogClosed($event)">
  <form [formGroup]="profileForm">
    <aesy-input-text label="Nombre" formControlName="fullName" />
    <aesy-input-text label="Correo" type="email" formControlName="email" />
  </form>
  <aesy-dialog-actions>
    <aesy-button label="Cancelar" (buttonClick)="profileDialog.close()" />
    <aesy-button type="secondary" label="Guardar" (buttonClick)="onSaveProfileButtonClicked(profileDialog)" />
  </aesy-dialog-actions>
</aesy-dialog>`
  },
  service: {
    ts: `// confirm-delete-dialog.component.ts
@Component({
  selector: 'app-confirm-delete-dialog',
  imports: [ButtonComponent, DialogActionsComponent],
  templateUrl: './confirm-delete-dialog.component.html'
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

// projects.component.ts
private readonly dialogService = inject(DialogService);

protected onDeleteProjectButtonClicked(): void {
  this.dialogService
    .open<ConfirmDeleteDialogComponent, ConfirmDeleteDialogData, boolean>(ConfirmDeleteDialogComponent, {
      data: { projectName: 'Rediseño web', tasksCount: 24 },
      role: 'alertdialog',
      size: 'small',
      title: '¿Eliminar el proyecto?'
    })
    .afterClosed()
    .subscribe(isConfirmed => {
      if (isConfirmed) this.deleteProject();
    });
}`,
    html: `<!-- confirm-delete-dialog.component.html -->
<p>Vas a eliminar <strong>{{ data.projectName }}</strong> y sus {{ data.tasksCount }} tareas.</p>
<aesy-dialog-actions>
  <aesy-button label="Cancelar" (buttonClick)="onCancelButtonClicked()" />
  <aesy-button type="danger" label="Eliminar proyecto" (buttonClick)="onDeleteButtonClicked()" />
</aesy-dialog-actions>`
  },
  forcedChoice: {
    html: `<aesy-dialog
  #termsDialog
  title="Nuevos términos de uso"
  role="alertdialog"
  [closeOnBackdropClick]="false"
  [closeOnEscape]="false"
  [showCloseButton]="false"
  [(open)]="isTermsDialogOpen">
  …
  <aesy-dialog-actions>
    <aesy-button label="Rechazar" (buttonClick)="termsDialog.close('rechazados')" />
    <aesy-button type="secondary" label="Aceptar" (buttonClick)="termsDialog.close('aceptados')" />
  </aesy-dialog-actions>
</aesy-dialog>`
  },
  theming: {
    css: `/* En el diálogo, en un contenedor o en :root para toda la app */
aesy-dialog.brand-dialog {
  --aesy-dialog-backdrop-background: rgb(59 29 110 / 0.45);
  --aesy-dialog-background: #faf7ff;
  --aesy-dialog-border-radius: 20px;
  --aesy-dialog-focus-color: #7c3aed;
  --aesy-dialog-title-color: #3b1d6e;
  --aesy-dialog-transition-duration: 0.35s;
}

/* Todas las variables, con su valor por defecto:
  --aesy-dialog-background: #ffffff;
  --aesy-dialog-backdrop-background: rgb(17 24 39 / 0.5);
  --aesy-dialog-border-radius: 0.75rem;
  --aesy-dialog-shadow: 0 24px 48px -12px rgb(17 24 39 / 0.3);
  --aesy-dialog-text-color: #374151;
  --aesy-dialog-title-color: #111827;
  --aesy-dialog-title-font-size: 1.125rem;
  --aesy-dialog-title-font-weight: 600;
  --aesy-dialog-body-font-size: 0.9375rem;
  --aesy-dialog-padding: 1.5rem;
  --aesy-dialog-width-small: 24rem;
  --aesy-dialog-width-medium: 32rem;
  --aesy-dialog-width-large: 48rem;
  --aesy-dialog-close-button-color: #6b7280;
  --aesy-dialog-close-button-background-hover: #f3f4f6;
  --aesy-dialog-actions-border: 1px solid #f3f4f6;
  --aesy-dialog-actions-gap: 0.5rem;
  --aesy-dialog-actions-justify-content: flex-end;
  --aesy-dialog-focus-color: #3b82f6;
  --aesy-dialog-transition-duration: 0.2s;
*/`
  }
} satisfies Record<string, DocSnippet>;
