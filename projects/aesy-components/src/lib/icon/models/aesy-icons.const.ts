import { AESY_ICON_BELL } from './icon-paths/aesy-icon-bell.const';
import { AESY_ICON_CALENDAR } from './icon-paths/aesy-icon-calendar.const';
import { AESY_ICON_CARD } from './icon-paths/aesy-icon-card.const';
import { AESY_ICON_CART } from './icon-paths/aesy-icon-cart.const';
import { AESY_ICON_CHART } from './icon-paths/aesy-icon-chart.const';
import { AESY_ICON_CHAT } from './icon-paths/aesy-icon-chat.const';
import { AESY_ICON_CHECK } from './icon-paths/aesy-icon-check.const';
import { AESY_ICON_CHECK_CIRCLE } from './icon-paths/aesy-icon-check-circle.const';
import { AESY_ICON_CHEVRON_DOWN } from './icon-paths/aesy-icon-chevron-down.const';
import { AESY_ICON_CHEVRON_LEFT } from './icon-paths/aesy-icon-chevron-left.const';
import { AESY_ICON_CHEVRON_RIGHT } from './icon-paths/aesy-icon-chevron-right.const';
import { AESY_ICON_CHEVRON_UP } from './icon-paths/aesy-icon-chevron-up.const';
import { AESY_ICON_CHEVRONS_LEFT } from './icon-paths/aesy-icon-chevrons-left.const';
import { AESY_ICON_CHEVRONS_RIGHT } from './icon-paths/aesy-icon-chevrons-right.const';
import { AESY_ICON_CLOSE } from './icon-paths/aesy-icon-close.const';
import { AESY_ICON_COPY } from './icon-paths/aesy-icon-copy.const';
import { AESY_ICON_DOWNLOAD } from './icon-paths/aesy-icon-download.const';
import { AESY_ICON_EDIT } from './icon-paths/aesy-icon-edit.const';
import { AESY_ICON_EXCLAMATION } from './icon-paths/aesy-icon-exclamation.const';
import { AESY_ICON_FOLDER } from './icon-paths/aesy-icon-folder.const';
import { AESY_ICON_HEART } from './icon-paths/aesy-icon-heart.const';
import { AESY_ICON_HOME } from './icon-paths/aesy-icon-home.const';
import { AESY_ICON_INBOX } from './icon-paths/aesy-icon-inbox.const';
import { AESY_ICON_INFO_CIRCLE } from './icon-paths/aesy-icon-info-circle.const';
import { AESY_ICON_LOCK } from './icon-paths/aesy-icon-lock.const';
import { AESY_ICON_MAIL } from './icon-paths/aesy-icon-mail.const';
import { AESY_ICON_MENU } from './icon-paths/aesy-icon-menu.const';
import { AESY_ICON_MINUS } from './icon-paths/aesy-icon-minus.const';
import { AESY_ICON_MORE_VERTICAL } from './icon-paths/aesy-icon-more-vertical.const';
import { AESY_ICON_PLUS } from './icon-paths/aesy-icon-plus.const';
import { AESY_ICON_SEARCH } from './icon-paths/aesy-icon-search.const';
import { AESY_ICON_SIDEBAR } from './icon-paths/aesy-icon-sidebar.const';
import { AESY_ICON_SLIDERS } from './icon-paths/aesy-icon-sliders.const';
import { AESY_ICON_STAR } from './icon-paths/aesy-icon-star.const';
import { AESY_ICON_TRASH } from './icon-paths/aesy-icon-trash.const';
import { AESY_ICON_TRUCK } from './icon-paths/aesy-icon-truck.const';
import { AESY_ICON_USER } from './icon-paths/aesy-icon-user.const';
import { AESY_ICON_USERS } from './icon-paths/aesy-icon-users.const';
import { AESY_ICON_WARNING } from './icon-paths/aesy-icon-warning.const';
import { AESY_ICON_X_CIRCLE } from './icon-paths/aesy-icon-x-circle.const';

/**
 * Todos los iconos de aesy-components por nombre (paths SVG en un viewBox de 20×20). Lo usa `aesy-icon`.
 * Si solo necesitas alguno, importa su constante (`AESY_ICON_HOME`…): así el resto no entra en tu bundle.
 */
export const AESY_ICONS = {
  bell: AESY_ICON_BELL,
  calendar: AESY_ICON_CALENDAR,
  card: AESY_ICON_CARD,
  cart: AESY_ICON_CART,
  chart: AESY_ICON_CHART,
  chat: AESY_ICON_CHAT,
  check: AESY_ICON_CHECK,
  'check-circle': AESY_ICON_CHECK_CIRCLE,
  'chevron-down': AESY_ICON_CHEVRON_DOWN,
  'chevron-left': AESY_ICON_CHEVRON_LEFT,
  'chevron-right': AESY_ICON_CHEVRON_RIGHT,
  'chevron-up': AESY_ICON_CHEVRON_UP,
  'chevrons-left': AESY_ICON_CHEVRONS_LEFT,
  'chevrons-right': AESY_ICON_CHEVRONS_RIGHT,
  close: AESY_ICON_CLOSE,
  copy: AESY_ICON_COPY,
  download: AESY_ICON_DOWNLOAD,
  edit: AESY_ICON_EDIT,
  exclamation: AESY_ICON_EXCLAMATION,
  folder: AESY_ICON_FOLDER,
  heart: AESY_ICON_HEART,
  home: AESY_ICON_HOME,
  inbox: AESY_ICON_INBOX,
  'info-circle': AESY_ICON_INFO_CIRCLE,
  lock: AESY_ICON_LOCK,
  mail: AESY_ICON_MAIL,
  menu: AESY_ICON_MENU,
  minus: AESY_ICON_MINUS,
  'more-vertical': AESY_ICON_MORE_VERTICAL,
  plus: AESY_ICON_PLUS,
  search: AESY_ICON_SEARCH,
  sidebar: AESY_ICON_SIDEBAR,
  sliders: AESY_ICON_SLIDERS,
  star: AESY_ICON_STAR,
  trash: AESY_ICON_TRASH,
  truck: AESY_ICON_TRUCK,
  user: AESY_ICON_USER,
  users: AESY_ICON_USERS,
  warning: AESY_ICON_WARNING,
  'x-circle': AESY_ICON_X_CIRCLE
} as const;
