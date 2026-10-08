import { ChangeDetectionStrategy, Component, computed, contentChildren, forwardRef, input } from '@angular/core';
import { AccordionItemComponent } from './accordion-item/accordion-item.component';
import { AccordionAppearance } from './models/accordion-appearance.type';
import { AccordionHeadingLevel } from './models/accordion-heading-level.type';
import { AccordionTogglePosition } from './models/accordion-toggle-position.type';
import { AESY_ACCORDION } from './models/aesy-accordion.token';

@Component({
  selector: 'aesy-accordion',
  template: '<ng-content />',
  styleUrl: './accordion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: AESY_ACCORDION, useExisting: forwardRef(() => AccordionComponent) }],
  host: {
    '[attr.data-appearance]': 'appearance()',
    '(keydown)': 'onHostKeydown($event)'
  }
})
export class AccordionComponent {
  // #region INPUTS
  readonly appearance = input<AccordionAppearance>('joined');
  /** Nivel de encabezado (`aria-level`) de las cabeceras. Elige el que encaje en la jerarquía de tu página. */
  readonly headingLevel = input<AccordionHeadingLevel>(3);
  readonly hideToggle = input<boolean>(false);
  /** Permite tener varios ítems abiertos a la vez. */
  readonly multi = input<boolean>(false);
  /** Path SVG (viewBox 20×20) del icono de abrir/cerrar. null = chevron por defecto. */
  readonly toggleIconSvg = input<string | null>(null);
  readonly togglePosition = input<AccordionTogglePosition>('after');
  // #endregion INPUTS

  // #region INTERNAL STATE
  private readonly descendantItems = contentChildren(AccordionItemComponent, { descendants: true });
  /** Solo los ítems de este acordeón, no los de acordeones anidados. */
  private readonly ownItems = computed<readonly AccordionItemComponent[]>(() => this.descendantItems().filter(item => item.accordion === this));
  // #endregion INTERNAL STATE

  // #region PUBLIC METHODS
  /** Abre todos los ítems habilitados. Solo funciona con `multi`. */
  openAll(): void {
    if (!this.multi()) return;
    for (const item of this.ownItems()) if (!item.disabled()) item.open();
  }

  closeAll(): void {
    for (const item of this.ownItems()) item.close();
  }

  /** Lo llama cada ítem al abrirse: sin `multi`, cierra el resto. */
  onItemExpanded(expandedItem: AccordionItemComponent): void {
    if (this.multi()) return;
    for (const item of this.ownItems()) if (item !== expandedItem && item.expanded()) item.close();
  }
  // #endregion PUBLIC METHODS

  // #region KEYBOARD NAVIGATION
  protected onHostKeydown(event: KeyboardEvent): void {
    if (event.defaultPrevented) return;
    const enabledItems = this.ownItems().filter(item => !item.disabled());
    const focusedItemIndex = enabledItems.findIndex(item => item.isHeaderElement(event.target));
    if (focusedItemIndex === -1) return;
    const nextFocusedItemIndex = this.getNextFocusedItemIndex(event.key, focusedItemIndex, enabledItems.length);
    if (nextFocusedItemIndex === null) return;
    event.preventDefault();
    enabledItems[nextFocusedItemIndex].focusHeader();
  }

  private getNextFocusedItemIndex(key: string, focusedItemIndex: number, enabledItemsCount: number): number | null {
    switch (key) {
      case 'ArrowDown':
        return (focusedItemIndex + 1) % enabledItemsCount;
      case 'ArrowUp':
        return (focusedItemIndex - 1 + enabledItemsCount) % enabledItemsCount;
      case 'Home':
        return 0;
      case 'End':
        return enabledItemsCount - 1;
      default:
        return null;
    }
  }
  // #endregion KEYBOARD NAVIGATION
}
