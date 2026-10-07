import { Type } from '@angular/core';

export interface ShowcaseEntry {
  description: string;
  isPreviewWide?: boolean;
  loadPage: () => Promise<Type<unknown>>;
  name: string;
  selector: string;
  slug: string;
}
