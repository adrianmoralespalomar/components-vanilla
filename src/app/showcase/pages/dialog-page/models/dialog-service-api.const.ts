import { ComponentApi } from '../../../models/component-api.interface';

export const DIALOG_SERVICE_API: ComponentApi = {
  types: [
    {
      name: 'DialogService',
      properties: [{ name: 'open(component, config?)', type: 'DialogRef<TResult>', description: 'Abre un aesy-dialog con el componente dentro. Se destruye solo al cerrarse.' }]
    },
    {
      name: 'DialogConfig<TData>',
      properties: [
        { name: 'data', type: 'TData', description: 'Datos para el componente: inject(AESY_DIALOG_DATA).' },
        { name: 'title, size, role', type: '…', description: 'Igual que los inputs de aesy-dialog.' },
        { name: 'closeOnBackdropClick, closeOnEscape', type: 'boolean', description: 'Igual que los inputs de aesy-dialog.' },
        { name: 'showCloseButton, closeButtonAriaLabel, ariaLabel', type: '…', description: 'Igual que los inputs de aesy-dialog.' },
        { name: 'injector', type: 'Injector', description: 'Injector padre del componente (por defecto, el raíz).' }
      ]
    },
    {
      name: 'DialogRef<TResult>',
      properties: [
        { name: 'close(result?)', type: 'void', description: 'Cierra el diálogo. Desde el componente: inject(DialogRef).close(true).' },
        { name: 'afterClosed()', type: 'Observable<TResult | undefined>', description: 'Emite una vez al cerrarse y termina.' }
      ]
    }
  ]
};
