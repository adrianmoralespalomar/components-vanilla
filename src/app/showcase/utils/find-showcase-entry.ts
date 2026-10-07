import { SHOWCASE_ENTRIES } from '../models/showcase-entries.const';
import { ShowcaseEntry } from '../models/showcase-entry.interface';

export function findShowcaseEntry(slug: string): ShowcaseEntry | undefined {
  return SHOWCASE_ENTRIES.find(entry => entry.slug === slug);
}
