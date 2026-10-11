import { RadioButtonOption, SelectOption } from 'aesy-components';

/** Opciones de los controles del playground de variantes. */
export const SIDEBAR_PLAYGROUND_OPTIONS: { collapsible: SelectOption[]; side: RadioButtonOption[]; variant: SelectOption[] } = {
  collapsible: [
    { label: 'icon', value: 'icon' },
    { label: 'offcanvas', value: 'offcanvas' },
    { label: 'none', value: 'none' }
  ],
  side: [
    { label: 'left', value: 'left' },
    { label: 'right', value: 'right' }
  ],
  variant: [
    { label: 'standard', value: 'standard' },
    { label: 'floating', value: 'floating' },
    { label: 'inset', value: 'inset' }
  ]
};
