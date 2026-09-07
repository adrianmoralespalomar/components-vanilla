import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, Injector, forwardRef, inject, input, model, signal } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

import { getValidationErrorMessage } from '../shared/utils/get-validation-error-message';
import { hasRequiredValidator } from '../shared/utils/has-required-validator';

let nextDatepickerId = 0;

type DatepickerSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent implements ControlValueAccessor {
  // ---------------------------------------------------------------------------
  // Inputs
  // ---------------------------------------------------------------------------

  readonly label = input<string>('');

  readonly placeholder = input<string>('Selecciona una fecha');

  /**
   * Muestra un botón para limpiar la fecha seleccionada.
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

  readonly size = input<DatepickerSize>('medium');

  /**
   * ID opcional proporcionado por el consumidor.
   */
  readonly id = input<string | null>(null);

  readonly name = input<string | null>(null);

  /**
   * Valor para uso sin Angular Forms.
   *
   * [(value)]="selectedDate"
   */
  readonly value = model<Date | null>(null);

  // ---------------------------------------------------------------------------
  // Internal state
  // ---------------------------------------------------------------------------

  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  private ngControl: NgControl | null = null;

  private readonly formValue = signal<Date | null>(null);

  private readonly formDisabled = signal<boolean>(false);

  /**
   * Fuerza la actualización visual cuando cambia el estado
   * interno del FormControl.
   */
  private readonly formStateVersion = signal(0);

  private readonly generatedId = `app-datepicker-${nextDatepickerId++}`;

  readonly isOpen = signal(false);

  /**
   * Vista actual del datepicker.
   */
  readonly viewMode = signal<'days' | 'months' | 'years'>('days');

  /**
   * Mes/año que estamos visualizando.
   */
  readonly currentDate = signal<Date>(new Date());

  // ---------------------------------------------------------------------------
  // ControlValueAccessor
  // ---------------------------------------------------------------------------

  private onChange: (value: Date | null) => void = () => {};

  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null, {
      self: true
    });

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

  writeValue(value: Date | string | null): void {
    const normalizedValue = this.normalizeValue(value);

    this.formValue.set(normalizedValue);

    if (normalizedValue) {
      this.currentDate.set(new Date(normalizedValue));
    }

    this.formStateVersion.update(value => value + 1);
  }

  registerOnChange(fn: (value: Date | null) => void): void {
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

  get datepickerId(): string {
    return this.id() ? `${this.id()}-datepicker` : this.generatedId;
  }

  get calendarId(): string {
    return `${this.datepickerId}-calendar`;
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
    return `datepicker-${this.size()}`;
  }

  get currentValue(): Date | null {
    return this.isFormBound ? this.formValue() : this.value();
  }

  get hasValue(): boolean {
    return this.currentValue !== null;
  }

  get canClear(): boolean {
    return this.clearable() && this.hasValue && !this.isDisabled && !this.readonly();
  }

  get displayValue(): string {
    const date = this.currentValue;

    if (!date) {
      return '';
    }

    return this.formatDate(date);
  }

  // ---------------------------------------------------------------------------
  // Datepicker
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

    const currentValue = this.currentValue;

    if (currentValue) {
      this.currentDate.set(new Date(currentValue));
    }

    this.viewMode.set('days');
    this.isOpen.set(true);
  }

  close(): void {
    if (!this.isOpen()) {
      return;
    }

    this.isOpen.set(false);

    this.onTouched();

    if (this.isFormBound) {
      this.control?.markAsTouched();
      this.control?.updateValueAndValidity();

      this.formStateVersion.update(value => value + 1);
    }
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  previous(): void {
    const mode = this.viewMode();

    if (mode === 'days') {
      this.changeMonth(-1);
      return;
    }

    if (mode === 'months') {
      this.changeYear(-1);
      return;
    }

    this.changeYear(-12);
  }

  next(): void {
    const mode = this.viewMode();

    if (mode === 'days') {
      this.changeMonth(1);
      return;
    }

    if (mode === 'months') {
      this.changeYear(1);
      return;
    }

    this.changeYear(12);
  }

  private changeMonth(amount: number): void {
    const date = new Date(this.currentDate());

    date.setMonth(date.getMonth() + amount);

    this.currentDate.set(date);
  }

  private changeYear(amount: number): void {
    const date = new Date(this.currentDate());

    date.setFullYear(date.getFullYear() + amount);

    this.currentDate.set(date);
  }

  // ---------------------------------------------------------------------------
  // View
  // ---------------------------------------------------------------------------

  changeView(): void {
    const mode = this.viewMode();

    if (mode === 'days') {
      this.viewMode.set('months');
      return;
    }

    if (mode === 'months') {
      this.viewMode.set('years');
      return;
    }

    this.viewMode.set('days');
  }

  // ---------------------------------------------------------------------------
  // Date selection
  // ---------------------------------------------------------------------------

  selectDate(date: Date): void {
    if (this.isDisabled || this.readonly()) {
      return;
    }

    const newValue = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    this.setValue(newValue);

    this.close();
  }

  private setValue(value: Date | null): void {
    if (this.isFormBound) {
      this.formValue.set(value);
      this.onChange(value);
    } else {
      this.value.set(value);
    }
  }

  clear(event?: Event): void {
    event?.stopPropagation();

    if (!this.canClear) {
      return;
    }

    this.setValue(null);

    this.onTouched();

    this.formStateVersion.update(value => value + 1);
  }

  // ---------------------------------------------------------------------------
  // Month selection
  // ---------------------------------------------------------------------------

  selectMonth(month: number): void {
    const date = new Date(this.currentDate());

    date.setMonth(month);

    this.currentDate.set(date);

    this.viewMode.set('days');
  }

  // ---------------------------------------------------------------------------
  // Year selection
  // ---------------------------------------------------------------------------

  selectYear(year: number): void {
    const date = new Date(this.currentDate());

    date.setFullYear(year);

    this.currentDate.set(date);

    this.viewMode.set('months');
  }

  // ---------------------------------------------------------------------------
  // Calendar helpers
  // ---------------------------------------------------------------------------

  get monthNames(): string[] {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  }

  get dayNames(): string[] {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }

  get calendarDays(): Date[] {
    const current = this.currentDate();

    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const days: Date[] = [];

    // Previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, daysInPreviousMonth - i));
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Next month
    const remaining = days.length % 7 === 0 ? 0 : 7 - (days.length % 7);

    for (let day = 1; day <= remaining; day++) {
      days.push(new Date(year, month + 1, day));
    }

    return days;
  }

  get years(): number[] {
    const currentYear = this.currentDate().getFullYear();

    const startYear = currentYear - (currentYear % 12) - 1;

    return Array.from({ length: 16 }, (_, index) => startYear + index);
  }

  isToday(date: Date): boolean {
    const today = new Date();

    return date.toDateString() === today.toDateString();
  }

  isCurrentMonth(date: Date): boolean {
    const current = this.currentDate();

    return date.getMonth() === current.getMonth() && date.getFullYear() === current.getFullYear();
  }

  isSelected(date: Date): boolean {
    const selected = this.currentValue;

    if (!selected) {
      return false;
    }

    return date.toDateString() === selected.toDateString();
  }

  isCurrentMonthSelected(month: number): boolean {
    return this.currentDate().getMonth() === month;
  }

  isCurrentYearSelected(year: number): boolean {
    return this.currentDate().getFullYear() === year;
  }

  // ---------------------------------------------------------------------------
  // Keyboard
  // ---------------------------------------------------------------------------

  onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled || this.readonly()) {
      return;
    }

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();

        this.toggle();
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

  // ---------------------------------------------------------------------------
  // External click
  // ---------------------------------------------------------------------------

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isOpen()) {
      return;
    }

    const target = event.target as HTMLElement | null;

    if (!target?.closest('app-datepicker')) {
      this.close();
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private normalizeValue(value: Date | string | null): Date | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }

    const parsed = new Date(value);

    return isNaN(parsed.getTime()) ? null : new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}
