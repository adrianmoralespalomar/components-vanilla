import { Component, DestroyRef, Injector, OnInit, forwardRef, inject, input, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { getValidationErrorMessage } from '../shared/utils/get-validation-error-message';
import { hasRequiredValidator } from '../shared/utils/has-required-validator';
import { formatNumberValue } from './utils/format-number-value';
import { parseNumberValue } from './utils/parse-number-value';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true
    }
  ]
})
export class InputNumberComponent implements ControlValueAccessor, OnInit {
  // ---------------------------------------------------------------------------
  // Inputs
  // ---------------------------------------------------------------------------

  readonly label = input<string>('');
  readonly placeholder = input<string>('');

  /**
   * Locale utilizado para el formato.
   *
   * Ejemplos:
   * es-ES -> 1.234,56
   * en-US -> 1,234.56
   * de-DE -> 1.234,56
   */
  readonly locale = input<string>('es-ES');

  /**
   * Muestra separadores de miles.
   */
  readonly useGrouping = input<boolean>(true);

  /**
   * Número mínimo de decimales mostrados.
   */
  readonly minFractionDigits = input<number>(0);

  /**
   * Número máximo de decimales mostrados.
   */
  readonly maxFractionDigits = input<number>(2);

  /**
   * Qué hacer visualmente cuando hay más decimales de los permitidos.
   *
   * round:
   * 12,789 -> 12,79
   *
   * truncate:
   * 12,789 -> 12,78
   */
  readonly roundingMode = input<'round' | 'truncate'>('round');

  /**
   * Formatea el número al perder el foco.
   */
  readonly formatOnBlur = input<boolean>(true);

  /**
   * Permite números negativos.
   */
  readonly allowNegative = input<boolean>(true);

  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);
  readonly step = input<number | null>(null);

  /**
   * Texto situado antes del número.
   *
   * Ejemplo:
   * € 1.234,56
   */
  readonly prefix = input<string>('');

  /**
   * Texto situado después del número.
   *
   * Ejemplo:
   * 1.234,56 €
   */
  readonly suffix = input<string>('');
  readonly textAlign = input<'left' | 'center' | 'right'>('left');

  readonly readonly = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  /**
   * null = detección automática mediante Validators.required.
   */
  readonly required = input<boolean | null>(null);

  /**
   * Permite marcar manualmente el componente como inválido
   * cuando no está conectado a un FormControl.
   */
  readonly invalid = input<boolean>(false);

  /**
   * Sobrescribe el mensaje de error automático.
   */
  readonly errorMessage = input<string | null>(null);

  readonly helpText = input<string | null>(null);

  readonly icon = input<string | null>(null);
  readonly iconPosition = input<'left' | 'right'>('left');

  readonly size = input<'small' | 'medium' | 'large'>('medium');

  readonly id = input<string | null>(null);

  /**
   * Valor externo cuando no usamos Angular Forms.
   *
   * Siempre será number | null.
   */
  readonly value = model<number | null>(null);

  /**
   * Permite mostrar botones + / -.
   */
  readonly showButtons = input<boolean>(false);

  // ---------------------------------------------------------------------------
  // Internal state
  // ---------------------------------------------------------------------------

  private readonly destroyRef = inject(DestroyRef);

  private readonly injector = inject(Injector);

  private ngControl: NgControl | null = null;

  /**
   * Texto que realmente se muestra dentro del input.
   *
   * Puede contener separadores de miles, coma decimal, etc.
   */
  readonly inputValue = signal<string>('');

  readonly focused = signal<boolean>(false);

  /**
   * Necesario para forzar actualización cuando cambia externamente
   * el estado del FormControl.
   */
  private readonly formStateVersion = signal(0);

  readonly generatedId = `app-input-number-${Math.random().toString(36).substring(2, 11)}`;

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null, { self: true });

    if (this.ngControl) {
      const control = this.control;

      if (control) {
        this.inputValue.set(this.formatValue(this.toNumberOrNull(control.value)));

        control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          this.formStateVersion.update(value => value + 1);
        });
      }
    } else {
      this.inputValue.set(this.formatValue(this.value()));
    }
  }
  // ---------------------------------------------------------------------------
  // ControlValueAccessor
  // ---------------------------------------------------------------------------

  writeValue(value: number | null): void {
    const numericValue = this.toNumberOrNull(value);

    this.inputValue.set(this.focused() ? this.formatEditingValue(numericValue) : this.formatValue(numericValue));
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formStateVersion.update(value => value + 1);
  }

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------

  get control(): AbstractControl | null {
    return this.ngControl?.control ?? null;
  }

  get isFormBound(): boolean {
    return !!this.ngControl;
  }

  get inputId(): string {
    return this.id() ?? this.generatedId;
  }

  get currentValue(): number | null {
    if (this.isFormBound) {
      return this.toNumberOrNull(this.control?.value);
    }

    return this.value();
  }

  get isDisabled(): boolean {
    return this.disabled() || !!this.control?.disabled;
  }

  get isReadonly(): boolean {
    return this.readonly();
  }

  get isTouched(): boolean {
    return !!this.control?.touched;
  }

  get isDirty(): boolean {
    return !!this.control?.dirty;
  }

  get isInvalid(): boolean {
    this.formStateVersion();

    if (this.isFormBound) {
      return !!this.control?.invalid;
    }

    return this.invalid();
  }

  /**
   * El error solo se muestra cuando el control ha sido tocado.
   *
   * Para un componente sin FormControl, invalid=true
   * muestra directamente el error.
   */
  get showError(): boolean {
    if (!this.isInvalid) {
      return false;
    }

    if (!this.isFormBound) {
      return true;
    }

    return !!this.control?.touched;
  }

  get isRequired(): boolean {
    if (this.required() !== null) {
      return this.required()!;
    }

    return hasRequiredValidator(this.control);
  }

  get currentErrorMessage(): string {
    if (!this.showError) {
      return '';
    }

    if (!this.isFormBound) {
      return this.errorMessage() ?? '';
    }

    return getValidationErrorMessage(this.control?.errors ?? null, this.errorMessage());
  }

  get currentSizeClass(): string {
    return `input-number-${this.size()}`;
  }

  get hasPrefix(): boolean {
    return !!this.prefix();
  }

  get hasSuffix(): boolean {
    return !!this.suffix();
  }

  get hasIcon(): boolean {
    return !!this.icon();
  }

  // ---------------------------------------------------------------------------
  // Input events
  // ---------------------------------------------------------------------------

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const text = input.value;

    this.inputValue.set(text);

    const numericValue = parseNumberValue(text, this.locale(), this.allowNegative());

    console.log('TEXT:', text);
    console.log('PARSED:', numericValue);

    if (this.isFormBound) {
      console.log('ANTES:', this.control?.value);

      this.onChange(numericValue);

      console.log('DESPUÉS:', this.control?.value);

      queueMicrotask(() => {
        console.log('MICROTASK:', this.control?.value);
      });
    } else {
      this.value.set(numericValue);
    }
  }

  onFocus(): void {
    this.focused.set(true);

    const currentValue = this.currentValue;

    this.inputValue.set(this.formatEditingValue(currentValue));
  }

  onBlur(): void {
    this.focused.set(false);

    this.onTouched();

    if (this.isFormBound) {
      this.control?.markAsTouched();
      this.control?.updateValueAndValidity();
    }

    if (this.formatOnBlur()) {
      this.inputValue.set(this.formatValue(this.currentValue));
    }

    this.formStateVersion.update(value => value + 1);
  }

  // ---------------------------------------------------------------------------
  // Buttons
  // ---------------------------------------------------------------------------

  increment(): void {
    if (this.isDisabled || this.isReadonly) {
      return;
    }

    const step = this.step() ?? 1;
    const current = this.currentValue ?? 0;

    this.setNumericValue(current + step);
  }

  decrement(): void {
    if (this.isDisabled || this.isReadonly) {
      return;
    }

    const step = this.step() ?? 1;
    const current = this.currentValue ?? 0;

    this.setNumericValue(current - step);
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private setNumericValue(value: number): void {
    let nextValue = value;

    if (!this.allowNegative() && nextValue < 0) {
      nextValue = 0;
    }

    const min = this.min();
    const max = this.max();

    if (min !== null && nextValue < min) {
      nextValue = min;
    }

    if (max !== null && nextValue > max) {
      nextValue = max;
    }

    if (this.isFormBound) {
      this.onChange(nextValue);
    } else {
      this.value.set(nextValue);
    }

    this.inputValue.set(this.focused() ? this.formatEditingValue(nextValue) : this.formatValue(nextValue));
  }

  private formatValue(value: number | null): string {
    return formatNumberValue(value, {
      locale: this.locale(),
      useGrouping: this.useGrouping(),
      minFractionDigits: this.minFractionDigits(),
      maxFractionDigits: this.maxFractionDigits(),
      roundingMode: this.roundingMode()
    });
  }

  /**
   * Durante la edición evitamos los separadores de miles.
   *
   * Ejemplo:
   * 1234567.89
   *
   * en vez de:
   * 1.234.567,89
   */
  private formatEditingValue(value: number | null): string {
    return formatNumberValue(value, {
      locale: this.locale(),
      useGrouping: false,
      minFractionDigits: 0,
      maxFractionDigits: 20,
      roundingMode: 'round'
    });
  }

  private toNumberOrNull(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numberValue = Number(value);

    return Number.isFinite(numberValue) ? numberValue : null;
  }
}
