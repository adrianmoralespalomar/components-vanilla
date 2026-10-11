import { ComponentApi } from '../../../models/component-api.interface';

export const ICON_API: ComponentApi = {
  inputs: [
    { name: 'name', type: 'AesyIconName', description: 'Obligatorio. Nombre del icono: el que aparece en la galería (home, chevron-down, check-circle…).' },
    { name: 'size', type: 'string | null', defaultValue: 'null (1.25rem)', description: 'Alto y ancho, cualquier longitud CSS. Equivale a --aesy-icon-size, que también se hereda.' },
    { name: 'ariaLabel', type: 'string | null', defaultValue: 'null', description: 'Nombre accesible. Sin él el icono es decorativo (aria-hidden); con él se anuncia como imagen (role="img").' }
  ],
  types: [
    {
      name: 'Exportaciones',
      properties: [
        { name: 'AESY_ICON_<NOMBRE>', type: 'string', description: 'Una constante por icono con su path SVG (AESY_ICON_HOME, AESY_ICON_CHEVRON_DOWN…). Para iconSvg de button, sidebar, accordion, stepper… Solo entra en tu bundle lo que importes.' },
        { name: 'AESY_ICONS', type: 'Record<AesyIconName, string>', description: 'Todos los paths por nombre. Útil para elegir el icono en tiempo de ejecución; incluye el set completo en el bundle.' },
        { name: 'AesyIconName', type: 'type', description: "Unión de los nombres: 'bell' | 'calendar' | … | 'x-circle'." }
      ]
    },
    {
      name: 'Formato',
      properties: [
        { name: 'viewBox', type: '0 0 20 20', description: 'Todos los iconos se dibujan en 20×20 con un único path relleno (fill), sin trazos.' },
        { name: 'color', type: 'currentColor', description: 'Toman el color del texto: cámbialo con color en el icono o en su contenedor.' }
      ]
    }
  ]
};
