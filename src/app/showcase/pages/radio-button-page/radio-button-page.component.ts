import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, RadioButtonComponent, RadioButtonOption } from 'aesy-components';
import { ComponentApi } from '../../models/component-api.interface';
import { DEMO_PLAN_OPTIONS } from '../../models/demo-plan-options.const';
import { ApiReferenceComponent } from '../../ui/api-reference/api-reference.component';
import { DocPageComponent } from '../../ui/doc-page/doc-page.component';
import { DocSectionComponent } from '../../ui/doc-section/doc-section.component';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { CountryValue } from './models/country-value.interface';
import { RADIO_BUTTON_API } from './models/radio-button-api.const';
import { RADIO_BUTTON_SNIPPETS } from './models/radio-button-snippets.const';
import { RADIO_COUNTRY_OPTIONS } from './models/radio-country-options.const';

@Component({
  selector: 'app-radio-button-page',
  imports: [ApiReferenceComponent, ButtonComponent, DocPageComponent, DocSectionComponent, RadioButtonComponent, ReactiveFormsModule, ValuePreviewComponent],
  templateUrl: './radio-button-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonPageComponent {
  protected readonly API: ComponentApi = RADIO_BUTTON_API;
  protected readonly COUNTRY_OPTIONS: RadioButtonOption[] = RADIO_COUNTRY_OPTIONS;
  protected readonly PLAN_OPTIONS: RadioButtonOption[] = DEMO_PLAN_OPTIONS;
  protected readonly SNIPPETS = RADIO_BUTTON_SNIPPETS;

  protected readonly country = signal<CountryValue>({ id: 2, code: 'FR' });
  protected readonly horizontalPlan = signal<string>('yearly');
  protected readonly plan = signal<string>('monthly');

  protected readonly subscriptionForm = new FormGroup({
    plan: new FormControl<string | null>(null, { validators: [Validators.required] })
  });
  protected readonly subscriptionFormValue = toSignal(this.subscriptionForm.valueChanges, { initialValue: this.subscriptionForm.value });

  protected onValidateSubscriptionButtonClicked(): void {
    this.subscriptionForm.markAllAsTouched();
  }
}
