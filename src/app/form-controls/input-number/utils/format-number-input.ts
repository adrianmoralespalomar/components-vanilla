import { DynamicNumberFormatOptions, DynamicNumberFormatResult } from '../models/dynamic-number-format-options.interface';
import { getLocaleSeparators } from './get-locale-separators';
import { parseNumberValue } from './parse-number-value';

/**
 * Formatea el texto mientras el usuario está escribiendo.
 *
 * A diferencia de formatNumberValue(), NO redondea.
 *
 * Ejemplo es-ES:
 *
 * "3444,57" -> "3.444,57"
 * "33444,57" -> "33.444,57"
 */
export function formatNumberInput(text: string, cursorPosition: number, options: DynamicNumberFormatOptions): DynamicNumberFormatResult {
  const { decimalSeparator, groupingSeparator } = getLocaleSeparators(options.locale);

  const beforeCursor = text.substring(0, cursorPosition);

  const normalized = normalizeInputText(text, decimalSeparator, groupingSeparator, options.allowNegative);

  const normalizedBeforeCursor = normalizeInputText(beforeCursor, decimalSeparator, groupingSeparator, options.allowNegative);

  if (!normalized) {
    return {
      text: '',
      value: null,
      cursorPosition: 0,
      exceedsSafeInteger: false
    };
  }

  const negative = normalized.startsWith('-');
  const unsignedValue = negative ? normalized.substring(1) : normalized;

  const hasDecimalSeparator = unsignedValue.includes('.');

  let [integerPart = '', fractionPart = ''] = unsignedValue.split('.');

  /*
   * Comprobamos el límite seguro de Number
   */
  const integerDigits = integerPart.replace(/\D/g, '');

  const exceedsSafeInteger = integerDigits.length > String(Number.MAX_SAFE_INTEGER).length || (integerDigits.length === String(Number.MAX_SAFE_INTEGER).length && BigInt(integerDigits) > BigInt(Number.MAX_SAFE_INTEGER));

  if (exceedsSafeInteger) {
    return {
      text,
      value: null,
      cursorPosition,
      exceedsSafeInteger: true
    };
  }

  /*
   * Nunca permitimos más decimales de los configurados.
   */
  fractionPart = fractionPart.substring(0, Math.max(0, options.maxFractionDigits));

  /*
   * Si no hay parte entera, usamos 0.
   */
  if (!integerPart) {
    integerPart = '0';
  }

  const integerNumber = Number(integerPart);

  if (!Number.isFinite(integerNumber)) {
    integerPart = '0';
  } else {
    integerPart = new Intl.NumberFormat(options.locale, {
      useGrouping: options.useGrouping,
      maximumFractionDigits: 0
    }).format(integerNumber);
  }

  let formatted = integerPart;

  if (hasDecimalSeparator && options.maxFractionDigits > 0) {
    formatted += decimalSeparator;
    formatted += fractionPart;
  }

  if (negative && options.allowNegative) {
    formatted = `-${formatted}`;
  }

  /*
   * Calculamos dónde debe quedar el cursor.
   */
  const significantCharactersBeforeCursor = getSignificantCharacterCount(normalizedBeforeCursor, decimalSeparator);

  const newCursorPosition = getCursorPosition(formatted, significantCharactersBeforeCursor, decimalSeparator);

  const value = parseNumberValue(formatted, options.locale, options.allowNegative);

  return {
    text: formatted,
    value,
    cursorPosition: newCursorPosition,
    exceedsSafeInteger: false
  };
}

function normalizeInputText(text: string, decimalSeparator: string, groupingSeparator: string, allowNegative: boolean): string {
  if (!text) {
    return '';
  }

  let normalized = text
    .replace(/\s/g, '')
    .replace(/\u00A0/g, '')
    .replace(/\u202F/g, '');

  if (groupingSeparator) {
    normalized = normalized.split(groupingSeparator).join('');
  }

  /**
   * Permitimos que el usuario escriba tanto el separador
   * decimal del locale como ".".
   */
  if (decimalSeparator !== '.') {
    normalized = normalized.split(decimalSeparator).join('.');
  }

  normalized = normalized.replace(/[^\d.-]/g, '');

  /**
   * Solo permitimos un punto decimal.
   */
  const firstDot = normalized.indexOf('.');

  if (firstDot !== -1) {
    normalized = normalized.substring(0, firstDot + 1) + normalized.substring(firstDot + 1).replace(/\./g, '');
  }

  /**
   * Solo permitimos un signo negativo y únicamente
   * al principio.
   */
  if (allowNegative && normalized.includes('-')) {
    normalized = (normalized.startsWith('-') ? '-' : '') + normalized.replace(/-/g, '');
  } else {
    normalized = normalized.replace(/-/g, '');
  }

  return normalized;
}

function getSignificantCharacterCount(value: string, decimalSeparator: string): number {
  return [...value].filter(character => {
    return /\d/.test(character) || character === '-' || character === decimalSeparator || character === '.';
  }).length;
}

function getCursorPosition(formatted: string, significantCharacterCount: number, decimalSeparator: string): number {
  if (significantCharacterCount <= 0) {
    return 0;
  }

  let count = 0;

  for (let index = 0; index < formatted.length; index++) {
    const character = formatted[index];

    if (/\d/.test(character) || character === '-' || character === decimalSeparator) {
      count++;
    }

    if (count >= significantCharacterCount) {
      return index + 1;
    }
  }

  return formatted.length;
}
