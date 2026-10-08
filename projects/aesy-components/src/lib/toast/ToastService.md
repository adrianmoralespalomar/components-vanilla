# ToastService

Notificaciones temporales que se lanzan desde código. No hay que poner nada en la plantilla: el servicio crea su contenedor en el `body` al arrancar la aplicación.

## Características

- Cinco tipos con icono y color: `neutral`, `success`, `info`, `warning` y `error`, con atajos `success()`, `info()`…
- Título opcional, botón de acción (por ejemplo "Deshacer") y aspa de cerrar.
- Duración configurable (o sin cierre automático) con barra de progreso.
- La cuenta atrás se pausa con el ratón encima o el foco dentro.
- `ToastRef` para cerrarlo por código y saber si se pulsó la acción o por qué se cerró.
- Configuración global: posición (6), duración por defecto, máximo visible…, al arrancar con `provideAesyToastConfig()` o en caliente con `configure()`.
- Se muestra por encima de los diálogos modales (el contenedor es un popover del navegador).
- Estilo por tipo con variables CSS (por ejemplo, el success con todo el fondo verde) y `cssClass` para dar estilo propio solo a algunos toasts.
- Región `aria-live` para lectores de pantalla y animaciones desactivadas con `prefers-reduced-motion`.

---

# Uso

```ts
import { ToastService } from 'aesy-components';

export class SettingsComponent {
  private readonly toastService = inject(ToastService);

  protected onSaveButtonClicked(): void {
    this.toastService.success('Cambios guardados correctamente.');
  }
}
```

```ts
this.toastService.show({ message: 'Tienes 3 notificaciones nuevas.' }); // neutral
this.toastService.success('Cambios guardados correctamente.');
this.toastService.info('Hay una nueva versión disponible.');
this.toastService.warning('Tu sesión caduca en 5 minutos.');
this.toastService.error('No se ha podido conectar con el servidor.', { title: 'Error de conexión' });
```

---

# Título y acción

```ts
const toastRef = this.toastService.show({
  action: { label: 'Deshacer' },
  message: 'La conversación se ha movido al archivo.',
  title: 'Conversación archivada'
});

toastRef.onAction().subscribe(() => this.restoreConversation());
toastRef.afterDismissed().subscribe(reason => console.log(reason)); // 'timeout' | 'close' | 'action' | 'manual' | 'limit'
```

Al pulsar la acción se emite `onAction()` y el toast se cierra con motivo `'action'`.

---

# Duración

```ts
this.toastService.info('Me voy en 2 segundos.', { duration: 2000 });
this.toastService.warning('No me cierro solo.', { duration: 0 });
this.toastService.success('Sin barra de progreso.', { showProgress: false });
this.toastService.dismissAll();
```

---

# Cerrar por código

```ts
const uploadingToastRef = this.toastService.show({ dismissible: false, duration: 0, message: 'Subiendo archivo…' });

this.filesService.upload(file).subscribe(() => {
  uploadingToastRef.dismiss();
  this.toastService.success('Archivo subido.');
});
```

---

# Configuración global

```ts
// app.config.ts
import { provideAesyToastConfig } from 'aesy-components';

export const appConfig: ApplicationConfig = {
  providers: [provideAesyToastConfig({ position: 'top-center', duration: 4000, maxVisible: 3 })]
};
```

```ts
// En caliente
this.toastService.configure({ position: 'bottom-left' });
```

| Campo | Tipo | Defecto |
|---|---|---|
| `position` | `ToastPosition` | `'bottom-right'` (`'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'`) |
| `duration` | `number` | `5000` |
| `maxVisible` | `number` | `4`. Al superarlo se cierra el más antiguo (motivo `'limit'`). |
| `showProgress` | `boolean` | `true` |
| `closeButtonAriaLabel` | `string` | `'Cerrar notificación'` |
| `containerAriaLabel` | `string` | `'Notificaciones'` |

---

# Con un diálogo abierto

El contenedor es un popover manual, así que está en la capa superior del navegador. Si se lanza un toast con un diálogo modal abierto, el contenedor se vuelve a mostrar para quedar por encima del fondo del diálogo.

Limitaciones del navegador en ese caso: todo lo que está fuera del diálogo modal queda inerte, así que el toast se ve pero no se puede pulsar (se cierra solo al acabar su tiempo); y los toasts que ya estaban en pantalla reinician su animación.

---

# Accesibilidad

- El contenedor es una región `aria-live="polite"` con nombre (`containerAriaLabel`), creada antes del primer toast para que también se anuncie.
- La cuenta atrás se pausa con hover o foco (WCAG 2.2.1). Para mensajes importantes usa `duration: 0`.
- El aspa tiene nombre accesible (`closeButtonAriaLabel`).
- Sin animaciones de entrada y salida con `prefers-reduced-motion: reduce`.

---

# API

## ToastService

| Miembro | Devuelve | Descripción |
|---|---|---|
| `show(options)` | `ToastRef` | Muestra un toast. |
| `success / info / warning / error(message, options?)` | `ToastRef` | Atajos con el tipo puesto. |
| `dismiss(id, reason?)` | `void` | Cierra un toast por su id. |
| `dismissAll()` | `void` | Cierra todos. |
| `configure(config)` | `void` | Cambia la configuración global. |
| `config` | `Signal<ToastGlobalConfig>` | Configuración actual. |

## ToastOptions

| Campo | Tipo | Defecto | Descripción |
|---|---|---|---|
| `message` | `string` | — | Obligatorio. |
| `title` | `string` | `''` | Línea en negrita. |
| `type` | `ToastType` | `'neutral'` | Icono y color. |
| `duration` | `number` | global | 0 = no se cierra solo. |
| `action` | `{ label: string }` | — | Botón de acción. |
| `dismissible` | `boolean` | `true` | Muestra el aspa. |
| `showProgress` | `boolean` | global | Barra de tiempo restante. |
| `cssClass` | `string` | `''` | Clase(s) del toast, para estilos propios (ver CSS Variables). |

## ToastRef

| Miembro | Descripción |
|---|---|
| `id` | Identificador. |
| `dismiss()` | Lo cierra (motivo `'manual'`). |
| `onAction()` | `Observable<void>`: se pulsó la acción. |
| `afterDismissed()` | `Observable<ToastDismissReason>`: emite una vez al cerrarse. |

## Tipos

```ts
export type ToastType = 'neutral' | 'success' | 'info' | 'warning' | 'error';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type ToastDismissReason = 'timeout' | 'close' | 'action' | 'manual' | 'limit';
```

---

# CSS Variables

Se leen con su valor por defecto y se heredan. El contenedor cuelga del `body`, así que se declaran en estilos globales:

- en `:root`, para todos los toasts;
- en una clase propia que pasas con `cssClass`, para solo algunos.

## Por tipo

`{type}` es `neutral`, `success`, `info`, `warning` o `error`. Si no se indican, se usan las generales.

| Variable | Qué cambia | Defecto |
|---|---|---|
| `--aesy-toast-{type}-color` | Icono, botón de acción y barra de progreso | `#4b5563`, `#16a34a`, `#2563eb`, `#d97706`, `#dc2626` |
| `--aesy-toast-{type}-background` | Fondo (admite degradados) | `--aesy-toast-background` |
| `--aesy-toast-{type}-border-color` | Borde | `--aesy-toast-border-color` |
| `--aesy-toast-{type}-text-color` | Mensaje y título | `--aesy-toast-text-color` / `--aesy-toast-title-color` |

Ejemplo: success con todo el fondo verde en toda la aplicación.

```css
:root {
  --aesy-toast-success-background: #16a34a;
  --aesy-toast-success-border-color: transparent;
  --aesy-toast-success-color: #ffffff;
  --aesy-toast-success-text-color: #ffffff;
}
```

Solo para algunos toasts:

```css
.toast-theme-filled {
  --aesy-toast-border-color: transparent;
  --aesy-toast-text-color: #ffffff;
  --aesy-toast-title-color: #ffffff;
  --aesy-toast-success-background: #16a34a;
  --aesy-toast-success-color: #ffffff;
  --aesy-toast-error-background: #dc2626;
  --aesy-toast-error-color: #ffffff;
}
```

```ts
this.toastService.success('Cambios guardados.', { cssClass: 'toast-theme-filled' });
```

El aspa y el fondo de los botones al pasar el ratón parten del color del texto, así que funcionan igual sobre un fondo claro que sobre uno de color.

## Generales

| Variable | Defecto |
|---|---|
| `--aesy-toast-width` | `22rem` |
| `--aesy-toast-offset` | `1rem` (distancia al borde) |
| `--aesy-toast-gap` | `0.75rem` |
| `--aesy-toast-background` | `#ffffff` |
| `--aesy-toast-border-color` | `#e5e7eb` |
| `--aesy-toast-border-radius` | `0.75rem` |
| `--aesy-toast-shadow` | `0 12px 32px -12px rgb(17 24 39 / 0.3)` |
| `--aesy-toast-text-color` | `#374151` |
| `--aesy-toast-title-color` | `#111827` |
| `--aesy-toast-font-size` | `0.875rem` |
| `--aesy-toast-action-color` | el color del tipo |
| `--aesy-toast-close-button-color` | el color del texto (al 60 %) |
| `--aesy-toast-button-background-hover` | el color del texto al 12 % |
| `--aesy-toast-progress-color` | el color del tipo |
| `--aesy-toast-focus-color` | el color del botón |
| `--aesy-toast-transition-duration` | `0.25s` |
