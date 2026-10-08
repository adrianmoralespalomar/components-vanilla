import { ComponentApi } from '../../../models/component-api.interface';

export const ACCORDION_API: ComponentApi = {
  inputs: [
    { name: 'multi', type: 'boolean', defaultValue: 'false', description: 'Permite tener varios ítems abiertos a la vez. Sin multi, abrir uno cierra el resto.' },
    { name: 'appearance', type: "AccordionAppearance ('joined' | 'separated' | 'flat')", defaultValue: "'joined'", description: 'Aspecto del grupo: un bloque con separadores, tarjetas independientes o solo separadores.' },
    { name: 'togglePosition', type: "AccordionTogglePosition ('before' | 'after')", defaultValue: "'after'", description: 'Icono de abrir/cerrar delante o detrás del título. Cada ítem puede sobrescribirlo.' },
    { name: 'hideToggle', type: 'boolean', defaultValue: 'false', description: 'Oculta el icono de abrir/cerrar. Cada ítem puede sobrescribirlo.' },
    { name: 'toggleIconSvg', type: 'string | null', defaultValue: 'null (chevron)', description: 'Path SVG (viewBox 20×20) del icono. Cada ítem puede sobrescribirlo.' },
    { name: 'headingLevel', type: 'AccordionHeadingLevel (1-6)', defaultValue: '3', description: 'aria-level de las cabeceras. Cada ítem puede sobrescribirlo.' }
  ],
  types: [
    {
      name: 'Métodos públicos',
      properties: [
        { name: 'openAll()', type: 'void', description: 'Abre todos los ítems habilitados. Solo funciona con multi.' },
        { name: 'closeAll()', type: 'void', description: 'Cierra todos los ítems.' }
      ]
    }
  ]
};
