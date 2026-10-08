import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AccordionAppearance,
  AccordionComponent,
  AccordionItemComponent,
  AccordionItemContentDirective,
  ButtonComponent,
  CheckboxComponent,
  PaginationMeta,
  RadioButtonComponent,
  RadioButtonOption,
  TableComponent,
  TableConfig
} from 'aesy-components';
import { ComponentApi } from '../../models/component-api.interface';
import { DEMO_PEOPLE } from '../../models/demo-people.const';
import { DemoPerson } from '../../models/demo-person.interface';
import { ApiReferenceComponent } from '../../ui/api-reference/api-reference.component';
import { DocPageComponent } from '../../ui/doc-page/doc-page.component';
import { DocSectionComponent } from '../../ui/doc-section/doc-section.component';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { ACCORDION_API } from './models/accordion-api.const';
import { ACCORDION_APPEARANCE_OPTIONS } from './models/accordion-appearance-options.const';
import { ACCORDION_EVENTS_LOG_MAX_LENGTH } from './models/accordion-events-log-max-length.const';
import { AccordionFaqItem } from './models/accordion-faq-item.interface';
import { ACCORDION_FAQ_ITEMS } from './models/accordion-faq-items.const';
import { ACCORDION_ICON_PATHS } from './models/accordion-icon-paths.const';
import { ACCORDION_ITEM_API } from './models/accordion-item-api.const';
import { ACCORDION_LAZY_TABLE_CONFIG } from './models/accordion-lazy-table-config.const';
import { ACCORDION_SNIPPETS } from './models/accordion-snippets.const';

@Component({
  selector: 'app-accordion-page',
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    AccordionItemContentDirective,
    ApiReferenceComponent,
    ButtonComponent,
    CheckboxComponent,
    DocPageComponent,
    DocSectionComponent,
    RadioButtonComponent,
    TableComponent,
    ValuePreviewComponent
  ],
  templateUrl: './accordion-page.component.html',
  styleUrl: './accordion-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionPageComponent {
  protected readonly ACCORDION_API: ComponentApi = ACCORDION_API;
  protected readonly ACCORDION_ITEM_API: ComponentApi = ACCORDION_ITEM_API;
  protected readonly APPEARANCE_OPTIONS: RadioButtonOption[] = ACCORDION_APPEARANCE_OPTIONS;
  protected readonly FAQ_ITEMS: AccordionFaqItem[] = ACCORDION_FAQ_ITEMS;
  protected readonly ICON_PATHS = ACCORDION_ICON_PATHS;
  protected readonly LAZY_TABLE_CONFIG: TableConfig<DemoPerson> = ACCORDION_LAZY_TABLE_CONFIG;
  protected readonly LAZY_TABLE_PAGINATION: PaginationMeta = { page: 1, rowsPerPageCurrent: 4, total: DEMO_PEOPLE.length, pageShown: true };
  protected readonly PEOPLE: DemoPerson[] = DEMO_PEOPLE;
  protected readonly SHORT_FAQ_ITEMS: AccordionFaqItem[] = ACCORDION_FAQ_ITEMS.slice(0, 2);
  protected readonly SNIPPETS = ACCORDION_SNIPPETS;

  protected readonly eventsLog = signal<string[]>([]);
  protected readonly isOrderDetailsExpanded = signal<boolean>(true);
  protected readonly lazyTableCreatedAt = signal<string | null>(null);
  protected readonly selectedAppearance = signal<AccordionAppearance>('joined');

  protected onOrderDetailsOpened(): void {
    this.addEventToLog('opened · Detalles del pedido');
  }

  private addEventToLog(eventDescription: string): void {
    this.eventsLog.update(eventsLog => [eventDescription, ...eventsLog].slice(0, ACCORDION_EVENTS_LOG_MAX_LENGTH));
  }

  protected onOrderDetailsClosed(): void {
    this.addEventToLog('closed · Detalles del pedido');
  }

  protected onShippingHistoryOpened(): void {
    this.addEventToLog('opened · Historial de envío');
  }

  protected onShippingHistoryClosed(): void {
    this.addEventToLog('closed · Historial de envío');
  }

  protected onLazyTeamItemOpened(): void {
    if (this.lazyTableCreatedAt()) return;
    this.lazyTableCreatedAt.set(`al abrirlo por primera vez, a las ${new Date().toLocaleTimeString('es-ES')}`);
  }
}
