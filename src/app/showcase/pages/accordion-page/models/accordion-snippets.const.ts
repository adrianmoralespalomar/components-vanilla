import { DocSnippet } from '../../../models/doc-snippet.interface';

export const ACCORDION_SNIPPETS = {
  basic: {
    ts: `import { AccordionComponent, AccordionItemComponent } from 'aesy-components';

@Component({
  imports: [AccordionComponent, AccordionItemComponent]
})
export class FaqComponent {
  protected readonly FAQ_ITEMS: FaqItem[] = FAQ_ITEMS;
}`,
    html: `<aesy-accordion>
  @for (faqItem of FAQ_ITEMS; track faqItem.question; let isFirst = $first) {
    <aesy-accordion-item [label]="faqItem.question" [expanded]="isFirst">
      {{ faqItem.answer }}
    </aesy-accordion-item>
  }
</aesy-accordion>`
  },
  multi: {
    html: `<aesy-button type="secondary" label="Abrir todos" (buttonClick)="faqAccordion.openAll()" />
<aesy-button label="Cerrar todos" (buttonClick)="faqAccordion.closeAll()" />

<aesy-accordion #faqAccordion [multi]="true">
  <aesy-accordion-item label="¿Cuánto tarda el envío?">…</aesy-accordion-item>
  <aesy-accordion-item label="¿Puedo devolver un producto?">…</aesy-accordion-item>
</aesy-accordion>`
  },
  appearance: {
    ts: `import { AccordionAppearance } from 'aesy-components';

protected readonly selectedAppearance = signal<AccordionAppearance>('joined');`,
    html: `<aesy-accordion [appearance]="selectedAppearance()">
  …
</aesy-accordion>

<!-- O fijo -->
<aesy-accordion appearance="separated">…</aesy-accordion>`
  },
  customContent: {
    html: `<aesy-accordion-item description="Calle Mayor 12, Madrid">
  <span aesyAccordionTitle>
    Dirección de envío
    <span class="badge">Principal</span>
  </span>

  <p>Calle Mayor 12, 3.º B · 28013 Madrid · España</p>

  <aesy-button type="tertiary" label="Eliminar" aesyAccordionActions />
  <aesy-button type="secondary" label="Editar" aesyAccordionActions />
</aesy-accordion-item>

<aesy-accordion-item label="Método de pago">
  <span aesyAccordionDescription>Visa terminada en <strong>4242</strong></span>
  …
</aesy-accordion-item>`
  },
  controlled: {
    ts: `protected readonly isOrderDetailsExpanded = signal<boolean>(true);

protected onOrderDetailsOpened(): void {
  console.log('Abierto');
}`,
    html: `<aesy-checkbox label="Detalles del pedido abiertos" [(value)]="isOrderDetailsExpanded" />

<aesy-accordion-item
  label="Detalles del pedido"
  [(expanded)]="isOrderDetailsExpanded"
  (opened)="onOrderDetailsOpened()"
  (closed)="onOrderDetailsClosed()">
  3 artículos · 84,90 €
</aesy-accordion-item>`
  },
  disabled: {
    html: `<aesy-accordion>
  <aesy-accordion-item label="Plan Básico">…</aesy-accordion-item>
  <aesy-accordion-item label="Plan Equipo" [disabled]="!isAdmin()">…</aesy-accordion-item>
  <aesy-accordion-item label="Plan Empresa">…</aesy-accordion-item>
</aesy-accordion>`
  },
  toggleIcon: {
    ts: `// models/plus-icon-path.const.ts
export const PLUS_ICON_PATH: string = 'M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1z';`,
    html: `<aesy-accordion togglePosition="before">…</aesy-accordion>

<aesy-accordion class="plus-accordion" [toggleIconSvg]="PLUS_ICON_PATH">…</aesy-accordion>

<aesy-accordion [hideToggle]="true">…</aesy-accordion>`,
    css: `.plus-accordion {
  --aesy-accordion-toggle-icon-rotation-expanded: 45deg;
}`
  },
  lazy: {
    ts: `import { AccordionItemContentDirective } from 'aesy-components';

@Component({
  imports: [AccordionComponent, AccordionItemComponent, AccordionItemContentDirective]
})`,
    html: `<aesy-accordion-item label="Equipo" description="12 personas">
  <!-- No se crea hasta que el ítem se abre por primera vez -->
  <ng-template aesyAccordionContent>
    <aesy-table [data]="people()" [config]="TABLE_CONFIG" [paginationMetaConfig]="TABLE_PAGINATION" />
  </ng-template>
</aesy-accordion-item>`
  },
  standalone: {
    html: `<aesy-accordion-item label="Opciones avanzadas" description="Solo si sabes lo que haces">
  <aesy-checkbox label="Activar modo depuración" />
</aesy-accordion-item>`
  },
  nested: {
    html: `<aesy-accordion>
  <aesy-accordion-item label="Frontend">
    <aesy-accordion appearance="flat" [headingLevel]="4">
      <aesy-accordion-item label="Angular">…</aesy-accordion-item>
      <aesy-accordion-item label="CSS">…</aesy-accordion-item>
    </aesy-accordion>
  </aesy-accordion-item>
  <aesy-accordion-item label="Backend">…</aesy-accordion-item>
</aesy-accordion>`
  },
  theming: {
    css: `/* En el acordeón, en un ítem concreto o en :root para toda la app */
aesy-accordion.brand-accordion {
  --aesy-accordion-background: #faf7ff;
  --aesy-accordion-border-color: #e4d8fd;
  --aesy-accordion-border-radius: 14px;
  --aesy-accordion-focus-color: #7c3aed;
  --aesy-accordion-gap: 10px;
  --aesy-accordion-header-background-expanded: #f1e9ff;
  --aesy-accordion-header-background-hover: #f5efff;
  --aesy-accordion-text-color: #3b1d6e;
  --aesy-accordion-toggle-icon-color: #7c3aed;
  --aesy-accordion-transition-duration: 0.35s;
}

/* Todas las variables, con su valor por defecto:
  --aesy-accordion-background: #ffffff;
  --aesy-accordion-border-color: #e5e7eb;
  --aesy-accordion-border-radius: 0.5rem;
  --aesy-accordion-border-width: 1px;
  --aesy-accordion-gap: 0.75rem;                (solo separated)
  --aesy-accordion-text-color: #374151;
  --aesy-accordion-padding-x: 1rem;
  --aesy-accordion-header-padding-y: 0.75rem;
  --aesy-accordion-header-min-height: 3.25rem;
  --aesy-accordion-header-gap: 0.75rem;
  --aesy-accordion-header-background: transparent;
  --aesy-accordion-header-background-hover: #f9fafb;
  --aesy-accordion-header-background-expanded: transparent;
  --aesy-accordion-title-font-size: 0.9375rem;
  --aesy-accordion-title-font-weight: 600;
  --aesy-accordion-description-color: #6b7280;
  --aesy-accordion-description-font-size: 0.875rem;
  --aesy-accordion-toggle-icon-color: #6b7280;
  --aesy-accordion-toggle-icon-size: 1.25rem;
  --aesy-accordion-toggle-icon-rotation-expanded: 180deg;
  --aesy-accordion-body-text-color: inherit;
  --aesy-accordion-body-font-size: 0.875rem;
  --aesy-accordion-body-padding-bottom: 1rem;
  --aesy-accordion-actions-gap: 0.5rem;
  --aesy-accordion-actions-justify-content: flex-end;
  --aesy-accordion-focus-color: #3b82f6;
  --aesy-accordion-disabled-text-color: #9ca3af;
  --aesy-accordion-transition-duration: 0.2s;
*/`
  }
} satisfies Record<string, DocSnippet>;
