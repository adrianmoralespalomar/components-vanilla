import { AESY_ICON_CHART, AESY_ICON_HOME, AESY_ICON_INBOX, AESY_ICON_USERS, SidebarEntry } from 'aesy-components';

export const HOME_SIDEBAR_ENTRIES: SidebarEntry[] = [
  { label: 'Inicio', iconSvg: AESY_ICON_HOME, active: true },
  { label: 'Bandeja de entrada', iconSvg: AESY_ICON_INBOX, badge: 4 },
  {
    label: 'Analítica',
    iconSvg: AESY_ICON_CHART,
    children: [{ label: 'Resumen' }, { label: 'Informes' }]
  },
  { label: 'Equipo', iconSvg: AESY_ICON_USERS }
];
