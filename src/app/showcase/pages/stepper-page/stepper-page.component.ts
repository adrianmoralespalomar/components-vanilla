import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ButtonComponent,
  CheckboxComponent,
  InputTextComponent,
  PaginationMeta,
  RadioButtonComponent,
  RadioButtonOption,
  StepComponent,
  StepContentDirective,
  StepperComponent,
  StepperNextDirective,
  StepperOrientation,
  StepperPreviousDirective,
  StepperSelectionChange,
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
import { STEP_API } from './models/step-api.const';
import { STEPPER_API } from './models/stepper-api.const';
import { STEPPER_EVENTS_LOG_MAX_LENGTH } from './models/stepper-events-log-max-length.const';
import { STEPPER_ICON_PATHS } from './models/stepper-icon-paths.const';
import { STEPPER_LAZY_TABLE_CONFIG } from './models/stepper-lazy-table-config.const';
import { STEPPER_ONBOARDING_STEP_LABELS } from './models/stepper-onboarding-step-labels.const';
import { STEPPER_ORIENTATION_OPTIONS } from './models/stepper-orientation-options.const';
import { STEPPER_SNIPPETS } from './models/stepper-snippets.const';
import { STEPPER_TRIP_STEP_LABELS } from './models/stepper-trip-step-labels.const';

@Component({
  selector: 'app-stepper-page',
  imports: [
    ApiReferenceComponent,
    ButtonComponent,
    CheckboxComponent,
    DocPageComponent,
    DocSectionComponent,
    InputTextComponent,
    RadioButtonComponent,
    ReactiveFormsModule,
    StepComponent,
    StepContentDirective,
    StepperComponent,
    StepperNextDirective,
    StepperPreviousDirective,
    TableComponent,
    ValuePreviewComponent
  ],
  templateUrl: './stepper-page.component.html',
  styleUrl: './stepper-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepperPageComponent {
  protected readonly CONTROLLED_STEPS: string[] = STEPPER_TRIP_STEP_LABELS;
  protected readonly ICON_PATHS = STEPPER_ICON_PATHS;
  protected readonly LABEL_BOTTOM_STEPS: string[] = STEPPER_ONBOARDING_STEP_LABELS;
  protected readonly LAZY_TABLE_CONFIG: TableConfig<DemoPerson> = STEPPER_LAZY_TABLE_CONFIG;
  protected readonly LAZY_TABLE_PAGINATION: PaginationMeta = { page: 1, rowsPerPageCurrent: 4, total: DEMO_PEOPLE.length, pageShown: true };
  protected readonly ORIENTATION_OPTIONS: RadioButtonOption[] = STEPPER_ORIENTATION_OPTIONS;
  protected readonly PEOPLE: DemoPerson[] = DEMO_PEOPLE;
  protected readonly SNIPPETS = STEPPER_SNIPPETS;
  protected readonly STEP_API: ComponentApi = STEP_API;
  protected readonly STEPPER_API: ComponentApi = STEPPER_API;

  protected readonly addressForm = new FormGroup({
    city: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    postalCode: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{5}$/)] })
  });
  protected readonly personalDataForm = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    fullName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  });

  protected readonly addressFormValue = toSignal(this.addressForm.valueChanges, { initialValue: this.addressForm.value });
  protected readonly controlledStepIndex = signal<number>(0);
  protected readonly isCheckoutLinear = signal<boolean>(true);
  protected readonly lazyTableCreatedAt = signal<string | null>(null);
  protected readonly personalDataFormValue = toSignal(this.personalDataForm.valueChanges, { initialValue: this.personalDataForm.value });
  protected readonly selectedOrientation = signal<StepperOrientation>('vertical');
  protected readonly selectionChangesLog = signal<StepperSelectionChange[]>([]);

  protected onGoToLastStepButtonClicked(): void {
    this.controlledStepIndex.set(this.CONTROLLED_STEPS.length - 1);
  }

  protected onControlledStepperSelectionChanged(selectionChange: StepperSelectionChange): void {
    this.selectionChangesLog.update(selectionChangesLog => [selectionChange, ...selectionChangesLog].slice(0, STEPPER_EVENTS_LOG_MAX_LENGTH));
  }

  protected onLazyStepperSelectionChanged(selectionChange: StepperSelectionChange): void {
    if (selectionChange.selectedIndex !== 1 || this.lazyTableCreatedAt()) return;
    this.lazyTableCreatedAt.set(`al entrar en el paso por primera vez, a las ${new Date().toLocaleTimeString('es-ES')}`);
  }
}
