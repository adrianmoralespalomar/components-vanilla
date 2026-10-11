import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  AESY_ICONS,
  ButtonComponent,
  CheckboxComponent,
  InputTextComponent,
  RadioButtonComponent,
  RadioButtonOption,
  SelectComponent,
  SelectOption,
  SidebarCollapsible,
  SidebarComponent,
  SidebarEntry,
  SidebarGroupComponent,
  SidebarItem,
  SidebarItemComponent,
  SidebarLayoutComponent,
  SidebarMainComponent,
  SidebarSide,
  SidebarTriggerDirective,
  SidebarVariant
} from 'aesy-components';
import { ComponentApi } from '../../models/component-api.interface';
import { ApiReferenceComponent } from '../../ui/api-reference/api-reference.component';
import { DocPageComponent } from '../../ui/doc-page/doc-page.component';
import { DocSectionComponent } from '../../ui/doc-section/doc-section.component';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { SIDEBAR_API } from './models/sidebar-api.const';
import { SIDEBAR_DEMO_ENTRIES } from './models/sidebar-demo-entries.const';
import { SIDEBAR_GROUP_API } from './models/sidebar-group-api.const';
import { SIDEBAR_ITEM_API } from './models/sidebar-item-api.const';
import { SIDEBAR_NAVIGATION_ENTRIES } from './models/sidebar-navigation-entries.const';
import { SIDEBAR_NESTED_ENTRIES } from './models/sidebar-nested-entries.const';
import { SIDEBAR_PLAYGROUND_OPTIONS } from './models/sidebar-playground-options.const';
import { SIDEBAR_SNIPPETS } from './models/sidebar-snippets.const';
import { SIDEBAR_TRIGGER_API } from './models/sidebar-trigger-api.const';

@Component({
  selector: 'app-sidebar-page',
  imports: [
    ApiReferenceComponent,
    ButtonComponent,
    CheckboxComponent,
    DocPageComponent,
    DocSectionComponent,
    InputTextComponent,
    RadioButtonComponent,
    SelectComponent,
    SidebarComponent,
    SidebarGroupComponent,
    SidebarItemComponent,
    SidebarLayoutComponent,
    SidebarMainComponent,
    SidebarTriggerDirective,
    ValuePreviewComponent
  ],
  templateUrl: './sidebar-page.component.html',
  styleUrl: './sidebar-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarPageComponent {
  protected readonly COLLAPSIBLE_OPTIONS: SelectOption[] = SIDEBAR_PLAYGROUND_OPTIONS.collapsible;
  protected readonly ICONS = AESY_ICONS;
  protected readonly NAVIGATION_ENTRIES: SidebarEntry[] = SIDEBAR_NAVIGATION_ENTRIES;
  protected readonly SIDE_OPTIONS: RadioButtonOption[] = SIDEBAR_PLAYGROUND_OPTIONS.side;
  protected readonly SIDEBAR_API: ComponentApi = SIDEBAR_API;
  protected readonly SIDEBAR_GROUP_API: ComponentApi = SIDEBAR_GROUP_API;
  protected readonly SIDEBAR_ITEM_API: ComponentApi = SIDEBAR_ITEM_API;
  protected readonly SIDEBAR_TRIGGER_API: ComponentApi = SIDEBAR_TRIGGER_API;
  protected readonly SNIPPETS = SIDEBAR_SNIPPETS;
  protected readonly VARIANT_OPTIONS: SelectOption[] = SIDEBAR_PLAYGROUND_OPTIONS.variant;

  protected readonly basicActiveItem = signal<SidebarItem>({ id: 'inicio', label: 'Inicio' });
  protected readonly basicEntries = computed<SidebarEntry[]>(() => this.markActiveEntries(SIDEBAR_DEMO_ENTRIES, this.basicActiveItem().id));
  protected readonly isControlledSidebarOpen = signal<boolean>(true);
  protected readonly isNotificationsPanelOpen = signal<boolean>(false);
  protected readonly manualLastClickedLabel = signal<string>('ninguno todavía');
  protected readonly nestedActiveItem = signal<SidebarItem>({ id: 'informe-t1', label: 'Informe T1' });
  protected readonly nestedEntries = computed<SidebarEntry[]>(() => this.markActiveEntries(SIDEBAR_NESTED_ENTRIES, this.nestedActiveItem().id));
  protected readonly playgroundActiveItem = signal<SidebarItem>({ id: 'inicio', label: 'Inicio' });
  protected readonly playgroundBackdrop = signal<boolean>(false);
  protected readonly playgroundCollapsible = signal<SidebarCollapsible>('icon');
  protected readonly playgroundEntries = computed<SidebarEntry[]>(() => this.markActiveEntries(SIDEBAR_DEMO_ENTRIES, this.playgroundActiveItem().id));
  protected readonly playgroundOpenOnHover = signal<boolean>(false);
  protected readonly playgroundOverlay = signal<boolean>(false);
  protected readonly playgroundRail = signal<boolean>(true);
  protected readonly playgroundSide = signal<SidebarSide>('left');
  protected readonly playgroundVariant = signal<SidebarVariant>('inset');
  protected readonly responsiveActiveItem = signal<SidebarItem>({ id: 'inicio', label: 'Inicio' });
  protected readonly responsiveEntries = computed<SidebarEntry[]>(() => this.markActiveEntries(SIDEBAR_DEMO_ENTRIES, this.responsiveActiveItem().id));

  /** Las demos marcan como activo el último ítem pulsado (en una app real lo haría la ruta con `link`). */
  private markActiveEntries(entries: readonly SidebarEntry[], activeItemId: string | undefined): SidebarEntry[] {
    return entries.map(entry =>
      'items' in entry ? { ...entry, items: entry.items.map(item => this.markActiveItem(item, activeItemId)) } : this.markActiveItem(entry, activeItemId)
    );
  }

  private markActiveItem(item: SidebarItem, activeItemId: string | undefined): SidebarItem {
    return { ...item, active: item.id === activeItemId, children: item.children?.map(childItem => this.markActiveItem(childItem, activeItemId)) };
  }

  protected onBasicItemClicked(item: SidebarItem): void {
    this.basicActiveItem.set(item);
  }

  protected onPlaygroundItemClicked(item: SidebarItem): void {
    this.playgroundActiveItem.set(item);
  }

  protected onManualItemClicked(label: string): void {
    this.manualLastClickedLabel.set(label);
  }

  protected onNestedItemClicked(item: SidebarItem): void {
    this.nestedActiveItem.set(item);
  }

  protected onResponsiveItemClicked(item: SidebarItem): void {
    this.responsiveActiveItem.set(item);
  }
}
