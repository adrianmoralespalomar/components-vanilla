/** Texto en minúsculas y sin tildes, para buscar sin distinguir mayúsculas ni acentos («espana» encuentra «España»). */
export function normalizeSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
