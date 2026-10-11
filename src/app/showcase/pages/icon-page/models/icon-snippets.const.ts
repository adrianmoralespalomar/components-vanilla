import { DocSnippet } from '../../../models/doc-snippet.interface';

export const ICON_SNIPPETS = {
  component: {
    ts: `import { IconComponent } from 'aesy-components';

@Component({
  imports: [IconComponent]
})
export class ExampleComponent {}`,
    html: `<!-- Decorativo: toma el color del texto y mide 1.25rem -->
<aesy-icon name="home" />

<!-- Tamaño y color -->
<aesy-icon name="check-circle" size="2rem" class="success-icon" />

<!-- Con significado propio: los lectores de pantalla lo anuncian -->
<aesy-icon name="warning" ariaLabel="Aviso" />`,
    css: `.success-icon {
  color: #16a34a;
}

/* O el tamaño de todos los iconos de una zona */
.toolbar {
  --aesy-icon-size: 1.5rem;
}`
  },
  constants: {
    ts: `import { AESY_ICON_MENU, AESY_ICON_PLUS, AESY_ICON_STAR } from 'aesy-components';

protected readonly AESY_ICON_MENU: string = AESY_ICON_MENU;
protected readonly AESY_ICON_PLUS: string = AESY_ICON_PLUS;
protected readonly AESY_ICON_STAR: string = AESY_ICON_STAR;`,
    html: `<aesy-button type="secondary" ariaLabel="Añadir" [iconSvg]="AESY_ICON_PLUS" />
<aesy-button ariaLabel="Menú" [iconSvg]="AESY_ICON_MENU" />
<aesy-stepper [completedIconSvg]="AESY_ICON_STAR">…</aesy-stepper>`
  }
} satisfies Record<string, DocSnippet>;
