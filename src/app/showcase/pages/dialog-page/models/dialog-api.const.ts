import { ComponentApi } from '../../../models/component-api.interface';

export const DIALOG_API: ComponentApi = {
  inputs: [
    { name: 'title', type: 'string', defaultValue: "''", description: 'Título de la cabecera y nombre accesible del diálogo. Para HTML propio, proyecta un elemento con aesyDialogTitle.' },
    { name: 'size', type: "DialogSize ('small' | 'medium' | 'large' | 'fullscreen')", defaultValue: "'medium'", description: 'Ancho del diálogo.' },
    { name: 'role', type: "DialogRole ('dialog' | 'alertdialog')", defaultValue: "'dialog'", description: 'alertdialog para avisos que exigen respuesta.' },
    { name: 'closeOnBackdropClick', type: 'boolean', defaultValue: 'true', description: 'Cerrar al pulsar fuera del panel.' },
    { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Cerrar con Escape.' },
    { name: 'showCloseButton', type: 'boolean', defaultValue: 'true', description: 'Aspa de cerrar en la cabecera.' },
    { name: 'closeButtonAriaLabel', type: 'string', defaultValue: "'Cerrar'", description: 'Nombre accesible del aspa.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Nombre accesible cuando no hay title.' }
  ],
  models: [{ name: 'open', type: 'boolean', defaultValue: 'false', description: 'Abierto o cerrado. [(open)] para abrirlo y saber cuándo se cierra.' }],
  outputs: [
    { name: 'opened', type: 'void', description: 'Se ha abierto.' },
    { name: 'closed', type: 'unknown', description: 'Se ha cerrado, con el valor pasado a close(result). undefined si se cerró con Escape, el fondo o el aspa.' }
  ],
  types: [
    {
      name: 'Métodos públicos',
      properties: [{ name: 'close(result?)', type: 'void', description: 'Cierra el diálogo; result llega en closed.' }]
    },
    {
      name: 'Contenido proyectado',
      properties: [
        { name: 'contenido por defecto', type: 'ng-content', description: 'Cuerpo del diálogo (hace scroll si no cabe).' },
        { name: 'aesy-dialog-actions', type: 'DialogActionsComponent', description: 'Fila de botones fija al pie.' },
        { name: '[aesyDialogTitle]', type: 'atributo', description: 'Se añade al título, detrás de title.' }
      ]
    }
  ]
};
