export interface NumberFormatOptions {
  locale: string;
  useGrouping: boolean;
  minFractionDigits: number;
  maxFractionDigits: number;
  roundingMode: 'round' | 'truncate';
}
