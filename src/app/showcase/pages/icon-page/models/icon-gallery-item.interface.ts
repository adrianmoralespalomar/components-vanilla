import { AesyIconName } from 'aesy-components';

export interface IconGalleryItem {
  /** Nombre de la constante exportada (`AESY_ICON_HOME`). */
  constantName: string;
  /** Descripción en español, también para el buscador. */
  keywords: string;
  name: AesyIconName;
}
