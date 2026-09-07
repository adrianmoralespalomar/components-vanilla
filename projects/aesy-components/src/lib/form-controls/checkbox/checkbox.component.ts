import { ChangeDetectionStrategy, Component, forwardRef, input, model } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextCheckboxId = 0;

@Component({
  selector: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  readonly label = input<string>('');

  readonly readonly = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly required = input<boolean | null>(null);
  readonly invalid = input<boolean>(false);

  readonly errorMessage = input<string | null>(null);
  readonly helpText = input<string | null>(null);

  readonly size = input<'small' | 'medium' | 'large'>('medium');

  readonly id = input<string | null>(null);
  readonly name = input<string | null>(null);

  readonly indeterminate = input<boolean>(false);

  readonly labelPosition = input<'left' | 'right'>('right');

  readonly value = model<boolean>(false);

  private readonly generatedId = `checkbox-${++nextCheckboxId}`;

  private isFormDisabled = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  get inputId(): string {
    return this.id() ? `${this.id()}-checkbox` : this.generatedId;
  }

  get isDisabled(): boolean {
    return this.disabled() || this.isFormDisabled;
  }

  get isReadonly(): boolean {
    return this.readonly() && !this.isDisabled;
  }

  get isRequired(): boolean {
    return this.required() === true;
  }

  get showError(): boolean {
    return this.invalid() && !!this.errorMessage();
  }

  get currentSizeClass(): string {
    return `checkbox-${this.size()}`;
  }

  onClick(event: Event): void {
    console.log('CLICK', this.inputId, this.isReadonly);
    if (this.isReadonly) {
      event.preventDefault();
    }
  }

  onChangeValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.checked;

    this.value.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: boolean | null): void {
    this.value.set(value === true);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isFormDisabled = isDisabled;
  }
}
