/**
 * Obtiene los separadores del locale.
 */
export function getLocaleSeparators(locale: string): {
  decimalSeparator: string;
  groupingSeparator: string;
} {
  const parts = new Intl.NumberFormat(locale).formatToParts(1234567.89);

  return {
    decimalSeparator: parts.find(part => part.type === 'decimal')?.value ?? '.',

    groupingSeparator: parts.find(part => part.type === 'group')?.value ?? ','
  };
}
