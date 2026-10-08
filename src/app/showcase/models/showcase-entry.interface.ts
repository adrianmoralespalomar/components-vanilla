import { Type } from '@angular/core';

export interface ShowcaseEntry {
  description: string;
  isPreviewWide?: boolean;
  loadPage: () => Promise<Type<unknown>>;
  name: string;
  /** Selector del componente, o nombre del servicio si se usa desde código (ToastService). */
  selector: string;
  slug: string;
}
