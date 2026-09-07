export interface DynamicNumberFormatOptions {
  locale: string;
  useGrouping: boolean;
  maxFractionDigits: number;
  allowNegative: boolean;
}

export interface DynamicNumberFormatResult {
  text: string;
  value: number | null;
  cursorPosition: number;
  exceedsSafeInteger: boolean;
}
