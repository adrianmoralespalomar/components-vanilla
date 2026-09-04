import { ChangeDetectionStrategy, Component, forwardRef, input, model } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { areValuesEqual } from '../shared/utils/are-values-equal';
import { RadioButtonOption } from './models/radio-button-options.interface';

let nextRadioButtonId = 0;

@Component({
  selector: 'app-radio-button',
  standalone: true,
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true
    }
  ]
})
export class RadioButtonComponent implements ControlValueAccessor {
  readonly options = input<RadioButtonOption[]>([]);

  readonly orientation = input<'horizontal' | 'vertical'>('vertical');

  readonly label = input<string>('');
  readonly required = input<boolean | null>(null);

  readonly readonly = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly invalid = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);
  readonly helpText = input<string | null>(null);

  readonly name = input<string | null>(null);
  readonly id = input<string | null>(null);

  readonly size = input<'small' | 'medium' | 'large'>('medium');

  readonly value = model<any>(null);

  private readonly generatedId = `radio-button-${++nextRadioButtonId}`;

  private isFormDisabled = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  get inputId(): string {
    return this.id() ?? this.generatedId;
  }

  get groupName(): string {
    return this.name() ?? `${this.inputId}-group`;
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
    return `radio-button-${this.size()}`;
  }

  get hasOptions(): boolean {
    return this.options().length > 0;
  }

  isSelected(optionValue: any): boolean {
    return areValuesEqual(this.value(), optionValue);
  }

  selectOption(option: RadioButtonOption, event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (this.isDisabled || this.isReadonly) {
      return;
    }

    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isFormDisabled = isDisabled;
  }
}
