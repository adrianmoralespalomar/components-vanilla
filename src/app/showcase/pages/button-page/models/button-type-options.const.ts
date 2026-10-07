import { SelectOption } from 'aesy-components';
import { BUTTON_VARIANT_DOCS } from './button-variant-docs.const';

export const BUTTON_TYPE_OPTIONS: SelectOption[] = BUTTON_VARIANT_DOCS.map(variant => ({ label: variant.type, value: variant.type }));
