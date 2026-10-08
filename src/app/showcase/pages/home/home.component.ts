import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AccordionComponent,
  AccordionItemComponent,
  ButtonComponent,
  CheckboxComponent,
  DatepickerComponent,
  InputNumberComponent,
  InputTextComponent,
  PaginationMeta,
  RadioButtonComponent,
  RadioButtonOption,
  SelectComponent,
  SelectOption,
  StepComponent,
  StepperComponent,
  StepperNextDirective,
  StepperPreviousDirective,
  TableComponent,
  TableConfig,
  TextareaComponent
} from 'aesy-components';
import { DEMO_COUNTRY_OPTIONS } from '../../models/demo-country-options.const';
import { DEMO_PEOPLE } from '../../models/demo-people.const';
import { DemoPerson } from '../../models/demo-person.interface';
import { DEMO_PLAN_OPTIONS } from '../../models/demo-plan-options.const';
import { SHOWCASE_ENTRIES } from '../../models/showcase-entries.const';
import { ShowcaseEntry } from '../../models/showcase-entry.interface';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { HOME_TABLE_CONFIG } from './models/home-table-config.const';

@Component({
  selector: 'app-home',
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    ButtonComponent,
    CheckboxComponent,
    DatepickerComponent,
    InputNumberComponent,
    InputTextComponent,
    RadioButtonComponent,
    RouterLink,
    SelectComponent,
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
  protected readonly COUNTRY_OPTIONS: SelectOption[] = DEMO_COUNTRY_OPTIONS;
  protected readonly HOME_TABLE_CONFIG: TableConfig<DemoPerson> = HOME_TABLE_CONFIG;
  protected readonly HOME_TABLE_PAGINATION: PaginationMeta = { page: 1, rowsPerPageCurrent: 4, total: DEMO_PEOPLE.length, pageShown: true };
  protected readonly PEOPLE: DemoPerson[] = DEMO_PEOPLE;
  protected readonly PLAN_OPTIONS: RadioButtonOption[] = DEMO_PLAN_OPTIONS;
  protected readonly SHOWCASE_ENTRIES: ShowcaseEntry[] = SHOWCASE_ENTRIES;

  protected readonly acceptedTerms = signal<boolean>(true);
  protected readonly amount = signal<number | null>(1234.56);
  protected readonly comments = signal<string>('');
  protected readonly country = signal<string | null>('ES');
  protected readonly deliveryDate = signal<Date | string | null>(new Date());
  protected readonly fullName = signal<string>('');
  protected readonly lastButtonEvent = signal<string>('ninguno');
  protected readonly newsletter = signal<boolean>(false);
  protected readonly plan = signal<string>('monthly');

  protected onPreviewButtonClicked(buttonType: string): void {
    this.lastButtonEvent.set(`buttonClick · ${buttonType}`);
  }
}
