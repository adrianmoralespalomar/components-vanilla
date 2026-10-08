import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChildren, effect, ElementRef, forwardRef, input, model, output, untracked, viewChildren } from '@angular/core';
import { AESY_STEPPER } from './models/aesy-stepper.token';
import { STEPPER_COMPLETED_ICON_PATH_DEFAULT } from './models/stepper-completed-icon-path-default.const';
import { STEPPER_ERROR_ICON_PATH_DEFAULT } from './models/stepper-error-icon-path-default.const';
import { StepperLabelPosition } from './models/stepper-label-position.type';
import { StepperOrientation } from './models/stepper-orientation.type';
import { StepperSelectionChange } from './models/stepper-selection-change.interface';
import { StepComponent } from './step/step.component';

let nextStepperId = 0;

@Component({
  selector: 'aesy-stepper',
  imports: [NgTemplateOutlet],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: AESY_STEPPER, useExisting: forwardRef(() => StepperComponent) }],
  host: { '[attr.data-orientation]': 'orientation()' }
})
export class StepperComponent {
  // #region INPUTS
  /** Path SVG (viewBox 20×20) del icono de paso completado. null = check. */
  readonly completedIconSvg = input<string | null>(null);
  /** Path SVG (viewBox 20×20) del icono de paso con error. null = exclamación. */
  readonly errorIconSvg = input<string | null>(null);
  /** Solo en horizontal. */
  readonly labelPosition = input<StepperLabelPosition>('end');
  /** Solo deja avanzar si los pasos anteriores están completados (o son opcionales). */
  readonly linear = input<boolean>(false);
  readonly optionalLabel = input<string>('Opcional');
  readonly orientation = input<StepperOrientation>('horizontal');
  /** Paso actual. Permite: [(selectedIndex)]="pasoActual" */
  readonly selectedIndex = model<number>(0);
  // #endregion INPUTS

  // #region OUTPUTS
  /** Se emite en cada cambio de paso, no en la carga inicial. */
  readonly selectionChange = output<StepperSelectionChange>();
  // #endregion OUTPUTS

  // #region INTERNAL STATE
  readonly steps = contentChildren(StepComponent);

  private readonly generatedId = `aesy-stepper-${++nextStepperId}`;
  private readonly headerButtons = viewChildren<ElementRef<HTMLButtonElement>>('headerButton');
  private previousSelectedIndex: number | null = null;

  protected readonly currentCompletedIconSvg = computed<string>(() => this.completedIconSvg() ?? STEPPER_COMPLETED_ICON_PATH_DEFAULT);
  protected readonly currentErrorIconSvg = computed<string>(() => this.errorIconSvg() ?? STEPPER_ERROR_ICON_PATH_DEFAULT);
  // #endregion INTERNAL STATE

  constructor() {
    effect(() => {
      const selectedIndex = this.selectedIndex();
      const steps = this.steps();
      untracked(() => this.onSelectedIndexChanged(selectedIndex, steps));
    });
  }

  private onSelectedIndexChanged(selectedIndex: number, steps: readonly StepComponent[]): void {
    const previousSelectedIndex = this.previousSelectedIndex;
    this.previousSelectedIndex = selectedIndex;
    steps[selectedIndex]?.markAsSelected();
    if (previousSelectedIndex === null || previousSelectedIndex === selectedIndex) return;
    steps[previousSelectedIndex]?.markAsInteracted();
    this.selectionChange.emit({ previousIndex: previousSelectedIndex, selectedIndex });
  }

  // #region PUBLIC METHODS
  next(): void {
    this.goToStep(this.selectedIndex() + 1);
  }

  previous(): void {
    this.goToStep(this.selectedIndex() - 1);
  }

  /** Va al paso indicado si se puede: en modo lineal, al intentar avanzar marca el paso actual (y su formulario) para mostrar sus errores. */
  goToStep(targetIndex: number): void {
    const selectedIndex = this.selectedIndex();
    const selectedStep = this.steps()[selectedIndex];
    if (targetIndex === selectedIndex || !this.steps()[targetIndex]) return;
    if (this.linear() && targetIndex > selectedIndex) this.markStepAsLeaveAttempted(selectedStep);
    if (!this.canSelectStep(targetIndex)) return;
    this.selectedIndex.set(targetIndex);
  }

  private markStepAsLeaveAttempted(step: StepComponent | undefined): void {
    step?.markAsInteracted();
    step?.stepControl()?.markAllAsTouched();
  }

  /** Vuelve al primer paso y reinicia el estado y el formulario de todos. */
  reset(): void {
    const previousIndex = this.selectedIndex();
    this.previousSelectedIndex = 0;
    this.selectedIndex.set(0);
    for (const step of this.steps()) step.reset();
    if (previousIndex !== 0) this.selectionChange.emit({ previousIndex, selectedIndex: 0 });
  }
  // #endregion PUBLIC METHODS

  protected getHeaderId(index: number): string {
    return `${this.generatedId}-header-${index}`;
  }

  protected getPanelId(index: number): string {
    return `${this.generatedId}-panel-${index}`;
  }

  protected canSelectStep(targetIndex: number): boolean {
    const steps = this.steps();
    const selectedIndex = this.selectedIndex();
    const targetStep = steps[targetIndex];
    if (targetIndex === selectedIndex) return true;
    if (targetStep.isCompleted() && !targetStep.editable()) return false;
    if (!this.linear() || targetIndex < selectedIndex) return true;
    return steps.slice(0, targetIndex).every((step, index) => step.optional() || (index === selectedIndex ? (step.completed() ?? step.isStepControlValid()) : step.isCompleted()));
  }

  protected onHeaderButtonClicked(index: number): void {
    this.goToStep(index);
  }

  protected onHeaderKeydown(event: KeyboardEvent, focusedIndex: number): void {
    const nextFocusedIndex = this.getNextFocusedHeaderIndex(event.key, focusedIndex);
    if (nextFocusedIndex === null) return;
    event.preventDefault();
    this.headerButtons()[nextFocusedIndex]?.nativeElement.focus();
  }

  private getNextFocusedHeaderIndex(key: string, focusedIndex: number): number | null {
    const stepsCount = this.steps().length;
    const isHorizontal = this.orientation() === 'horizontal';
    if (key === (isHorizontal ? 'ArrowRight' : 'ArrowDown')) return (focusedIndex + 1) % stepsCount;
    if (key === (isHorizontal ? 'ArrowLeft' : 'ArrowUp')) return (focusedIndex - 1 + stepsCount) % stepsCount;
    if (key === 'Home') return 0;
    if (key === 'End') return stepsCount - 1;
    return null;
  }
}
