import { ComponentApi } from '../../../models/component-api.interface';

export const SIDEBAR_TRIGGER_API: ComponentApi = {
  inputs: [
    {
      name: 'aesySidebarTrigger',
      type: "SidebarComponent | ''",
      defaultValue: "''",
      description: 'Sidebar que abre y cierra (una referencia #nav). Sin valor: el sidebar que lo contiene o, si no, el primero de aesy-sidebar-layout. Añade aria-controls y aria-expanded (en aesy-button, al botón de dentro).'
    }
  ]
};
