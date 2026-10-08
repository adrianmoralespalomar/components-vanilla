import { DocSnippet } from '../../../models/doc-snippet.interface';

export const TOAST_SNIPPETS = {
  types: {
    ts: `import { ToastService } from 'aesy-components';

export class SettingsComponent {
  private readonly toastService = inject(ToastService);

  protected onSaveButtonClicked(): void {
    this.toastService.success('Cambios guardados correctamente.');
  }
}

// Todos los tipos
this.toastService.show({ message: 'Tienes 3 notificaciones nuevas.' }); // neutral
this.toastService.success('Cambios guardados correctamente.');
this.toastService.info('Hay una nueva versión disponible.');
this.toastService.warning('Tu sesión caduca en 5 minutos.');
this.toastService.error('No se ha podido conectar con el servidor.');`
  },
  action: {
    ts: `protected onArchiveConversationButtonClicked(): void {
  const toastRef = this.toastService.show({
    action: { label: 'Deshacer' },
    message: 'La conversación con Lucía se ha movido al archivo.',
    title: 'Conversación archivada'
  });

  toastRef.onAction().subscribe(() => this.restoreConversation());
  toastRef.afterDismissed().subscribe(reason => console.log(reason)); // 'timeout' | 'close' | 'action' | 'manual' | 'limit'
}`
  },
  duration: {
    ts: `this.toastService.info('Me voy en 2 segundos.', { duration: 2000 });

// 0 = no se cierra solo
this.toastService.warning('No me cierro solo: usa el aspa.', { duration: 0, title: 'Revisa tu método de pago' });

this.toastService.success('Sin barra de progreso.', { showProgress: false });

this.toastService.dismissAll();`
  },
  manualDismiss: {
    ts: `protected onUploadFileButtonClicked(): void {
  const uploadingToastRef = this.toastService.show({
    dismissible: false,
    duration: 0,
    message: 'Subiendo informe-anual.pdf…'
  });

  this.filesService.upload(this.selectedFile()).subscribe(() => {
    uploadingToastRef.dismiss();
    this.toastService.success('informe-anual.pdf se ha subido.');
  });
}`
  },
  globalConfig: {
    ts: `// app.config.ts: configuración inicial
import { provideAesyToastConfig } from 'aesy-components';

export const appConfig: ApplicationConfig = {
  providers: [provideAesyToastConfig({ position: 'top-center', duration: 4000, maxVisible: 3 })]
};

// En caliente, desde cualquier sitio
this.toastService.configure({ position: 'bottom-left' });`
  },
  overDialog: {
    html: `<aesy-dialog #savingDialog title="Guardar borrador" [(open)]="isDialogOpen">
  …
  <aesy-dialog-actions>
    <aesy-button type="secondary" label="Guardar" (buttonClick)="onSaveDraftButtonClicked()" />
  </aesy-dialog-actions>
</aesy-dialog>`,
    ts: `protected onSaveDraftButtonClicked(): void {
  // Sale por encima del fondo del diálogo
  this.toastService.success('Borrador guardado.', { title: 'Listo' });
}`
  },
  theming: {
    ts: `// Solo a algunos toasts: pásales la clase con cssClass
this.toastService.success('Cambios guardados.', { cssClass: 'toast-theme-filled' });`,
    css: `/* styles.css (global: el contenedor de toasts cuelga del body) */

/* Para TODOS los toasts, en :root. Ej.: success con todo el fondo verde */
:root {
  --aesy-toast-success-background: #16a34a;
  --aesy-toast-success-border-color: transparent;
  --aesy-toast-success-color: #ffffff;       /* icono, acción y barra */
  --aesy-toast-success-text-color: #ffffff;  /* mensaje y título */
}

/* Solo para los toasts con cssClass: 'toast-theme-filled' */
.toast-theme-filled {
  --aesy-toast-border-color: transparent;
  --aesy-toast-text-color: #ffffff;
  --aesy-toast-title-color: #ffffff;
  --aesy-toast-neutral-background: #374151;
  --aesy-toast-neutral-color: #ffffff;
  --aesy-toast-success-background: #16a34a;
  --aesy-toast-success-color: #ffffff;
  --aesy-toast-info-background: #2563eb;
  --aesy-toast-info-color: #ffffff;
  --aesy-toast-warning-background: #d97706;
  --aesy-toast-warning-color: #ffffff;
  --aesy-toast-error-background: #dc2626;
  --aesy-toast-error-color: #ffffff;
}

/* Fondo suave por tipo */
.toast-theme-soft {
  --aesy-toast-success-background: #f0fdf4;
  --aesy-toast-success-border-color: #bbf7d0;
  --aesy-toast-success-text-color: #14532d;
  --aesy-toast-error-background: #fef2f2;
  --aesy-toast-error-border-color: #fecaca;
  --aesy-toast-error-text-color: #7f1d1d;
  /* … igual con info y warning */
}

/* Oscuro */
.toast-theme-dark {
  --aesy-toast-background: #111827;
  --aesy-toast-border-color: #1f2937;
  --aesy-toast-text-color: #d1d5db;
  --aesy-toast-title-color: #ffffff;
  --aesy-toast-success-color: #4ade80;
  --aesy-toast-error-color: #f87171;
  /* … */
}

/* Marca: el fondo admite degradados */
.toast-theme-brand {
  --aesy-toast-border-radius: 16px;
  --aesy-toast-success-background: linear-gradient(135deg, #a855f7, #6d28d9);
  --aesy-toast-success-border-color: transparent;
  --aesy-toast-success-color: #ffffff;
  --aesy-toast-success-text-color: #ffffff;
}

/* Variables por tipo ({type} = neutral | success | info | warning | error):
  --aesy-toast-{type}-color          icono, botón de acción y barra (defecto: gris, verde, azul, ámbar, rojo)
  --aesy-toast-{type}-background     defecto: --aesy-toast-background
  --aesy-toast-{type}-border-color   defecto: --aesy-toast-border-color
  --aesy-toast-{type}-text-color     mensaje y título; defecto: --aesy-toast-text-color / --aesy-toast-title-color

Generales, con su valor por defecto:
  --aesy-toast-width: 22rem;
  --aesy-toast-offset: 1rem;                (distancia al borde de la ventana)
  --aesy-toast-gap: 0.75rem;
  --aesy-toast-background: #ffffff;
  --aesy-toast-border-color: #e5e7eb;
  --aesy-toast-border-radius: 0.75rem;
  --aesy-toast-shadow: 0 12px 32px -12px rgb(17 24 39 / 0.3);
  --aesy-toast-text-color: #374151;
  --aesy-toast-title-color: #111827;
  --aesy-toast-font-size: 0.875rem;
  --aesy-toast-action-color: (el color del tipo);
  --aesy-toast-close-button-color: (el color del texto);
  --aesy-toast-button-background-hover: (el color del texto al 12 %);
  --aesy-toast-progress-color: (el color del tipo);
  --aesy-toast-focus-color: (el color del botón);
  --aesy-toast-transition-duration: 0.25s;
*/`
  }
} satisfies Record<string, DocSnippet>;
