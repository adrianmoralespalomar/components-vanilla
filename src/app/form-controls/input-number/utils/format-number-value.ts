import { NumberFormatOptions } from '../models/number-format-options.interface';
import { truncateNumber } from './truncate-number';

/**
 * Formatea un número según locale.
 *
 * El valor recibido y devuelto internamente sigue siendo number.
 * Esta función solo genera el texto visual.
 */
export function formatNumberValue(value: number | null, options: NumberFormatOptions): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '';
  }

  let valueToFormat = value;

  if (options.roundingMode === 'truncate') {
    valueToFormat = truncateNumber(valueToFormat, options.maxFractionDigits);
  }

  const formatter = new Intl.NumberFormat(options.locale, {
    useGrouping: options.useGrouping,
    minimumFractionDigits: options.minFractionDigits,
    maximumFractionDigits: options.maxFractionDigits
  });

  return formatter.format(valueToFormat);
}
