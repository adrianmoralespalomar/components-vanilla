import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ShowcaseEntry } from '../../models/showcase-entry.interface';
import { findShowcaseEntry } from '../../utils/find-showcase-entry';

@Component({
  selector: 'app-doc-page',
  templateUrl: './doc-page.component.html',
  styleUrl: './doc-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocPageComponent {
  readonly slug = input.required<string>();

  protected readonly entry = computed<ShowcaseEntry | undefined>(() => findShowcaseEntry(this.slug()));
}
