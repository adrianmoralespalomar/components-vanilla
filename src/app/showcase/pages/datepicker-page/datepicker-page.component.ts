import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, DatepickerComponent } from 'aesy-components';
import { ComponentApi } from '../../models/component-api.interface';
import { ApiReferenceComponent } from '../../ui/api-reference/api-reference.component';
import { DocPageComponent } from '../../ui/doc-page/doc-page.component';
import { DocSectionComponent } from '../../ui/doc-section/doc-section.component';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { DATEPICKER_API } from './models/datepicker-api.const';
import { DATEPICKER_SNIPPETS } from './models/datepicker-snippets.const';
import { DAYS_IN_BOOKING_WINDOW } from './models/days-in-booking-window.const';

@Component({
  selector: 'app-datepicker-page',
  imports: [ApiReferenceComponent, ButtonComponent, DatepickerComponent, DocPageComponent, DocSectionComponent, ReactiveFormsModule, ValuePreviewComponent],
  templateUrl: './datepicker-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerPageComponent {
  protected readonly API: ComponentApi = DATEPICKER_API;
  protected readonly SNIPPETS = DATEPICKER_SNIPPETS;
  protected readonly TODAY: Date = new Date();
  protected readonly BOOKING_WINDOW_END: Date = new Date(this.TODAY.getFullYear(), this.TODAY.getMonth(), this.TODAY.getDate() + DAYS_IN_BOOKING_WINDOW);

  protected readonly appointmentDate = signal<Date | string | null>(null);
  protected readonly deliveryDate = signal<Date | string | null>(new Date());
  protected readonly englishDate = signal<Date | string | null>(new Date());
  protected readonly fullWidthDate = signal<Date | string | null>(null);
  protected readonly isoDate = signal<Date | string | null>(null);

  protected readonly bookingForm = new FormGroup({
    checkIn: new FormControl<Date | null>(null, { validators: [Validators.required] })
  });
  protected readonly bookingFormValue = toSignal(this.bookingForm.valueChanges, { initialValue: this.bookingForm.value });

  protected onValidateBookingButtonClicked(): void {
    this.bookingForm.markAllAsTouched();
  }
}
