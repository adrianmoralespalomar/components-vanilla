import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, effect, ElementRef, inject, input, linkedSignal, model, output, untracked, viewChild } from '@angular/core';
import { AccordionAppearance } from '../models/accordion-appearance.type';
import { AccordionHeadingLevel } from '../models/accordion-heading-level.type';
import { ACCORDION_TOGGLE_ICON_PATH_DEFAULT } from '../models/accordion-toggle-icon-path-default.const';
import { AccordionTogglePosition } from '../models/accordion-toggle-position.type';
import { AESY_ACCORDION } from '../models/aesy-accordion.token';
import { AccordionItemContentDirective } from './accordion-item-content.directive';

let nextAccordionItemId = 0;

@Component({
  selector: 'aesy-accordion-item',
  imports: [NgTemplateOutlet],
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-appearance]': 'currentAppearance()',
    '[class.aesy-accordion-item-expanded]': 'expanded()'
  }
})
export class AccordionItemComponent {
  // #region INPUTS
  readonly description = input<string>('');
  readonly disabled = input<boolean>(false);
  /** Abierto o cerrado. Permite: [(expanded)]="estaAbierto" */
  readonly expanded = model<boolean>(false);
  /** null = el del acordeón padre o 3 si va suelto. */
  readonly headingLevel = input<AccordionHeadingLevel | null>(null);
  /** null = el del acordeón padre o false si va suelto. */
  readonly hideToggle = input<boolean | null>(null);
  readonly label = input<string>('');
  /** null = el del acordeón padre o el chevron por defecto. */
  readonly toggleIconSvg = input<string | null>(null);
  /** null = el del acordeón padre o 'after' si va suelto. */
  readonly togglePosition = input<AccordionTogglePosition | null>(null);
  // #endregion INPUTS

  // #region OUTPUTS
  /** Se emite al abrirse, no en la carga inicial. */
  readonly opened = output<void>();
  /** Se emite al cerrarse, no en la carga inicial. */
  readonly closed = output<void>();
  // #endregion OUTPUTS

  // #region INTERNAL STATE
  /** Acordeón que lo contiene, si lo hay. */
  readonly accordion = inject(AESY_ACCORDION, { optional: true });

  private readonly generatedId = `aesy-accordion-item-${++nextAccordionItemId}`;
  private readonly headerButton = viewChild.required<ElementRef<HTMLButtonElement>>('headerButton');
  private previousExpanded: boolean | null = null;

  protected readonly headerId = `${this.generatedId}-header`;
  protected readonly lazyContent = contentChild(AccordionItemContentDirective);
  protected readonly panelId = `${this.generatedId}-panel`;

  /** Pasa a true la primera vez que se abre y ya no vuelve a false: el contenido diferido se conserva al cerrar. */
  protected readonly hasBeenExpanded = linkedSignal<boolean, boolean>({
    source: this.expanded,
    computation: (isExpanded, previous) => isExpanded || (previous?.value ?? false)
  });

  protected readonly currentAppearance = computed<AccordionAppearance>(() => this.accordion?.appearance() ?? 'separated');
  protected readonly currentHeadingLevel = computed<AccordionHeadingLevel>(() => this.headingLevel() ?? this.accordion?.headingLevel() ?? 3);
  protected readonly currentToggleIconSvg = computed<string>(() => this.toggleIconSvg() ?? this.accordion?.toggleIconSvg() ?? ACCORDION_TOGGLE_ICON_PATH_DEFAULT);
  protected readonly currentTogglePosition = computed<AccordionTogglePosition>(() => this.togglePosition() ?? this.accordion?.togglePosition() ?? 'after');
  protected readonly isToggleHidden = computed<boolean>(() => this.hideToggle() ?? this.accordion?.hideToggle() ?? false);
  // #endregion INTERNAL STATE

  constructor() {
    effect(() => {
      const isExpanded = this.expanded();
      untracked(() => this.onExpandedChanged(isExpanded));
    });
  }

  private onExpandedChanged(isExpanded: boolean): void {
    if (isExpanded) this.accordion?.onItemExpanded(this);
    if (this.previousExpanded !== null && isExpanded) this.opened.emit();
    if (this.previousExpanded !== null && !isExpanded) this.closed.emit();
    this.previousExpanded = isExpanded;
  }

  // #region PUBLIC METHODS
  open(): void {
    this.expanded.set(true);
  }

  close(): void {
    this.expanded.set(false);
  }

  toggle(): void {
    this.expanded.update(isExpanded => !isExpanded);
  }

  focusHeader(): void {
    this.headerButton().nativeElement.focus();
  }

  isHeaderElement(target: EventTarget | null): boolean {
    return target === this.headerButton().nativeElement;
  }
  // #endregion PUBLIC METHODS

  protected onHeaderButtonClicked(): void {
    this.toggle();
  }
}
