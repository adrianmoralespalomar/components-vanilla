import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, Injector, forwardRef, inject, input, model, signal } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

import { areValuesEqual } from '../shared/utils/are-values-equal';
import { getValidationErrorMessage } from '../shared/utils/get-validation-error-message';
import { hasRequiredValidator } from '../shared/utils/has-required-validator';
import { SelectOption } from './models/select-option.interface';

let nextSelectId = 0;

type SelectSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  // ---------------------------------------------------------------------------
  // Inputs
  // ---------------------------------------------------------------------------

  readonly options = input<SelectOption[]>([]);

  /**
   * Permite seleccionar una o varias opciones.
   *
   * false:
   *   T | null
   *
   * true:
   *   T[]
   */
  readonly multiple = input<boolean>(false);

  readonly label = input<string>('');
  readonly placeholder = input<string>('Selecciona una opción');

  /**
   * Muestra un botón para limpiar la selección.
   */
  readonly clearable = input<boolean>(false);

  readonly readonly = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  /**
   * null = detectar automáticamente desde FormControl.
   */
  readonly required = input<boolean | null>(null);

  /**
   * Permite mostrar un estado de error cuando el componente
   * se utiliza sin Angular Forms.
   */
  readonly invalid = input<boolean>(false);

  /**
   * Mensaje explícito que sobrescribe los mensajes automáticos.
   */
  readonly errorMessage = input<string | null>(null);

  readonly helpText = input<string | null>(null);

  readonly size = input<SelectSize>('medium');

  /**
   * ID opcional proporcionado por el consumidor.
   */
  readonly id = input<string | null>(null);

  readonly name = input<string | null>(null);

  /**
   * Valor para uso sin Angular Forms.
   *
   * Single:
   *   [(value)]="selectedCountry"
   *
   * Multiple:
   *   [(value)]="selectedCountries"
   */
  readonly value = model<any | any[] | null>(null);

  // ---------------------------------------------------------------------------
  // Internal state
  // ---------------------------------------------------------------------------

  private readonly destroyRef = inject(DestroyRef);

  private readonly injector = inject(Injector);

  private ngControl: NgControl | null = null;

  private readonly formValue = signal<any | any[] | null>(null);
  private readonly formDisabled = signal<boolean>(false);

  /**
   * Fuerza la actualización visual cuando cambia el estado
   * interno del FormControl.
   */
  private readonly formStateVersion = signal(0);

  private readonly generatedId = `app-select-${nextSelectId++}`;

  readonly isOpen = signal(false);

  protected highlightedIndex = signal<number>(-1);

  // ---------------------------------------------------------------------------
  // ControlValueAccessor
  // ---------------------------------------------------------------------------

  private onChange: (value: any | any[] | null) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null, { self: true });

    const control = this.control;

    if (!control) {
      return;
    }

    /**
     * events incluye cambios de:
     *
     * - value
     * - status
     * - touched
     * - pristine/dirty
     * - etc.
     *
     * Esto hace que el componente reaccione también cuando
     * el FormControl es modificado desde fuera.
     */
    control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.formStateVersion.update(value => value + 1);
    });
  }

  writeValue(value: any | any[] | null): void {
    const newValue = this.normalizeValue(value);

    this.formValue.set(newValue);
    this.formStateVersion.update(value => value + 1);
  }

  registerOnChange(fn: (value: any | any[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
    this.formStateVersion.update(value => value + 1);

    if (isDisabled) {
      this.close();
    }
  }

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------

  get control() {
    return this.ngControl?.control ?? null;
  }

  get isFormBound(): boolean {
    return !!this.control;
  }

  get selectId(): string {
    return this.id() ? `${this.id()}-select` : this.generatedId;
  }

  get listboxId(): string {
    return `${this.selectId}-listbox`;
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

    if (this.isFormBound) {
      return !!this.control?.invalid;
    }

    return this.invalid();
  }

  get showError(): boolean {
    if (!this.isInvalid) {
      return false;
    }

    if (!this.isFormBound) {
      return true;
    }

    return this.isTouched || this.isDirty;
  }

  get isRequired(): boolean {
    this.formStateVersion();

    const explicitRequired = this.required();

    if (explicitRequired !== null) {
      return explicitRequired;
    }

    return hasRequiredValidator(this.control);
  }

  get currentErrorMessage(): string {
    this.formStateVersion();

    return getValidationErrorMessage(this.control?.errors ?? null, this.errorMessage());
  }

  get currentSizeClass(): string {
    return `select-${this.size()}`;
  }

  get currentValue(): any | any[] | null {
    return this.isFormBound ? this.formValue() : this.value();
  }

  get selectedOptions(): SelectOption[] {
    const options = this.options();
    const currentValue = this.currentValue;

    if (this.multiple()) {
      const values = Array.isArray(currentValue) ? currentValue : [];

      return options.filter(option => values.some(value => areValuesEqual(value, option.value)));
    }

    if (currentValue === null || currentValue === undefined) {
      return [];
    }

    const selected = options.find(option => areValuesEqual(option.value, currentValue));

    return selected ? [selected] : [];
  }

  get selectedOption(): SelectOption | null {
    return this.selectedOptions[0] ?? null;
  }

  get hasValue(): boolean {
    if (this.multiple()) {
      return this.selectedOptions.length > 0;
    }

    return this.selectedOption !== null;
  }

  get displayLabel(): string {
    if (this.multiple()) {
      return '';
    }

    return this.selectedOption?.label ?? '';
  }

  get selectedLabels(): string[] {
    return this.selectedOptions.map(option => option.label);
  }

  get canClear(): boolean {
    return this.clearable() && this.hasValue && !this.isDisabled && !this.readonly();
  }

  get availableOptions(): SelectOption[] {
    return this.options();
  }

  get currentHighlightedIndex(): number {
    return this.highlightedIndex();
  }

  // ---------------------------------------------------------------------------
  // Dropdown
  // ---------------------------------------------------------------------------

  toggle(): void {
    if (this.isDisabled || this.readonly()) {
      return;
    }

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.isDisabled || this.readonly()) {
      return;
    }

    this.isOpen.set(true);
    this.setInitialHighlightedOption();
  }

  close(): void {
    if (!this.isOpen()) {
      return;
    }

    this.isOpen.set(false);
    this.highlightedIndex.set(-1);
    this.onTouched();

    if (this.isFormBound) {
      this.control?.markAsTouched();
      this.control?.updateValueAndValidity();
      this.formStateVersion.update(value => value + 1);
    }
  }

  // ---------------------------------------------------------------------------
  // Option selection
  // ---------------------------------------------------------------------------

  selectOption(option: SelectOption, event?: Event): void {
    event?.stopPropagation();

    if (this.isDisabled || this.readonly() || option.disabled) {
      return;
    }

    if (this.multiple()) {
      this.toggleMultipleOption(option);
      return;
    }

    this.setSingleValue(option.value);
    this.close();
  }

  private setSingleValue(value: any): void {
    if (this.isFormBound) {
      this.formValue.set(value);
      this.onChange(value);
    } else {
      this.value.set(value);
    }
  }

  private toggleMultipleOption(option: SelectOption): void {
    const currentValues = Array.isArray(this.currentValue) ? [...this.currentValue] : [];

    const index = currentValues.findIndex(value => areValuesEqual(value, option.value));

    if (index >= 0) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(option.value);
    }

    if (this.isFormBound) {
      this.formValue.set(currentValues);
      this.onChange(currentValues);
    } else {
      this.value.set(currentValues);
    }
  }

  isSelected(option: SelectOption): boolean {
    const currentValue = this.currentValue;

    if (this.multiple()) {
      return Array.isArray(currentValue) && currentValue.some(value => areValuesEqual(value, option.value));
    }

    return areValuesEqual(currentValue, option.value);
  }

  // ---------------------------------------------------------------------------
  // Clear
  // ---------------------------------------------------------------------------

  clear(event?: Event): void {
    event?.stopPropagation();

    if (!this.canClear) {
      return;
    }

    const newValue = this.multiple() ? [] : null;

    if (this.isFormBound) {
      this.formValue.set(newValue);
      this.onChange(newValue);
    } else {
      this.value.set(newValue);
    }

    this.highlightedIndex.set(-1);
  }

  // ---------------------------------------------------------------------------
  // Keyboard
  // ---------------------------------------------------------------------------

  onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled || this.readonly()) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();

        if (!this.isOpen()) {
          this.open();
        } else {
          this.moveHighlight(1);
        }

        break;

      case 'ArrowUp':
        event.preventDefault();

        if (!this.isOpen()) {
          this.open();
        } else {
          this.moveHighlight(-1);
        }

        break;

      case 'Enter':
      case ' ':
        event.preventDefault();

        if (!this.isOpen()) {
          this.open();
        } else {
          this.selectHighlightedOption();
        }

        break;

      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.close();
        }

        break;

      case 'Tab':
        if (this.isOpen()) {
          this.close();
        }

        break;
    }
  }

  private moveHighlight(direction: number): void {
    const options = this.options();

    if (options.length === 0) {
      return;
    }

    let index = this.highlightedIndex();

    for (let i = 0; i < options.length; i++) {
      index += direction;

      if (index < 0) {
        index = options.length - 1;
      }

      if (index >= options.length) {
        index = 0;
      }

      if (!options[index].disabled) {
        this.highlightedIndex.set(index);
        return;
      }
    }
  }

  private selectHighlightedOption(): void {
    const index = this.highlightedIndex();
    const option = this.options()[index];

    if (!option || option.disabled) {
      return;
    }

    this.selectOption(option);
  }

  private setInitialHighlightedOption(): void {
    const options = this.options();

    const selectedIndex = options.findIndex(option => this.isSelected(option) && !option.disabled);

    if (selectedIndex >= 0) {
      this.highlightedIndex.set(selectedIndex);
      return;
    }

    const firstEnabledIndex = options.findIndex(option => !option.disabled);

    this.highlightedIndex.set(firstEnabledIndex);
  }

  // ---------------------------------------------------------------------------
  // External click
  // ---------------------------------------------------------------------------

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isOpen()) {
      return;
    }

    const target = event.target as HTMLElement | null;

    if (!target?.closest('app-select')) {
      this.close();
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private normalizeValue(value: any | any[] | null): any | any[] | null {
    if (this.multiple()) {
      return Array.isArray(value) ? value : [];
    }

    return Array.isArray(value) ? (value[0] ?? null) : value;
  }
}
