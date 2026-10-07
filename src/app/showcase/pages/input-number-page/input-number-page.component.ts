import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, InputNumberComponent } from 'aesy-components';
import { ComponentApi } from '../../models/component-api.interface';
import { ApiReferenceComponent } from '../../ui/api-reference/api-reference.component';
import { DocPageComponent } from '../../ui/doc-page/doc-page.component';
import { DocSectionComponent } from '../../ui/doc-section/doc-section.component';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { INPUT_NUMBER_API } from './models/input-number-api.const';
import { INPUT_NUMBER_SNIPPETS } from './models/input-number-snippets.const';

@Component({
  selector: 'app-input-number-page',
  imports: [ApiReferenceComponent, ButtonComponent, DocPageComponent, DocSectionComponent, InputNumberComponent, ReactiveFormsModule, ValuePreviewComponent],
  templateUrl: './input-number-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputNumberPageComponent {
  protected readonly API: ComponentApi = INPUT_NUMBER_API;
  protected readonly SNIPPETS = INPUT_NUMBER_SNIPPETS;

  protected readonly amount = signal<number | null>(2132.45);
  protected readonly discount = signal<number | null>(15);
  protected readonly localeAmount = signal<number | null>(1234567.89);
  protected readonly price = signal<number | null>(12.789);
  protected readonly stock = signal<number | null>(40);
  protected readonly units = signal<number | null>(3);

  protected readonly orderForm = new FormGroup({
    quantity: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1), Validators.max(99)] })
  });
  protected readonly orderFormValue = toSignal(this.orderForm.valueChanges, { initialValue: this.orderForm.value });

  protected onValidateOrderButtonClicked(): void {
    this.orderForm.markAllAsTouched();
  }
}
