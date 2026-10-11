import { AESY_ICON_HOME, AESY_ICON_STAR, SidebarEntry } from 'aesy-components';
import { SHOWCASE_ENTRIES } from '../../../models/showcase-entries.const';

/** Enlaces reales del showcase: el de esta página sale activo solo, por la ruta. */
export const SIDEBAR_NAVIGATION_ENTRIES: SidebarEntry[] = [
  { label: 'Inicio', iconSvg: AESY_ICON_HOME, link: '/', linkActiveExact: true },
  {
    label: 'Componentes',
    items: SHOWCASE_ENTRIES.map(showcaseEntry => ({ label: showcaseEntry.name, link: ['/components', showcaseEntry.slug] }))
  },
  {
    label: 'Enlaces',
    items: [{ label: 'Repositorio en GitHub', iconSvg: AESY_ICON_STAR, href: 'https://github.com/adrianmoralespalomar/components-vanilla', target: '_blank' }]
  }
];
