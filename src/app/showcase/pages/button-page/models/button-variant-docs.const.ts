import { ButtonVariantDoc } from './button-variant-doc.interface';

export const BUTTON_VARIANT_DOCS: ButtonVariantDoc[] = [
  { type: 'primary', usage: 'Acción neutra o principal sobre fondo claro.' },
  { type: 'secondary', usage: 'Acción importante con fondo oscuro.' },
  { type: 'tertiary', usage: 'Acciones auxiliares o de menor peso.' },
  { type: 'success', usage: 'Confirmar o completar con éxito.' },
  { type: 'info', usage: 'Acciones informativas o de consulta.' },
  { type: 'warning', usage: 'Acciones que piden precaución.' },
  { type: 'danger', usage: 'Acciones destructivas o irreversibles.' }
];
