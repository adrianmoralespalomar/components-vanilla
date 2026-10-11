import { RadioButtonOption } from 'aesy-components';

/** Tamaños (px) para previsualizar los iconos de la galería. */
export const ICON_GALLERY_SIZE_OPTIONS: RadioButtonOption[] = [16, 20, 24, 32, 48].map(sizePx => ({ label: `${sizePx}`, value: sizePx }));
