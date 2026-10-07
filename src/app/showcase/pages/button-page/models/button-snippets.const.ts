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
    ts: `// models/add-icon-path.const.ts
export const ADD_ICON_PATH: string = 'M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1z';`,
    html: `<!-- ariaLabel es obligatorio en la práctica: es lo único que leerá un lector de pantalla -->
<aesy-button
  type="secondary"
  ariaLabel="Añadir usuario"
  [iconSvg]="ADD_ICON_PATH"
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
