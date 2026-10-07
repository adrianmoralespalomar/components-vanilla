import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, CheckboxComponent } from 'aesy-components';
import { ComponentApi } from '../../models/component-api.interface';
import { ApiReferenceComponent } from '../../ui/api-reference/api-reference.component';
import { DocPageComponent } from '../../ui/doc-page/doc-page.component';
import { DocSectionComponent } from '../../ui/doc-section/doc-section.component';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { CHECKBOX_API } from './models/checkbox-api.const';
import { CHECKBOX_NOTIFICATION_LABELS } from './models/checkbox-notification-labels.const';
import { CHECKBOX_SNIPPETS } from './models/checkbox-snippets.const';

@Component({
  selector: 'app-checkbox-page',
  imports: [ApiReferenceComponent, ButtonComponent, CheckboxComponent, DocPageComponent, DocSectionComponent, ReactiveFormsModule, ValuePreviewComponent],
  templateUrl: './checkbox-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxPageComponent {
  protected readonly API: ComponentApi = CHECKBOX_API;
  protected readonly NOTIFICATION_LABELS: string[] = CHECKBOX_NOTIFICATION_LABELS;
  protected readonly SNIPPETS = CHECKBOX_SNIPPETS;

  protected readonly acceptedTerms = signal<boolean>(false);
  protected readonly selectedNotifications = signal<boolean[]>([true, false, false]);
  protected readonly areAllNotificationsSelected = computed<boolean>(() => this.selectedNotifications().every(Boolean));
  protected readonly areSomeNotificationsSelected = computed<boolean>(() => this.selectedNotifications().some(Boolean) && !this.areAllNotificationsSelected());

  protected readonly termsControl = new FormControl<boolean>(false, { nonNullable: true, validators: [Validators.requiredTrue] });
  protected readonly termsControlStatus = toSignal(this.termsControl.statusChanges, { initialValue: this.termsControl.status });

  protected onAllNotificationsChanged(isChecked: boolean): void {
    this.selectedNotifications.update(selected => selected.map(() => isChecked));
  }

  protected onNotificationChanged(notificationIndex: number, isChecked: boolean): void {
    this.selectedNotifications.update(selected => selected.map((wasChecked, index) => (index === notificationIndex ? isChecked : wasChecked)));
  }

  protected onValidateTermsButtonClicked(): void {
    this.termsControl.markAsTouched();
    this.termsControl.updateValueAndValidity();
  }
}
