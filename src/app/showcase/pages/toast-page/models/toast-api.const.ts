import { ComponentApi } from '../../../models/component-api.interface';

export const TOAST_API: ComponentApi = {
  types: [
    {
      name: 'ToastService',
      properties: [
        { name: 'show(options)', type: 'ToastRef', description: 'Muestra un toast. Solo message es obligatorio.' },
        { name: 'success / info / warning / error(message, options?)', type: 'ToastRef', description: 'Atajos con el tipo ya puesto.' },
        { name: 'dismiss(id, reason?)', type: 'void', description: 'Cierra un toast por su id (ToastRef.id).' },
        { name: 'dismissAll()', type: 'void', description: 'Cierra todos.' },
        { name: 'configure(config)', type: 'void', description: 'Cambia la configuración global en caliente.' },
        { name: 'config', type: 'Signal<ToastGlobalConfig>', description: 'Configuración global actual.' }
      ]
    },
    {
      name: 'ToastOptions',
      properties: [
        { name: 'message', type: 'string', description: 'Texto del toast (obligatorio).' },
        { name: 'title', type: 'string', description: 'Línea en negrita encima del mensaje.' },
        { name: 'type', type: "ToastType ('neutral' | 'success' | 'info' | 'warning' | 'error')", description: "Icono y color. Por defecto 'neutral'." },
        { name: 'duration', type: 'number', description: 'Milisegundos hasta cerrarse solo; 0 = no se cierra solo. Por defecto, el global (5000).' },
        { name: 'action', type: '{ label: string }', description: 'Botón de acción: emite ToastRef.onAction() y cierra el toast.' },
        { name: 'dismissible', type: 'boolean', description: 'Muestra el aspa. Por defecto, true.' },
        { name: 'showProgress', type: 'boolean', description: 'Barra de tiempo restante. Por defecto, el global (true).' },
        { name: 'cssClass', type: 'string', description: 'Clase(s) del toast, para darle estilo propio con variables --aesy-toast-* en tus estilos globales.' }
      ]
    },
    {
      name: 'ToastRef',
      properties: [
        { name: 'id', type: 'number', description: 'Identificador del toast.' },
        { name: 'dismiss()', type: 'void', description: 'Lo cierra (motivo manual).' },
        { name: 'onAction()', type: 'Observable<void>', description: 'Emite si se pulsa la acción.' },
        { name: 'afterDismissed()', type: 'Observable<ToastDismissReason>', description: "Emite una vez al cerrarse: 'timeout' | 'close' | 'action' | 'manual' | 'limit'." }
      ]
    },
    {
      name: 'ToastGlobalConfig (provideAesyToastConfig / configure)',
      properties: [
        { name: 'position', type: 'ToastPosition', description: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'. Por defecto 'bottom-right'." },
        { name: 'duration', type: 'number', description: 'Duración por defecto. 5000.' },
        { name: 'maxVisible', type: 'number', description: 'Máximo a la vez; al superarlo se cierra el más antiguo. 4.' },
        { name: 'showProgress', type: 'boolean', description: 'Barra de progreso por defecto. true.' },
        { name: 'closeButtonAriaLabel', type: 'string', description: "Nombre accesible del aspa. 'Cerrar notificación'." },
        { name: 'containerAriaLabel', type: 'string', description: "Nombre de la región. 'Notificaciones'." }
      ]
    }
  ]
};
