import { AESY_ICON_BELL, AESY_ICON_CALENDAR, AESY_ICON_CARD, AESY_ICON_CART, AESY_ICON_CHART, AESY_ICON_FOLDER, AESY_ICON_HOME, AESY_ICON_INBOX, AESY_ICON_SEARCH, AESY_ICON_STAR, AESY_ICON_USERS, SidebarEntry } from 'aesy-components';

/** Menú por datos de las demos: grupos con badges y submenús. Los ítems son acciones (llevan `id`, no `link`). */
export const SIDEBAR_DEMO_ENTRIES: SidebarEntry[] = [
  {
    label: 'Navegación',
    items: [
      { id: 'inicio', label: 'Inicio', iconSvg: AESY_ICON_HOME },
      { id: 'bandeja', label: 'Bandeja de entrada', iconSvg: AESY_ICON_INBOX, badge: 12 },
      { id: 'buscar', label: 'Buscar', iconSvg: AESY_ICON_SEARCH },
      { id: 'avisos', label: 'Avisos', iconSvg: AESY_ICON_BELL, badge: 3 }
    ]
  },
  {
    label: 'Proyectos',
    items: [
      {
        label: 'Analítica',
        iconSvg: AESY_ICON_CHART,
        children: [
          { id: 'resumen', label: 'Resumen' },
          { id: 'informes', label: 'Informes' },
          { id: 'tiempo-real', label: 'Tiempo real' }
        ]
      },
      { id: 'equipo', label: 'Equipo', iconSvg: AESY_ICON_USERS },
      { id: 'calendario', label: 'Calendario', iconSvg: AESY_ICON_CALENDAR },
      {
        label: 'Documentos',
        iconSvg: AESY_ICON_FOLDER,
        children: [
          { id: 'compartidos', label: 'Compartidos' },
          { id: 'privados', label: 'Privados' },
          { id: 'archivados', label: 'Archivados', disabled: true }
        ]
      }
    ]
  },
  {
    label: 'Facturación',
    items: [
      { id: 'pagos', label: 'Pagos', iconSvg: AESY_ICON_CARD },
      { id: 'pedidos', label: 'Pedidos', iconSvg: AESY_ICON_CART },
      { id: 'suscripciones', label: 'Suscripciones', iconSvg: AESY_ICON_STAR }
    ]
  }
];
