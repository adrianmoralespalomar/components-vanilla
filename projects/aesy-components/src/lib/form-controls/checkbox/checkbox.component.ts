import { AfterContentInit, ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject, Injector, input, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { getValidationErrorMessage } from '../shared/utils/get-validation-error-message';
import { hasRequiredValidator } from '../shared/utils/has-required-validator';

let nextCheckboxId = 0;

@Component({
  selector: 'aesy-checkbox',
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
export class CheckboxComponent implements AfterContentInit, ControlValueAccessor {
  // #region INPUTS
  /** Estado disabled para uso sin Angular Forms. */
  readonly disabled = input<boolean>(false);
  /** Mensaje explícito que sobrescribe los mensajes automáticos. */
  readonly errorMessage = input<string | null>(null);
  readonly helpText = input<string | null>(null);
  /** ID opcional proporcionado por el consumidor. */
  readonly id = input<string | null>(null);
  readonly indeterminate = input<boolean>(false);
  /** Permite mostrar un estado de error cuando el componente se utiliza sin Angular Forms. */
  readonly invalid = input<boolean>(false);
  readonly label = input<string>('');
  readonly labelPosition = input<'left' | 'right'>('right');
  readonly name = input<string | null>(null);
  readonly readonly = input<boolean>(false);
  /** null = detectar automáticamente desde FormControl (Validators.required o Validators.requiredTrue). */
  readonly required = input<boolean | null>(null);
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  /** Valor para uso sin Angular Forms. Permite: [(value)]="aceptado" */
  readonly value = model<boolean>(false);
  // #endregion INPUTS

  // #region INTERNAL STATE
  private readonly destroyRef = inject(DestroyRef);
  private readonly formDisabled = signal<boolean>(false);
  /** Fuerza la actualización visual cuando cambia el estado interno del FormControl. */
  private readonly formStateVersion = signal<number>(0);
  private readonly formValue = signal<boolean>(false);
  private readonly generatedId = `aesy-checkbox-${++nextCheckboxId}`;
  private readonly injector = inject(Injector);
  private ngControl: NgControl | null = null;
  // #endregion INTERNAL STATE

  // #region CONTROL VALUE ACCESSOR
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  /** En AfterContentInit y no en OnInit: con formControlName, Angular asigna el control después del ngOnInit del componente. */
  ngAfterContentInit(): void {
    this.ngControl = this.injector.get(NgControl, null);
    this.control?.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.formStateVersion.update(version => version + 1));
  }

  writeValue(value: boolean | null): void {
    this.formValue.set(value === true);
    this.formStateVersion.update(version => version + 1);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
    this.formStateVersion.update(version => version + 1);
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
    return this.id() ? `${this.id()}-checkbox` : this.generatedId;
  }

  get currentValue(): boolean {
    return this.isFormBound ? this.formValue() : this.value();
  }

  get isDisabled(): boolean {
    return this.isFormBound ? this.formDisabled() : this.disabled();
  }

  get isReadonly(): boolean {
    return this.readonly() && !this.isDisabled;
  }

  get isInvalid(): boolean {
    this.formStateVersion();
    if (this.isFormBound) return !!this.control?.invalid;
    return this.invalid();
  }

  get showError(): boolean {
    if (!this.isInvalid) return false;
    // Sin Angular Forms solo hay mensaje si se pasa errorMessage
    if (!this.isFormBound) return !!this.errorMessage();
    return !!this.control?.touched || !!this.control?.dirty;
  }

  get isRequired(): boolean {
    this.formStateVersion();
    const explicitRequired = this.required();
    if (explicitRequired !== null) return explicitRequired;
    return hasRequiredValidator(this.control);
  }

  get currentErrorMessage(): string {
    this.formStateVersion();
    if (!this.isFormBound) return this.errorMessage() ?? '';
    return getValidationErrorMessage(this.control?.errors ?? null, this.errorMessage());
  }

  get currentSizeClass(): string {
    return `checkbox-${this.size()}`;
  }
  // #endregion GETTERS

  // #region EVENTS
  onClick(event: Event): void {
    if (this.isReadonly) event.preventDefault();
  }

  onChangeValue(event: Event): void {
    const newValue = (event.target as HTMLInputElement).checked;

    if (this.isFormBound) {
      this.formValue.set(newValue);
      this.onChange(newValue);
      this.onTouched();
      this.formStateVersion.update(version => version + 1);
    } else {
      this.value.set(newValue);
    }
  }

  onBlur(): void {
    this.onTouched();
    this.control?.markAsTouched();
    this.formStateVersion.update(version => version + 1);
  }
  // #endregion EVENTS
}
