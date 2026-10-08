# DialogComponent

Diálogo modal basado en el elemento `<dialog>` nativo. Se usa de dos formas:

- **En plantilla**: `<aesy-dialog [(open)]>` con el contenido dentro.
- **Desde código**: `DialogService.open(MiComponente, config)` crea el diálogo con tu componente dentro y devuelve un `DialogRef`.

Selectores: `aesy-dialog` y `aesy-dialog-actions`. Servicio: `DialogService`.

## Características

- El navegador se encarga de lo difícil: capa superior (sin `z-index`), foco atrapado, resto de la página inerte y cierre con Escape.
- Cuatro tamaños (`small`, `medium`, `large`, `fullscreen`); el cuerpo hace scroll y los botones quedan fijos al pie.
- Resultado al cerrar: `close(result)` → `closed` (plantilla) o `afterClosed()` (servicio).
- Cierre configurable: fondo, Escape y aspa; `role="alertdialog"` para avisos que exigen respuesta.
- Bloquea el scroll de la página mientras está abierto y devuelve el foco al elemento que lo abrió.
- Animación de entrada y salida solo con CSS (`@starting-style`), desactivada con `prefers-reduced-motion`.
- Variables CSS `--aesy-dialog-*` heredables. Standalone y `OnPush`.

---

# En plantilla

```ts
import { ButtonComponent, DialogActionsComponent, DialogComponent } from 'aesy-components';

@Component({
  imports: [ButtonComponent, DialogActionsComponent, DialogComponent]
})
export class ArticleComponent {
  protected readonly isPublishDialogOpen = signal<boolean>(false);

  protected onPublishDialogClosed(result: unknown): void {
    if (result === 'publicado') this.publishArticle();
  }
}
```

```html
<aesy-button label="Publicar" (buttonClick)="isPublishDialogOpen.set(true)" />

<aesy-dialog
  #publishDialog
  title="Publicar artículo"
  [(open)]="isPublishDialogOpen"
  (closed)="onPublishDialogClosed($event)">
  <p>El artículo será visible para todos los lectores.</p>
  <aesy-dialog-actions>
    <aesy-button label="Cancelar" (buttonClick)="publishDialog.close('cancelado')" />
    <aesy-button type="secondary" label="Publicar" (buttonClick)="publishDialog.close('publicado')" />
  </aesy-dialog-actions>
</aesy-dialog>
```

- `[(open)]` abre y cierra, y vuelve a `false` cuando el usuario lo cierra.
- `close(result)` cierra y emite `closed` con ese valor. Con Escape, el fondo o el aspa, `closed` emite `undefined`.
- Si cierras poniendo `open` a `false` (sin `close()`), `closed` también emite `undefined`: para devolver un resultado usa `close(result)`.

---

# Desde código (DialogService)

El componente del diálogo recibe los datos con `AESY_DIALOG_DATA` y se cierra con `DialogRef`:

```ts
@Component({
  selector: 'app-confirm-delete-dialog',
  imports: [ButtonComponent, DialogActionsComponent],
  template: `
    <p>Vas a eliminar <strong>{{ data.projectName }}</strong>.</p>
    <aesy-dialog-actions>
      <aesy-button label="Cancelar" (buttonClick)="onCancelButtonClicked()" />
      <aesy-button type="danger" label="Eliminar" (buttonClick)="onDeleteButtonClicked()" />
    </aesy-dialog-actions>
  `
})
export class ConfirmDeleteDialogComponent {
  private readonly dialogRef = inject<DialogRef<boolean>>(DialogRef);

  protected readonly data = inject<ConfirmDeleteDialogData>(AESY_DIALOG_DATA);

  protected onCancelButtonClicked(): void {
    this.dialogRef.close(false);
  }

  protected onDeleteButtonClicked(): void {
    this.dialogRef.close(true);
  }
}
```

```ts
private readonly dialogService = inject(DialogService);

protected onDeleteProjectButtonClicked(): void {
  this.dialogService
    .open<ConfirmDeleteDialogComponent, ConfirmDeleteDialogData, boolean>(ConfirmDeleteDialogComponent, {
      data: { projectName: 'Rediseño web' },
      role: 'alertdialog',
      size: 'small',
      title: '¿Eliminar el proyecto?'
    })
    .afterClosed()
    .subscribe(isConfirmed => {
      if (isConfirmed) this.deleteProject();
    });
}
```

El servicio crea un `aesy-dialog` en el `body`, mete tu componente dentro y, al cerrarse y terminar la animación, destruye ambos. `aesy-dialog-actions` dentro de tu componente también queda fijo al pie del área con scroll.

---

# Tamaños

```html
<aesy-dialog size="small">…</aesy-dialog>
<aesy-dialog>…</aesy-dialog> <!-- medium -->
<aesy-dialog size="large">…</aesy-dialog>
<aesy-dialog size="fullscreen">…</aesy-dialog>
```

Nunca se sale de la ventana (máximo `100vw - 2rem` × `100dvh - 2rem`, salvo `fullscreen`). Los anchos se cambian con `--aesy-dialog-width-small`, `-medium` y `-large`.

---

# Cierre obligatorio

```html
<aesy-dialog
  title="Nuevos términos de uso"
  role="alertdialog"
  [closeOnBackdropClick]="false"
  [closeOnEscape]="false"
  [showCloseButton]="false"
  [(open)]="isTermsDialogOpen">
  …
</aesy-dialog>
```

> Chrome puede ignorar `closeOnEscape` en `false` si se pulsa Escape dos veces seguidas sin interactuar antes con la página (protección contra diálogos que no se dejan cerrar).

---

# Accesibilidad

- `<dialog>` abierto con `showModal()`: el resto de la página queda inerte y el foco no sale del diálogo.
- Al abrirse, el foco va al elemento con `autofocus` si lo hay; si no, al panel (no al aspa). Al cerrarse vuelve al elemento que tenía el foco.
- Nombre accesible: `title` (`aria-labelledby`) o, si no hay título, `ariaLabel`.
- `role="alertdialog"` para avisos que exigen respuesta.
- Sin animación con `prefers-reduced-motion: reduce`.

---

# API

## aesy-dialog · Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | `''` | Título y nombre accesible. |
| `size` | `DialogSize` | `'medium'` | `'small' \| 'medium' \| 'large' \| 'fullscreen'`. |
| `role` | `DialogRole` | `'dialog'` | `'dialog' \| 'alertdialog'`. |
| `closeOnBackdropClick` | `boolean` | `true` | Cerrar al pulsar el fondo. |
| `closeOnEscape` | `boolean` | `true` | Cerrar con Escape. |
| `showCloseButton` | `boolean` | `true` | Aspa en la cabecera. |
| `closeButtonAriaLabel` | `string` | `'Cerrar'` | Nombre accesible del aspa. |
| `ariaLabel` | `string` | `''` | Nombre accesible si no hay `title`. |

## aesy-dialog · Model, outputs y métodos

| Nombre | Tipo | Descripción |
|---|---|---|
| `open` (model) | `boolean` | Abierto o cerrado. |
| `opened` (output) | `void` | Se ha abierto. |
| `closed` (output) | `unknown` | Se ha cerrado, con el resultado de `close(result)`. |
| `close(result?)` | `void` | Cierra el diálogo. |

## Contenido proyectado

| Selector | Dónde va |
|---|---|
| (sin selector) | Cuerpo, con scroll si no cabe. |
| `aesy-dialog-actions` | Fila de botones fija al pie. |
| `[aesyDialogTitle]` | Se añade al título, detrás de `title`. |

## DialogService

| Método | Devuelve | Descripción |
|---|---|---|
| `open(component, config?)` | `DialogRef<TResult>` | Abre el componente dentro de un `aesy-dialog`. |

`DialogConfig<TData>`: `data`, `injector` y los mismos campos que los inputs (`title`, `size`, `role`, `closeOnBackdropClick`, `closeOnEscape`, `showCloseButton`, `closeButtonAriaLabel`, `ariaLabel`).

## DialogRef<TResult>

| Método | Descripción |
|---|---|
| `close(result?)` | Cierra el diálogo. |
| `afterClosed()` | `Observable<TResult \| undefined>`: emite una vez al cerrarse y termina. |

## Tipos y tokens

```ts
export type DialogSize = 'small' | 'medium' | 'large' | 'fullscreen';
export type DialogRole = 'dialog' | 'alertdialog';
export const AESY_DIALOG_DATA: InjectionToken<unknown>;
```

---

# CSS Variables

Como en el acordeón y el stepper, se leen con su valor por defecto y se heredan: decláralas en el diálogo, en un contenedor o en `:root`.

| Variable | Defecto |
|---|---|
| `--aesy-dialog-background` | `#ffffff` |
| `--aesy-dialog-backdrop-background` | `rgb(17 24 39 / 0.5)` |
| `--aesy-dialog-border-radius` | `0.75rem` |
| `--aesy-dialog-shadow` | `0 24px 48px -12px rgb(17 24 39 / 0.3)` |
| `--aesy-dialog-text-color` | `#374151` |
| `--aesy-dialog-title-color` | `#111827` |
| `--aesy-dialog-title-font-size` | `1.125rem` |
| `--aesy-dialog-title-font-weight` | `600` |
| `--aesy-dialog-body-font-size` | `0.9375rem` |
| `--aesy-dialog-padding` | `1.5rem` |
| `--aesy-dialog-width-small` / `-medium` / `-large` | `24rem` / `32rem` / `48rem` |
| `--aesy-dialog-close-button-color` | `#6b7280` |
| `--aesy-dialog-close-button-background-hover` | `#f3f4f6` |
| `--aesy-dialog-actions-border` | `1px solid #f3f4f6` |
| `--aesy-dialog-actions-gap` | `0.5rem` |
| `--aesy-dialog-actions-justify-content` | `flex-end` |
| `--aesy-dialog-focus-color` | `#3b82f6` |
| `--aesy-dialog-transition-duration` | `0.2s` |
