import { ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject, Injector, input, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { getValidationErrorMessage } from '../shared/utils/get-validation-error-message';
import { hasRequiredValidator } from '../shared/utils/has-required-validator';

let nextInputId = 0;

type InputTextType = 'text' | 'password' | 'email';

type IconPosition = 'left' | 'right';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true
    }
  ]
})
export class InputTextComponent implements ControlValueAccessor {
  // #region INPUTS
  /**
   * Si es false y existe maxlength, el navegador impedirá escribir más caracteres.
   * Si es true, permitimos escribir el valor completo y dejamos que Angular Forms marque el control como inválido.
   */
  readonly allowTypeInvalidValue = input<boolean>(false);
  readonly autocomplete = input<string>('off');
  /** Estado disabled para uso sin Angular Forms.*/
  readonly disabled = input<boolean>(false);
  /** Mensaje explícito que sobrescribe los mensajes automáticos.*/
  readonly errorMessage = input<string | null>(null);
  readonly helpText = input<string | null>(null);
  readonly icon = input<string | null>(null);
  readonly iconPosition = input<IconPosition>('left');
  /** ID opcional proporcionado por el consumidor.*/
  readonly id = input<string | null>(null);
  /** Permite mostrar un estado de error cuando el componente se utiliza sin Angular Forms.*/
  readonly invalid = input<boolean>(false);
  readonly label = input<string>('');
  readonly maxlength = input<number | null>(null);
  readonly placeholder = input<string>('');
  readonly readonly = input<boolean>(false);
  /** null = detectar automáticamente desde FormControl.*/
  readonly required = input<boolean | null>(null);
  readonly showCharCount = input<boolean>(false);
  readonly textAlign = input<'left' | 'center' | 'right'>('left');
  readonly type = input<InputTextType>('text');
  /** Valor para uso sin Angular Forms.Permite: [(value)]="nombre"*/
  readonly value = model<string>('');
  // #endregion INPUTS

  // #region INTERNAL STATE
  private ngControl: NgControl | null = null;
  private readonly destroyRef = inject(DestroyRef);
  private readonly formDisabled = signal<boolean>(false);
  /** Fuerza la actualización visual cuando cambia el estado interno del FormControl. */
  private readonly formStateVersion = signal(0);
  private readonly formValue = signal<string>('');
  private readonly generatedId = `app-input-text-${nextInputId++}`;
  private readonly injector = inject(Injector);
  protected readonly showPassword = signal<boolean>(false);

  // #endregion INTERNAL STATE

  // #region CONTROL VALUE ACCESSOR
  private onChange: (value: string) => void = () => {};

  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null);
    const control = this.control;
    if (!control) return;
    control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.formStateVersion.update(value => value + 1);
    });
  }

  writeValue(value: string | null): void {
    const newValue = value ?? '';
    this.formValue.set(newValue);
    this.formStateVersion.update(value => value + 1);
  }

  registerOnChange(fn: (value: string) => void): void {
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

  get inputId(): string {
    return this.id() ? `${this.id()}-aesy-input-text` : this.generatedId;
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

  get isRequired(): boolean {
    this.formStateVersion();
    const explicitRequired = this.required();
    if (explicitRequired !== null) return explicitRequired;
    return hasRequiredValidator(this.control);
  }

  get currentLength(): number {
    return this.currentValue?.length ?? 0;
  }

  get currentMaxLength(): number | null {
    const explicitMaxLength = this.maxlength();
    if (explicitMaxLength !== null) return explicitMaxLength;
    const maxlengthError = this.control?.errors?.['maxlength'];
    return maxlengthError?.requiredLength ?? null;
  }

  get currentErrorMessage(): string {
    this.formStateVersion();
    return getValidationErrorMessage(this.control?.errors ?? null, this.errorMessage());
  }

  get inputType(): InputTextType {
    if (this.type() === 'password' && this.showPassword()) return 'text';
    return this.type();
  }

  get isPassword(): boolean {
    return this.type() === 'password';
  }

  get hasLeftIcon(): boolean {
    return !!this.icon() && this.iconPosition() === 'left';
  }

  get hasRightIcon(): boolean {
    return !!this.icon() && this.iconPosition() === 'right';
  }
  // #endregion GETTERS

  // #region EVENTS
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;

    if (this.isFormBound) {
      this.formValue.set(newValue);
      this.onChange(newValue);
    } else {
      this.value.set(newValue);
    }
  }

  onBlur(): void {
    this.onTouched();
    this.control?.markAsTouched();
    this.control?.updateValueAndValidity();
    this.formStateVersion.update(value => value + 1);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }
  // #endregion EVENTS
}
