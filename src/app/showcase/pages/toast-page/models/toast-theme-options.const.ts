import { RadioButtonOption } from 'aesy-components';

/** El valor es la cssClass que se pasa al toast. Las clases están en src/styles.css. */
export const TOAST_THEME_OPTIONS: RadioButtonOption[] = [
  { label: 'Por defecto', value: '' },
  { label: 'Rellenos', value: 'toast-theme-filled' },
  { label: 'Suaves', value: 'toast-theme-soft' },
  { label: 'Oscuro', value: 'toast-theme-dark' },
  { label: 'Marca', value: 'toast-theme-brand' }
];
