import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, DialogActionsComponent, DialogComponent, DialogService, DialogSize, InputTextComponent } from 'aesy-components';
import { ComponentApi } from '../../models/component-api.interface';
import { ApiReferenceComponent } from '../../ui/api-reference/api-reference.component';
import { DocPageComponent } from '../../ui/doc-page/doc-page.component';
import { DocSectionComponent } from '../../ui/doc-section/doc-section.component';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDeleteDialogData } from './models/confirm-delete-dialog-data.interface';
import { DIALOG_API } from './models/dialog-api.const';
import { DIALOG_LONG_CONTENT_PARAGRAPHS } from './models/dialog-long-content-paragraphs.const';
import { DIALOG_SERVICE_API } from './models/dialog-service-api.const';
import { DIALOG_SIZE_OPTIONS } from './models/dialog-size-options.const';
import { DIALOG_SNIPPETS } from './models/dialog-snippets.const';

@Component({
  selector: 'app-dialog-page',
  imports: [ApiReferenceComponent, ButtonComponent, DialogActionsComponent, DialogComponent, DocPageComponent, DocSectionComponent, InputTextComponent, ReactiveFormsModule, ValuePreviewComponent],
  templateUrl: './dialog-page.component.html',
  styleUrl: './dialog-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);

  protected readonly DIALOG_API: ComponentApi = DIALOG_API;
  protected readonly DIALOG_SERVICE_API: ComponentApi = DIALOG_SERVICE_API;
  protected readonly LONG_CONTENT_PARAGRAPHS: string[] = DIALOG_LONG_CONTENT_PARAGRAPHS;
  protected readonly SIZE_OPTIONS: DialogSize[] = DIALOG_SIZE_OPTIONS;
  protected readonly SNIPPETS = DIALOG_SNIPPETS;

  protected readonly profileForm = new FormGroup({
    email: new FormControl<string>('adrian@example.com', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    fullName: new FormControl<string>('Adrián', { nonNullable: true, validators: [Validators.required] })
  });

  protected readonly basicDialogResult = signal<unknown>('todavía no se ha cerrado');
  protected readonly deleteProjectResult = signal<string>('todavía no se ha abierto');
  protected readonly isBasicDialogOpen = signal<boolean>(false);
  protected readonly isProfileDialogOpen = signal<boolean>(false);
  protected readonly isSizedDialogOpen = signal<boolean>(false);
  protected readonly isTermsDialogOpen = signal<boolean>(false);
  protected readonly isThemedDialogOpen = signal<boolean>(false);
  protected readonly savedProfile = signal<unknown>(null);
  protected readonly selectedSize = signal<DialogSize>('medium');
  protected readonly termsResult = signal<unknown>('pendientes');

  protected onOpenBasicDialogButtonClicked(): void {
    this.isBasicDialogOpen.set(true);
  }

  protected onBasicDialogClosed(result: unknown): void {
    this.basicDialogResult.set(result ?? 'undefined (Escape, fondo o aspa)');
  }

  protected onSizeButtonClicked(size: DialogSize): void {
    this.selectedSize.set(size);
    this.isSizedDialogOpen.set(true);
  }

  protected onOpenProfileDialogButtonClicked(): void {
    this.isProfileDialogOpen.set(true);
  }

  /** Sin resultado (Cancelar, Escape, fondo o aspa) se descartan los cambios. */
  protected onProfileDialogClosed(result: unknown): void {
    if (result) return this.savedProfile.set(result);
    this.profileForm.reset();
  }

  protected onSaveProfileButtonClicked(profileDialog: DialogComponent): void {
    if (this.profileForm.invalid) return this.profileForm.markAllAsTouched();
    profileDialog.close(this.profileForm.getRawValue());
  }

  protected onDeleteProjectButtonClicked(): void {
    const data: ConfirmDeleteDialogData = { projectName: 'Rediseño web', tasksCount: 24 };
    this.dialogService
      .open<ConfirmDeleteDialogComponent, ConfirmDeleteDialogData, boolean>(ConfirmDeleteDialogComponent, { data, role: 'alertdialog', size: 'small', title: '¿Eliminar el proyecto?' })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isConfirmed => this.deleteProjectResult.set(isConfirmed === undefined ? 'undefined (Escape, fondo o aspa)' : `${isConfirmed}`));
  }

  protected onOpenTermsDialogButtonClicked(): void {
    this.isTermsDialogOpen.set(true);
  }

  protected onTermsDialogClosed(result: unknown): void {
    this.termsResult.set(result);
  }

  protected onOpenThemedDialogButtonClicked(): void {
    this.isThemedDialogOpen.set(true);
  }
}
