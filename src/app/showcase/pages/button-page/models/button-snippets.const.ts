import { DocSnippet } from '../../../models/doc-snippet.interface';

export const BUTTON_SNIPPETS = {
  variants: {
    html: `<aesy-button label="Primary" />
<aesy-button type="secondary" label="Secondary" />
<aesy-button type="tertiary" label="Tertiary" />
<aesy-button type="success" label="Success" />
<aesy-button type="info" label="Info" />
<aesy-button type="warning" label="Warning" />
<aesy-button type="danger" label="Danger" />`
  },
  disabled: {
    html: `<aesy-button type="success" label="Guardar" [disabled]="isSaving()" />`
  },
  icon: {
    ts: `import { AESY_ICON_PLUS } from 'aesy-components';

protected readonly AESY_ICON_PLUS: string = AESY_ICON_PLUS;`,
    html: `<!-- ariaLabel es obligatorio en la práctica: es lo único que leerá un lector de pantalla -->
<aesy-button
  type="secondary"
  ariaLabel="Añadir usuario"
  [iconSvg]="AESY_ICON_PLUS"
  (buttonClick)="onAddButtonClicked()" />`
  },
  events: {
    ts: `protected readonly lastClick = signal<PointerEvent | null>(null);

protected onSaveButtonClicked(event: PointerEvent): void {
  this.lastClick.set(event);
}`,
    html: `<aesy-button label="Guardar" (buttonClick)="onSaveButtonClicked($event)" />`
  },
  theming: {
    css: `aesy-button {
  --aesy-button-background-primary: #3b3bf0;
  --aesy-button-background-primary-hover: #2a2ad6;
  --aesy-button-text-color-primary: #ffffff;
  --aesy-button-border-color-primary: #2a2ad6;
  --aesy-button-border-radius: 999px;
  --aesy-button-padding-x: 1.25rem;
}`
  },
  usage: {
    ts: `import { ButtonComponent } from 'aesy-components';

@Component({
  selector: 'app-delete-user',
  imports: [ButtonComponent],
  templateUrl: './delete-user.component.html'
})
export class DeleteUserComponent {
  protected readonly isDeleting = signal<boolean>(false);

  protected onDeleteButtonClicked(): void {
    this.isDeleting.set(true);
  }
}`,
    html: `<aesy-button
  type="danger"
  label="Eliminar usuario"
  [disabled]="isDeleting()"
  (buttonClick)="onDeleteButtonClicked()" />`
  }
} satisfies Record<string, DocSnippet>;
