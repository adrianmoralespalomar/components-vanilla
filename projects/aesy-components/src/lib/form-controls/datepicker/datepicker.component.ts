import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Injector, TemplateRef, ViewChild, ViewContainerRef, forwardRef, inject, input, model, signal } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';

import { TemplatePortal } from '@angular/cdk/portal';

import { Subscription } from 'rxjs';

import { getValidationErrorMessage } from '../shared/utils/get-validation-error-message';
import { hasRequiredValidator } from '../shared/utils/has-required-validator';

let nextDatepickerId = 0;

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [],
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
  // #region INPUTS

  readonly calendarWidth = input<'auto' | 'full'>('auto');
  /** Muestra un botón para limpiar la fecha seleccionada. */
  readonly clearable = input<boolean>(false);

  readonly disabled = input<boolean>(false);

  /** Decide en qué formato se emite el valor cuando el usuario selecciona una fecha. */
  readonly emitType = input<'date' | 'string'>('date');

  /** Mensaje explícito que sobrescribe los mensajes automáticos. */
  readonly errorMessage = input<string | null>(null);

  /** Formato de visualización y parseo. Ejemplos: DD/MM/YYYY, YYYY-MM-DD, MM/DD/YYYY */
  readonly format = input<string>('DD/MM/YYYY');

  readonly helpText = input<string | null>(null);

  /** ID opcional proporcionado por el consumidor. */
  readonly id = input<string | null>(null);

  /** Permite mostrar un estado de error cuando se utiliza sin Angular Forms. */
  readonly invalid = input<boolean>(false);

  readonly label = input<string>('');

  readonly name = input<string | null>(null);

  readonly placeholder = input<string>('Selecciona una fecha');

  readonly readonly = input<boolean>(false);

  /** null = detectar automáticamente desde FormControl. */
  readonly required = input<boolean | null>(null);
  readonly textAlign = input<'left' | 'center' | 'right'>('left');

  /** Valor para uso sin Angular Forms. */
  readonly value = model<Date | string | null>(null);

  // #endregion INPUTS

  // #region INTERNAL STATE

  /** Mes/año que estamos visualizando. */
  readonly currentDate = signal<Date>(new Date());

  private readonly destroyRef = inject(DestroyRef);

  private readonly formDisabled = signal<boolean>(false);

  /** Fuerza la actualización visual cuando cambia el estado interno del FormControl. */
  private readonly formStateVersion = signal(0);

  private readonly formValue = signal<Date | null>(null);

  private readonly generatedId = `app-datepicker-${nextDatepickerId++}`;

  private readonly injector = inject(Injector);

  readonly isOpen = signal(false);

  private ngControl: NgControl | null = null;

  /** Vista actual del datepicker. */
  readonly viewMode = signal<'days' | 'months' | 'years'>('days');

  // #endregion INTERNAL STATE

  // #region CDK OVERLAY

  private readonly overlay = inject(Overlay);

  private readonly viewContainerRef = inject(ViewContainerRef);

  @ViewChild('calendarTrigger', { static: true })
  private calendarTrigger!: ElementRef<HTMLButtonElement>;

  @ViewChild('calendarInputWrapper', { static: true })
  private calendarInputWrapper!: ElementRef<HTMLElement>;

  @ViewChild('calendarTemplate')
  private calendarTemplate!: TemplateRef<unknown>;

  private overlayRef: OverlayRef | null = null;

  private outsideClickSubscription: Subscription | null = null;

  private readonly overlayPositions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 4
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -4
    }
  ];

  // #endregion CDK OVERLAY

  // #region CONTROL VALUE ACCESSOR

  private onChange: (value: Date | string | null) => void = () => {};

  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null, { self: true });

    const control = this.control;

    if (!control) {
      return;
    }

    control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.formStateVersion.update(value => value + 1);
    });
  }

  ngOnDestroy(): void {
    this.closeOverlay();
  }

  writeValue(value: Date | string | null): void {
    const normalizedValue = this.normalizeValue(value);

    this.formValue.set(normalizedValue);

    if (normalizedValue) {
      this.currentDate.set(new Date(normalizedValue));
    }

    this.formStateVersion.update(value => value + 1);
  }

  registerOnChange(fn: (value: Date | string | null) => void): void {
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

  // #endregion CONTROL VALUE ACCESSOR

  // #region GETTERS

  get control() {
    return this.ngControl?.control ?? null;
  }

  get isFormBound(): boolean {
    return !!this.control;
  }

  get datepickerId(): string {
    return this.id() ? `${this.id()}-aesy-datepicker` : this.generatedId;
  }

  get calendarId(): string {
    return `${this.datepickerId}-aesy-calendar`;
  }

  get currentValue(): Date | null {
    return this.isFormBound ? this.formValue() : this.normalizeValue(this.value());
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

  // #endregion GETTERS

  // #region DATEPICKER

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
    if (this.isDisabled || this.readonly() || this.isOpen()) {
      return;
    }

    const currentValue = this.currentValue;

    if (currentValue) {
      this.currentDate.set(new Date(currentValue));
    }

    this.viewMode.set('days');

    this.openOverlay();

    this.isOpen.set(true);
  }

  close(): void {
    if (!this.isOpen()) {
      return;
    }

    this.closeOverlay();

    this.isOpen.set(false);

    this.onTouched();

    if (this.isFormBound) {
      this.control?.markAsTouched();
      this.control?.updateValueAndValidity();

      this.formStateVersion.update(value => value + 1);
    }
  }

  // ---------------------------------------------------------------------------
  // CDK Overlay
  // ---------------------------------------------------------------------------

  private openOverlay(): void {
    // 1. Elegimos dinámicamente de dónde "cuelga" el overlay
    const origin = this.calendarWidth() === 'full' ? this.calendarInputWrapper.nativeElement : this.calendarTrigger.nativeElement;

    const positionStrategy = this.overlay.position().flexibleConnectedTo(origin).withFlexibleDimensions(false).withPush(true).withViewportMargin(8).withPositions(this.overlayPositions);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      disposeOnNavigation: true
    });

    if (this.calendarWidth() === 'full') {
      const width = this.calendarInputWrapper.nativeElement.getBoundingClientRect().width;
      this.overlayRef.updateSize({
        width
      });
    }

    const portal = new TemplatePortal(this.calendarTemplate, this.viewContainerRef);

    this.overlayRef.attach(portal);

    /*
     * Cierra cuando se hace click fuera del calendario.
     *
     * El botón que abre el calendario está fuera del overlay,
     * por eso comprobamos que el click no provenga del trigger.
     */
    this.outsideClickSubscription = this.overlayRef.outsidePointerEvents().subscribe(event => {
      const target = event.target as Node | null;

      if (target && origin.contains(target)) {
        return;
      }

      this.close();
    });
  }

  private closeOverlay(): void {
    this.outsideClickSubscription?.unsubscribe();
    this.outsideClickSubscription = null;

    this.overlayRef?.dispose();
    this.overlayRef = null;
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

  private setValue(date: Date | null): void {
    let outputValue: Date | string | null = date;

    if (date && this.emitType() === 'string') {
      outputValue = this.formatDate(date);
    }

    if (this.isFormBound) {
      this.formValue.set(date);
      this.onChange(outputValue);
    } else {
      this.value.set(outputValue);
    }
  }

  // ---------------------------------------------------------------------------
  // Clear
  // ---------------------------------------------------------------------------

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
  // Keyboard & Input Events
  // ---------------------------------------------------------------------------

  onBlur(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;

    const rawValue = input.value.trim();

    if (!rawValue) {
      this.setValue(null);
    } else {
      const parsedDate = this.parseDateString(rawValue);

      if (parsedDate) {
        this.setValue(parsedDate);

        this.currentDate.set(new Date(parsedDate));
      } else {
        this.setValue(null);
      }
    }

    input.value = this.displayValue;

    this.onTouched();

    if (this.isFormBound) {
      this.control?.markAsTouched();
      this.control?.updateValueAndValidity();

      this.formStateVersion.update(value => value + 1);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled || this.readonly()) {
      return;
    }

    switch (event.key) {
      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.close();
        }

        break;

      case 'ArrowDown':
        if (!this.isOpen()) {
          event.preventDefault();
          this.open();
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
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * Parsea strings como:
   * 15/04/2026
   * 15-04-2026
   */
  private parseDateString(value: string): Date | null {
    const fmt = this.format().toUpperCase();

    const separatorMatch = fmt.match(/[^A-Z0-9]/);

    if (!separatorMatch) {
      return null;
    }

    const separator = separatorMatch[0];

    const fmtParts = fmt.split(separator);

    const valueParts = value.split(separator);

    if (fmtParts.length !== 3 || valueParts.length !== 3) {
      return null;
    }

    let day = 0;
    let month = 0;
    let year = 0;

    for (let i = 0; i < 3; i++) {
      const formatToken = fmtParts[i];

      const rawVal = valueParts[i];

      const numVal = parseInt(rawVal, 10);

      if (isNaN(numVal)) {
        return null;
      }

      if (formatToken === 'YYYY') {
        if (rawVal.length !== 4) {
          return null;
        }

        year = numVal;
      } else if (formatToken === 'MM') {
        month = numVal - 1;
      } else if (formatToken === 'DD') {
        day = numVal;
      }
    }

    const date = new Date(year, month, day);

    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
      return date;
    }

    return null;
  }

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

    const year = String(date.getFullYear());

    return this.format().toUpperCase().replace('YYYY', year).replace('MM', month).replace('DD', day);
  }

  // #endregion DATEPICKER
}
