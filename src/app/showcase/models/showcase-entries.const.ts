import { ShowcaseEntry } from './showcase-entry.interface';

/**
 * Registro de componentes del showcase. Cada entrada genera su ruta, su enlace en la barra lateral
 * y su tarjeta en la landing. Se ordena alfabéticamente por nombre.
 */
export const SHOWCASE_ENTRIES: ShowcaseEntry[] = [
  {
    slug: 'accordion',
    name: 'Accordion',
    selector: 'aesy-accordion',
    description: 'Paneles desplegables con uno o varios abiertos, tres apariencias, contenido diferido y navegación por teclado.',
    loadPage: () => import('../pages/accordion-page/accordion-page.component').then(m => m.AccordionPageComponent)
  },
  {
    slug: 'button',
    name: 'Button',
    selector: 'aesy-button',
    description: 'Botón con siete variantes semánticas, estado deshabilitado e icono SVG opcional.',
    loadPage: () => import('../pages/button-page/button-page.component').then(m => m.ButtonPageComponent)
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    selector: 'aesy-checkbox',
    description: 'Casilla de verificación con estado indeterminado, tamaños y validación integrada con Angular Forms.',
    loadPage: () => import('../pages/checkbox-page/checkbox-page.component').then(m => m.CheckboxPageComponent)
  },
  {
    slug: 'datepicker',
    name: 'Datepicker',
    selector: 'aesy-datepicker',
    description: 'Selector de fecha con calendario propio, formatos configurables, rango de fechas e idioma.',
    loadPage: () => import('../pages/datepicker-page/datepicker-page.component').then(m => m.DatepickerPageComponent)
  },
  {
    slug: 'input-number',
    name: 'Input number',
    selector: 'aesy-input-number',
    description: 'Campo numérico con formato por idioma, control de decimales, prefijo, sufijo y botones de incremento.',
    loadPage: () => import('../pages/input-number-page/input-number-page.component').then(m => m.InputNumberPageComponent)
  },
  {
    slug: 'input-text',
    name: 'Input text',
    selector: 'aesy-input-text',
    description: 'Campo de texto con icono, contador de caracteres y mensajes de validación automáticos.',
    loadPage: () => import('../pages/input-text-page/input-text-page.component').then(m => m.InputTextPageComponent)
  },
  {
    slug: 'radio-button',
    name: 'Radio button',
    selector: 'aesy-radio-button',
    description: 'Grupo de opciones excluyentes en vertical u horizontal, con valores simples u objetos.',
    loadPage: () => import('../pages/radio-button-page/radio-button-page.component').then(m => m.RadioButtonPageComponent)
  },
  {
    slug: 'select',
    name: 'Select',
    selector: 'aesy-select',
    description: 'Desplegable propio con selección simple o múltiple, botón de limpiar y opciones deshabilitadas.',
    loadPage: () => import('../pages/select-page/select-page.component').then(m => m.SelectPageComponent)
  },
  {
    slug: 'table',
    name: 'Table',
    selector: 'aesy-table',
    description: 'Tabla genérica con filtros, ordenación, selección, columnas y filas reordenables y paginación local o por API.',
    isPreviewWide: true,
    loadPage: () => import('../pages/table-page/table-page.component').then(m => m.TablePageComponent)
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    selector: 'aesy-textarea',
    description: 'Texto multilínea con filas, redimensionado, contador de caracteres y validación.',
    loadPage: () => import('../pages/textarea-page/textarea-page.component').then(m => m.TextareaPageComponent)
  }
].sort((entryA: ShowcaseEntry, entryB: ShowcaseEntry) => entryA.name.localeCompare(entryB.name, 'es'));
