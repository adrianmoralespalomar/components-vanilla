import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, TextareaComponent } from 'aesy-components';
import { ComponentApi } from '../../models/component-api.interface';
import { ApiReferenceComponent } from '../../ui/api-reference/api-reference.component';
import { DocPageComponent } from '../../ui/doc-page/doc-page.component';
import { DocSectionComponent } from '../../ui/doc-section/doc-section.component';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { TEXTAREA_API } from './models/textarea-api.const';
import { TEXTAREA_SNIPPETS } from './models/textarea-snippets.const';

@Component({
  selector: 'app-textarea-page',
  imports: [ApiReferenceComponent, ButtonComponent, DocPageComponent, DocSectionComponent, ReactiveFormsModule, TextareaComponent, ValuePreviewComponent],
  templateUrl: './textarea-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaPageComponent {
  protected readonly API: ComponentApi = TEXTAREA_API;
  protected readonly SNIPPETS = TEXTAREA_SNIPPETS;

  protected readonly bio = signal<string>('Desarrollador frontend. Me gustan los componentes bien hechos.');
  protected readonly comments = signal<string>('');
  protected readonly quote = signal<string>('Menos, pero mejor.');

  protected readonly feedbackForm = new FormGroup({
    message: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(20), Validators.maxLength(200)] })
  });
  protected readonly feedbackFormValue = toSignal(this.feedbackForm.valueChanges, { initialValue: this.feedbackForm.value });

  protected onValidateFeedbackButtonClicked(): void {
    this.feedbackForm.markAllAsTouched();
  }
}
