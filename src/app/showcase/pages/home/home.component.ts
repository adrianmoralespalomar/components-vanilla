import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AccordionComponent,
  AccordionItemComponent,
  AESY_ICON_SIDEBAR,
  ButtonComponent,
  CheckboxComponent,
  DatepickerComponent,
  DialogActionsComponent,
  DialogComponent,
  AesyIconName,
  IconComponent,
  InputNumberComponent,
  InputTextComponent,
  PaginationMeta,
  RadioButtonComponent,
  RadioButtonOption,
  SelectComponent,
  SelectOption,
  SidebarComponent,
  SidebarEntry,
  SidebarLayoutComponent,
  SidebarMainComponent,
  SidebarTriggerDirective,
  StepComponent,
  StepperComponent,
  StepperNextDirective,
  StepperPreviousDirective,
  TableComponent,
  TableConfig,
  TextareaComponent,
  ToastService
} from 'aesy-components';
import { DEMO_COUNTRY_OPTIONS } from '../../models/demo-country-options.const';
import { DEMO_PEOPLE } from '../../models/demo-people.const';
import { DemoPerson } from '../../models/demo-person.interface';
import { DEMO_PLAN_OPTIONS } from '../../models/demo-plan-options.const';
import { SHOWCASE_ENTRIES } from '../../models/showcase-entries.const';
import { ShowcaseEntry } from '../../models/showcase-entry.interface';
import { ShowcaseSelectorPipe } from '../../pipes/showcase-selector.pipe';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { HOME_PREVIEW_ICON_NAMES } from './models/home-preview-icon-names.const';
import { HOME_SIDEBAR_ENTRIES } from './models/home-sidebar-entries.const';
import { HOME_TABLE_CONFIG } from './models/home-table-config.const';

@Component({
  selector: 'app-home',
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    ButtonComponent,
    CheckboxComponent,
    DatepickerComponent,
    DialogActionsComponent,
    DialogComponent,
    IconComponent,
    InputNumberComponent,
    InputTextComponent,
    RadioButtonComponent,
    RouterLink,
    SelectComponent,
    ShowcaseSelectorPipe,
    SidebarComponent,
    SidebarLayoutComponent,
    SidebarMainComponent,
    SidebarTriggerDirective,
    StepComponent,
    StepperComponent,
    StepperNextDirective,
    StepperPreviousDirective,
    TableComponent,
    TextareaComponent,
    ValuePreviewComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly toastService = inject(ToastService);

  protected readonly COUNTRY_OPTIONS: SelectOption[] = DEMO_COUNTRY_OPTIONS;
  protected readonly HOME_PREVIEW_ICON_NAMES: AesyIconName[] = HOME_PREVIEW_ICON_NAMES;
  protected readonly HOME_SIDEBAR_ENTRIES: SidebarEntry[] = HOME_SIDEBAR_ENTRIES;
  protected readonly HOME_TABLE_CONFIG: TableConfig<DemoPerson> = HOME_TABLE_CONFIG;
  protected readonly HOME_TABLE_PAGINATION: PaginationMeta = { page: 1, rowsPerPageCurrent: 4, total: DEMO_PEOPLE.length, pageShown: true };
  protected readonly PEOPLE: DemoPerson[] = DEMO_PEOPLE;
  protected readonly PLAN_OPTIONS: RadioButtonOption[] = DEMO_PLAN_OPTIONS;
  protected readonly SHOWCASE_ENTRIES: ShowcaseEntry[] = SHOWCASE_ENTRIES;
  protected readonly SIDEBAR_TOGGLE_ICON_PATH: string = AESY_ICON_SIDEBAR;

  protected readonly acceptedTerms = signal<boolean>(true);
  protected readonly amount = signal<number | null>(1234.56);
  protected readonly comments = signal<string>('');
  protected readonly country = signal<string | null>('ES');
  protected readonly deliveryDate = signal<Date | string | null>(new Date());
  protected readonly fullName = signal<string>('');
  protected readonly isHomeDialogOpen = signal<boolean>(false);
  protected readonly lastButtonEvent = signal<string>('ninguno');
  protected readonly newsletter = signal<boolean>(false);
  protected readonly plan = signal<string>('monthly');

  protected onPreviewButtonClicked(buttonType: string): void {
    this.lastButtonEvent.set(`buttonClick · ${buttonType}`);
  }

  protected onOpenHomeDialogButtonClicked(): void {
    this.isHomeDialogOpen.set(true);
  }

  protected onHomeSuccessToastButtonClicked(): void {
    this.toastService.success('Cambios guardados correctamente.');
  }

  protected onHomeErrorToastButtonClicked(): void {
    this.toastService.error('No se ha podido conectar con el servidor.', { title: 'Error de conexión' });
  }
}
