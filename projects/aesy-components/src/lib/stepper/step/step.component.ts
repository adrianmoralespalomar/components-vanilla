import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, effect, input, InputSignal, signal, TemplateRef, viewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { StepContentDirective } from '../directives/step-content.directive';

/**
 * Un paso de `aesy-stepper`. No pinta nada por sí mismo: expone su etiqueta y su contenido como plantillas
 * y el stepper las coloca donde corresponde según la orientación.
 */
@Component({
  selector: 'aesy-step',
  imports: [NgTemplateOutlet],
  templateUrl: './step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepComponent {
  // #region INPUTS
  /** null = se calcula: con stepControl, válido y visitado; sin él, visitado. */
  readonly completed = input<boolean | null>(null);
  /** false = una vez completado no se puede volver a él. */
  readonly editable = input<boolean>(true);
  /** Texto que se muestra bajo la etiqueta cuando el paso tiene error. */
  readonly errorMessage = input<string>('');
  readonly label = input<string>('');
  /** En modo lineal, un paso opcional no bloquea el avance. */
  readonly optional = input<boolean>(false);
  /** Formulario del paso. En modo lineal no se puede avanzar mientras sea inválido. */
  // Tipo explícito: inferido, TypeScript lo publica como AbstractControl<any, any, any>, que Angular 20.0 no admite
  readonly stepControl: InputSignal<AbstractControl | null> = input<AbstractControl | null>(null);
  // #endregion INPUTS

  // #region INTERNAL STATE
  /** Plantillas que coloca el stepper. */
  readonly contentTemplate = viewChild<TemplateRef<unknown>>('contentTemplate');
  readonly labelTemplate = viewChild<TemplateRef<unknown>>('labelTemplate');

  /** Pasa a true al salir del paso o al intentar avanzar desde él. */
  readonly interacted = signal<boolean>(false);

  /** Fuerza el recálculo cuando cambia el estado del stepControl (sus valid/touched no son signals). */
  private readonly stepControlStateVersion = signal<number>(0);
  protected readonly hasBeenSelected = signal<boolean>(false);

  protected readonly lazyContent = contentChild(StepContentDirective);

  readonly isStepControlValid = computed<boolean>(() => {
    this.stepControlStateVersion();
    return this.stepControl()?.valid ?? true;
  });
  readonly isCompleted = computed<boolean>(() => this.completed() ?? (this.interacted() && this.isStepControlValid()));
  readonly hasError = computed<boolean>(() => this.interacted() && !this.isStepControlValid());
  // #endregion INTERNAL STATE

  constructor() {
    effect(onCleanup => {
      const stepControl = this.stepControl();
      if (!stepControl) return;
      const stepControlEventsSubscription = stepControl.events.subscribe(() => this.stepControlStateVersion.update(version => version + 1));
      onCleanup(() => stepControlEventsSubscription.unsubscribe());
    });
  }

  // #region PUBLIC METHODS
  markAsInteracted(): void {
    this.interacted.set(true);
  }

  /** Lo llama el stepper al seleccionar el paso: a partir de entonces se crea su contenido diferido. */
  markAsSelected(): void {
    this.hasBeenSelected.set(true);
  }

  reset(): void {
    this.interacted.set(false);
    this.stepControl()?.reset();
  }
  // #endregion PUBLIC METHODS
}
