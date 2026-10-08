import { ComponentApi } from '../../../models/component-api.interface';

export const ACCORDION_ITEM_API: ComponentApi = {
  inputs: [
    { name: 'label', type: 'string', defaultValue: "''", description: 'Título de la cabecera. Para un título con HTML, proyecta un elemento con aesyAccordionTitle.' },
    { name: 'description', type: 'string', defaultValue: "''", description: 'Texto secundario junto al título. También se puede proyectar con aesyAccordionDescription.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Impide abrir o cerrar desde la cabecera; el teclado lo salta.' },
    { name: 'togglePosition', type: "AccordionTogglePosition | null", defaultValue: 'null', description: "null = el del acordeón, o 'after' si va suelto." },
    { name: 'hideToggle', type: 'boolean | null', defaultValue: 'null', description: 'null = el del acordeón, o false si va suelto.' },
    { name: 'toggleIconSvg', type: 'string | null', defaultValue: 'null', description: 'null = el del acordeón, o el chevron por defecto.' },
    { name: 'headingLevel', type: 'AccordionHeadingLevel | null', defaultValue: 'null', description: 'null = el del acordeón, o 3 si va suelto.' }
  ],
  models: [{ name: 'expanded', type: 'boolean', defaultValue: 'false', description: 'Abierto o cerrado. Con [(expanded)] lo controlas desde fuera.' }],
  outputs: [
    { name: 'opened', type: 'void', description: 'Se ha abierto (por clic, teclado, código o binding). No se emite en la carga inicial.' },
    { name: 'closed', type: 'void', description: 'Se ha cerrado, también cuando lo cierra el acordeón al abrir otro.' }
  ],
  types: [
    {
      name: 'Contenido proyectado',
      properties: [
        { name: 'contenido por defecto', type: 'ng-content', description: 'Cuerpo del panel.' },
        { name: '[aesyAccordionTitle]', type: 'atributo', description: 'Se añade al título, detrás de label.' },
        { name: '[aesyAccordionDescription]', type: 'atributo', description: 'Se añade a la descripción, detrás de description.' },
        { name: '[aesyAccordionActions]', type: 'atributo', description: 'Fila de acciones al pie del panel, alineada a la derecha.' },
        { name: 'ng-template[aesyAccordionContent]', type: 'directiva', description: 'Contenido diferido: se crea al abrir por primera vez y se conserva. Importa AccordionItemContentDirective.' }
      ]
    },
    {
      name: 'Métodos públicos',
      properties: [
        { name: 'open() / close() / toggle()', type: 'void', description: 'Cambian expanded por código.' },
        { name: 'focusHeader()', type: 'void', description: 'Pone el foco en la cabecera.' }
      ]
    }
  ]
};
