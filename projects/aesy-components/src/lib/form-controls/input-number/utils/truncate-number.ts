/**
 * Trunca sin redondear.
 *
 * 12.789 -> 12.78
 * 12.781 -> 12.78
 */
export function truncateNumber(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);

  return Math.trunc(value * factor) / factor;
}
