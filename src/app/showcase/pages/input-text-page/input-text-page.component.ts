import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, InputTextComponent } from 'aesy-components';
import { ComponentApi } from '../../models/component-api.interface';
import { ApiReferenceComponent } from '../../ui/api-reference/api-reference.component';
import { DocPageComponent } from '../../ui/doc-page/doc-page.component';
import { DocSectionComponent } from '../../ui/doc-section/doc-section.component';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { forbiddenValueValidator } from '../../utils/forbidden-value.validator';
import { INPUT_TEXT_API } from './models/input-text-api.const';
import { INPUT_TEXT_SNIPPETS } from './models/input-text-snippets.const';

@Component({
  selector: 'app-input-text-page',
  imports: [ApiReferenceComponent, ButtonComponent, DocPageComponent, DocSectionComponent, InputTextComponent, ReactiveFormsModule, ValuePreviewComponent],
  templateUrl: './input-text-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTextPageComponent {
  protected readonly API: ComponentApi = INPUT_TEXT_API;
  protected readonly SNIPPETS = INPUT_TEXT_SNIPPETS;

  protected readonly alignedCode = signal<string>('ES-2026');
  protected readonly amount = signal<string>('120');
  protected readonly fullName = signal<string>('');
  protected readonly headline = signal<string>('Nueva librería de componentes');
  protected readonly username = signal<string>('');

  protected readonly headlineControl = new FormControl<string>('Un titular demasiado largo', { nonNullable: true, validators: [Validators.maxLength(20)] });
  protected readonly signUpForm = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), forbiddenValueValidator('admin', 'El usuario "admin" está reservado.')] })
  });
  protected readonly signUpFormValue = toSignal(this.signUpForm.valueChanges, { initialValue: this.signUpForm.value });

  constructor() {
    this.headlineControl.markAsTouched();
  }

  protected onValidateSignUpButtonClicked(): void {
    this.signUpForm.markAllAsTouched();
  }
}
