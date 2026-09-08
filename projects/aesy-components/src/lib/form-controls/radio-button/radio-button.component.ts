import { ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject, Injector, input, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { areValuesEqual } from '../shared/utils/are-values-equal';
import { getValidationErrorMessage } from '../shared/utils/get-validation-error-message';
import { hasRequiredValidator } from '../shared/utils/has-required-validator';
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
  // #region INPUTS
  readonly disabled = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);
  readonly helpText = input<string | null>(null);
  /** ID opcional proporcionado por el consumidor.*/
  readonly id = input<string | null>(null);
  /** Permite mostrar un estado de error cuando el componente se utiliza sin Angular Forms.*/
  readonly invalid = input<boolean>(false);
  readonly label = input<string>('');
  readonly name = input<string | null>(null);
  readonly options = input<RadioButtonOption[]>([]);
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');
  readonly readonly = input<boolean>(false);
  /** null = detectar automáticamente desde FormControl.*/
  readonly required = input<boolean | null>(null);
  /** Valor para uso sin Angular Forms.Permite: [(value)]="nombre"*/
  readonly value = model<any>(null);
  // #endregion INPUTS

  // #region INTERNAL STATE
  private ngControl: NgControl | null = null;
  private readonly destroyRef = inject(DestroyRef);
  private readonly formDisabled = signal<boolean>(false);
  /** Fuerza la actualización visual cuando cambia el estado interno del FormControl.*/
  private readonly formStateVersion = signal(0);
  private readonly formValue = signal<string>('');
  private readonly generatedId = `radio-button-${++nextRadioButtonId}`;
  private readonly injector = inject(Injector);
  // #endregion INTERNAL STATE

  // #region CONTROL VALUE ACCESSOR
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null);
    const control = this.control;

    if (!control) return;

    control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.formStateVersion.update(value => value + 1);
    });
  }

  writeValue(value: any): void {
    const newValue = value ?? '';
    this.formValue.set(newValue);
    this.formStateVersion.update(value => value + 1);
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
    this.formStateVersion.update(value => value + 1);
  }

  // #endregion CONTROL VALUE ACCESSOR

  // #region GETTERS
  get control() {
    return this.ngControl?.control ?? null;
  }

  get isFormBound(): boolean {
    return !!this.control;
  }

  get groupName(): string {
    return this.name() ?? `${this.inputId}-group`;
  }

  get inputId(): string {
    return this.id() ? `${this.id()}-aesy-radio-button` : this.generatedId;
  }

  get currentValue(): string {
    return this.isFormBound ? this.formValue() : this.value();
  }

  get isDisabled(): boolean {
    return this.isFormBound ? this.formDisabled() : this.disabled();
  }

  get isTouched(): boolean {
    this.formStateVersion();
    return !!this.control?.touched;
  }

  get isDirty(): boolean {
    this.formStateVersion();
    return !!this.control?.dirty;
  }

  get isInvalid(): boolean {
    this.formStateVersion();
    if (this.isFormBound) return !!this.control?.invalid;
    return this.invalid();
  }

  get showError(): boolean {
    if (!this.isInvalid) return false;
    if (!this.isFormBound) return true;
    return this.isTouched || this.isDirty;
  }

  get isReadonly(): boolean {
    return this.readonly() && !this.isDisabled;
  }

  get isRequired(): boolean {
    this.formStateVersion();
    const explicitRequired = this.required();
    if (explicitRequired !== null) return explicitRequired;
    return hasRequiredValidator(this.control);
  }

  get currentErrorMessage(): string {
    this.formStateVersion();
    return getValidationErrorMessage(this.control?.errors ?? null, this.errorMessage());
  }

  get hasOptions(): boolean {
    return this.options().length > 0;
  }

  // #endregion GETTERS

  // #region EVENTS
  isSelected(optionValue: any): boolean {
    return areValuesEqual(this.currentValue, optionValue);
  }

  selectOption(option: RadioButtonOption, event?: Event): void {
    if (event) event.preventDefault();
    if (this.isDisabled || this.isReadonly) return;

    const newValue = option.value;
    if (this.isFormBound) {
      this.formValue.set(newValue);
      this.onChange(newValue);
    } else {
      this.value.set(newValue);
    }
    this.onTouched();
  }

  onBlur(): void {
    this.onTouched();
    this.control?.markAsTouched();
    this.control?.updateValueAndValidity();
    this.formStateVersion.update(value => value + 1);
  }
  // #endregion EVENTS
}
