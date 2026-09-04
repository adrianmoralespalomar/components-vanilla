import { getLocaleSeparators } from './get-locale-separators';

/**
 * Convierte el texto visual a number.
 *
 * Ejemplos con es-ES:
 *
 * "1.234,56" -> 1234.56
 * "1234,56"  -> 1234.56
 * "1234"     -> 1234
 */
export function parseNumberValue(value: string, locale: string, allowNegative: boolean): number | null {
  if (!value?.trim()) {
    return null;
  }

  let normalized = value.trim();

  const { decimalSeparator, groupingSeparator } = getLocaleSeparators(locale);

  // Eliminar espacios normales y espacios no separables.
  normalized = normalized
    .replace(/\s/g, '')
    .replace(/\u00A0/g, '')
    .replace(/\u202F/g, '');

  // Eliminar separador de miles del locale.
  if (groupingSeparator) {
    normalized = normalized.split(groupingSeparator).join('');
  }

  // Convertir separador decimal del locale a punto.
  if (decimalSeparator !== '.') {
    normalized = normalized.split(decimalSeparator).join('.');
  }

  // Permitimos también "." y "," como separadores decimales
  // cuando el usuario los introduce manualmente.
  if (decimalSeparator === ',' && !normalized.includes('.') && value.includes('.')) {
    normalized = normalized.replace(',', '.');
  }

  if (!allowNegative) {
    normalized = normalized.replace(/-/g, '');
  }

  // Dejar únicamente caracteres válidos.
  normalized = normalized.replace(/[^\d.-]/g, '');

  // Evitar múltiples puntos.
  const firstDot = normalized.indexOf('.');

  if (firstDot !== -1) {
    normalized = normalized.substring(0, firstDot + 1) + normalized.substring(firstDot + 1).replace(/\./g, '');
  }

  // Evitar múltiples signos negativos.
  if (normalized.includes('-')) {
    normalized = (normalized.startsWith('-') ? '-' : '') + normalized.replace(/-/g, '');
  }

  if (normalized === '' || normalized === '-' || normalized === '.') {
    return null;
  }

  const result = Number(normalized);

  return Number.isFinite(result) ? result : null;
}
