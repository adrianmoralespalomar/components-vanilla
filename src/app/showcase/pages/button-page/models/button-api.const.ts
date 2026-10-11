import { ComponentApi } from '../../../models/component-api.interface';

export const BUTTON_API: ComponentApi = {
  inputs: [
    { name: 'type', type: "ButtonType ('primary' | 'secondary' | 'tertiary' | 'success' | 'info' | 'warning' | 'danger')", defaultValue: "'primary'", description: 'Variante visual del botón.' },
    { name: 'label', type: 'string | null | undefined', defaultValue: 'null', description: 'Texto del botón. Si existe, tiene prioridad sobre el icono.' },
    { name: 'iconSvg', type: 'string | null | undefined', defaultValue: 'null', description: 'Atributo `d` de un path SVG en un viewBox de 20×20. Solo se muestra si no hay `label`.' },
    { name: 'disabled', type: 'boolean | undefined', defaultValue: 'false', description: 'Deshabilita el botón y aplica los colores de estado deshabilitado.' },
    { name: 'ariaLabel', type: 'string | null', defaultValue: 'null', description: 'Nombre accesible para lectores de pantalla. Imprescindible si el botón solo tiene icono.' },
    { name: 'ariaExpanded', type: 'boolean | null', defaultValue: 'null', description: 'aria-expanded, si el botón abre y cierra algo (un panel, un menú). Con aesySidebarTrigger se pone solo.' },
    { name: 'ariaControls', type: 'string | null', defaultValue: 'null', description: 'aria-controls: id de lo que abre y cierra. Con aesySidebarTrigger se pone solo.' }
  ],
  outputs: [{ name: 'buttonClick', type: 'PointerEvent', description: 'Se emite en cada clic con el evento original. No se emite si el botón está deshabilitado.' }]
};
