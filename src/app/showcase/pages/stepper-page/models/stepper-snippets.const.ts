import { DocSnippet } from '../../../models/doc-snippet.interface';

export const STEPPER_SNIPPETS = {
  horizontal: {
    ts: `import { ButtonComponent, StepComponent, StepperComponent, StepperNextDirective, StepperPreviousDirective } from 'aesy-components';

@Component({
  imports: [ButtonComponent, StepComponent, StepperComponent, StepperNextDirective, StepperPreviousDirective]
})
export class CheckoutComponent {}`,
    html: `<aesy-stepper>
  <aesy-step label="Carrito">
    <p>3 artículos · 84,90 €</p>
    <aesy-button type="secondary" label="Siguiente" aesyStepperNext />
  </aesy-step>
  <aesy-step label="Envío">
    …
    <aesy-button label="Atrás" aesyStepperPrevious />
    <aesy-button type="secondary" label="Siguiente" aesyStepperNext />
  </aesy-step>
  <aesy-step label="Pago">…</aesy-step>
</aesy-stepper>`
  },
  vertical: {
    ts: `import { StepperOrientation } from 'aesy-components';

// Por ejemplo: vertical en móvil, horizontal en escritorio
protected readonly stepperOrientation = signal<StepperOrientation>('vertical');`,
    html: `<aesy-stepper orientation="vertical">
  <aesy-step label="Elige un plan">…</aesy-step>
  <aesy-step label="Invita a tu equipo" [optional]="true">…</aesy-step>
  <aesy-step label="Empieza a trabajar">…</aesy-step>
</aesy-stepper>

<!-- O dinámico -->
<aesy-stepper [orientation]="stepperOrientation()">…</aesy-stepper>`
  },
  linearForms: {
    ts: `protected readonly personalDataForm = new FormGroup({
  fullName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] })
});

protected readonly addressForm = new FormGroup({
  city: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
});`,
    html: `<aesy-stepper #checkoutStepper [linear]="true">
  <aesy-step label="Tus datos" errorMessage="Revisa tus datos" [stepControl]="personalDataForm">
    <form [formGroup]="personalDataForm">
      <aesy-input-text label="Nombre" formControlName="fullName" />
      <aesy-input-text label="Correo" type="email" formControlName="email" />
    </form>
    <aesy-button type="secondary" label="Siguiente" aesyStepperNext />
  </aesy-step>

  <aesy-step label="Dirección" errorMessage="Falta la dirección" [stepControl]="addressForm">…</aesy-step>

  <aesy-step label="Resumen">
    <aesy-button label="Empezar de nuevo" (buttonClick)="checkoutStepper.reset()" />
  </aesy-step>
</aesy-stepper>`
  },
  labelBottom: {
    html: `<aesy-stepper labelPosition="bottom">
  <aesy-step label="Cuenta">…</aesy-step>
  <aesy-step label="Perfil">…</aesy-step>
  <aesy-step label="Preferencias">…</aesy-step>
</aesy-stepper>`
  },
  optionalNotEditable: {
    html: `<aesy-stepper [linear]="true">
  <aesy-step label="Crear cuenta" [editable]="false">…</aesy-step>
  <aesy-step label="Foto de perfil" [optional]="true">…</aesy-step>
  <aesy-step label="Listo">…</aesy-step>
</aesy-stepper>`
  },
  controlled: {
    ts: `protected readonly currentStepIndex = signal<number>(0);

protected onGoToLastStepButtonClicked(): void {
  this.currentStepIndex.set(3);
}

protected onTripStepperSelectionChanged(selectionChange: StepperSelectionChange): void {
  console.log(selectionChange.previousIndex, '→', selectionChange.selectedIndex);
}`,
    html: `<aesy-button label="Ir al último paso" (buttonClick)="onGoToLastStepButtonClicked()" />
<aesy-button label="Reiniciar" (buttonClick)="tripStepper.reset()" />

<aesy-stepper
  #tripStepper
  [(selectedIndex)]="currentStepIndex"
  (selectionChange)="onTripStepperSelectionChanged($event)">
  …
</aesy-stepper>`
  },
  customContent: {
    ts: `// models/star-icon-path.const.ts
export const STAR_ICON_PATH: string = 'M10 2.5l2.32 4.7 5.18.75-3.75 3.66.89 5.16L10 14.33l-4.64 2.44.89-5.16L2.5 7.95l5.18-.75L10 2.5z';`,
    html: `<aesy-stepper [completedIconSvg]="STAR_ICON_PATH">
  <aesy-step>
    <span aesyStepLabel>
      Pedido
      <span class="badge">3</span>
    </span>
    …
  </aesy-step>
</aesy-stepper>`
  },
  lazy: {
    ts: `import { StepContentDirective } from 'aesy-components';`,
    html: `<aesy-step label="Equipo">
  <!-- No se crea hasta que el paso se selecciona por primera vez -->
  <ng-template aesyStepContent>
    <aesy-table [data]="people()" [config]="TABLE_CONFIG" [paginationMetaConfig]="TABLE_PAGINATION" />
  </ng-template>
</aesy-step>`
  },
  theming: {
    css: `/* En el stepper o en :root para toda la app */
aesy-stepper.brand-stepper {
  --aesy-stepper-connector-color: #e4d8fd;
  --aesy-stepper-connector-color-completed: #7c3aed;
  --aesy-stepper-connector-width: 2px;
  --aesy-stepper-focus-color: #7c3aed;
  --aesy-stepper-header-background-hover: #f5efff;
  --aesy-stepper-icon-background: #f1e9ff;
  --aesy-stepper-icon-background-active: #7c3aed;
  --aesy-stepper-icon-background-completed: #c084fc;
  --aesy-stepper-icon-color: #7c3aed;
  --aesy-stepper-icon-size: 2.25rem;
  --aesy-stepper-label-color-active: #3b1d6e;
}

/* Todas las variables, con su valor por defecto:
  --aesy-stepper-text-color: #374151;
  --aesy-stepper-header-padding: 0.5rem;
  --aesy-stepper-header-gap: 0.75rem;
  --aesy-stepper-header-border-radius: 0.5rem;
  --aesy-stepper-header-background-hover: #f9fafb;
  --aesy-stepper-icon-size: 2rem;
  --aesy-stepper-icon-background: #e5e7eb;
  --aesy-stepper-icon-color: #4b5563;
  --aesy-stepper-icon-background-active: #3b82f6;
  --aesy-stepper-icon-background-completed: #3b82f6;
  --aesy-stepper-icon-color-active: #ffffff;
  --aesy-stepper-label-color: #6b7280;
  --aesy-stepper-label-color-active: #111827;
  --aesy-stepper-label-color-completed: #374151;
  --aesy-stepper-label-font-size: 0.875rem;
  --aesy-stepper-optional-color: #9ca3af;
  --aesy-stepper-error-color: #dc2626;
  --aesy-stepper-connector-color: #e5e7eb;
  --aesy-stepper-connector-color-completed: #3b82f6;
  --aesy-stepper-connector-width: 1px;
  --aesy-stepper-panel-padding: 1.5rem 0.5rem 0.5rem;     (horizontal)
  --aesy-stepper-vertical-panel-padding: 0.25rem 0 1.5rem; (vertical)
  --aesy-stepper-vertical-gap: 1rem;                      (vertical)
  --aesy-stepper-focus-color: #3b82f6;
  --aesy-stepper-transition-duration: 0.25s;
*/`
  }
} satisfies Record<string, DocSnippet>;
