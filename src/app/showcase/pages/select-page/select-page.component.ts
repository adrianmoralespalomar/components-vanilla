import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, SelectComponent, SelectOption } from 'aesy-components';
import { ComponentApi } from '../../models/component-api.interface';
import { DEMO_COUNTRY_OPTIONS } from '../../models/demo-country-options.const';
import { ApiReferenceComponent } from '../../ui/api-reference/api-reference.component';
import { DocPageComponent } from '../../ui/doc-page/doc-page.component';
import { DocSectionComponent } from '../../ui/doc-section/doc-section.component';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { minimumSelectedOptionsValidator } from '../../utils/minimum-selected-options.validator';
import { SELECT_API } from './models/select-api.const';
import { SELECT_DEMO_OPTIONS } from './models/select-demo-options.const';
import { SELECT_SNIPPETS } from './models/select-snippets.const';
import { ShippingMethod } from './models/shipping-method.interface';

@Component({
  selector: 'app-select-page',
  imports: [ApiReferenceComponent, ButtonComponent, DocPageComponent, DocSectionComponent, ReactiveFormsModule, SelectComponent, ValuePreviewComponent],
  templateUrl: './select-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectPageComponent {
  protected readonly API: ComponentApi = SELECT_API;
  protected readonly COUNTRY_OPTIONS: SelectOption[] = DEMO_COUNTRY_OPTIONS;
  protected readonly DEMO_OPTIONS = SELECT_DEMO_OPTIONS;
  protected readonly SNIPPETS = SELECT_SNIPPETS;

  protected readonly basicCountry = signal<string | null>(null);
  protected readonly clearableCountry = signal<string | null>('PT');
  protected readonly disabledOptionsCountry = signal<string | null>('ES');
  protected readonly lastChangedValue = signal<unknown>(null);
  protected readonly multipleSkills = signal<string[]>(['angular', 'signals']);
  protected readonly selectedIconSkills = signal<string[]>(['typescript']);
  protected readonly shippingMethod = signal<ShippingMethod | null>({ id: 2, code: 'EXPRESS', price: 4.95 });
  protected readonly alignedCountry = signal<string | null>('FR');

  protected readonly profileForm = new FormGroup({
    country: new FormControl<string | null>(null, { validators: [Validators.required] }),
    skills: new FormControl<string[]>([], { validators: [minimumSelectedOptionsValidator(2)] })
  });
  protected readonly profileFormValue = toSignal(this.profileForm.valueChanges, { initialValue: this.profileForm.value });

  protected onBasicSelectValueChanged(value: unknown): void {
    this.lastChangedValue.set(value);
  }

  protected onMarkFormAsTouchedButtonClicked(): void {
    this.profileForm.markAllAsTouched();
  }

  protected onResetFormButtonClicked(): void {
    this.profileForm.reset();
  }
}
