import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeSnippetBlock } from '../../models/code-snippet-block.interface';
import { DocSectionGroup } from '../../models/doc-section-group.type';
import { DocSectionVariant } from '../../models/doc-section-variant.type';
import { DocSnippet } from '../../models/doc-snippet.interface';
import { SNIPPET_LANGUAGES_ORDER } from '../../models/snippet-languages-order.const';
import { DocTocService } from '../../services/doc-toc.service';
import { CodeBlockComponent } from '../code-block/code-block.component';

@Component({
  selector: 'app-doc-section',
  imports: [CodeBlockComponent, RouterLink],
  templateUrl: './doc-section.component.html',
  styleUrl: './doc-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.id]': 'sectionId()' }
})
export class DocSectionComponent implements OnInit, OnDestroy {
  readonly description = input<string>('');
  readonly group = input<DocSectionGroup>('examples');
  readonly heading = input.required<string>();
  readonly sectionId = input.required<string>();
  readonly snippet = input<DocSnippet | null>(null);
  readonly variant = input<DocSectionVariant>('card');

  private readonly docTocService = inject(DocTocService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly isCodeVisible = signal<boolean>(false);
  protected readonly snippetBlocks = computed<CodeSnippetBlock[]>(() => {
    const snippet = this.snippet();
    if (!snippet) return [];
    return SNIPPET_LANGUAGES_ORDER.flatMap(language => {
      const code = snippet[language];
      return code ? [{ code, language }] : [];
    });
  });

  ngOnInit(): void {
    this.docTocService.register({ group: this.group(), id: this.sectionId(), title: this.heading() }, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.docTocService.unregister(this.elementRef.nativeElement);
  }

  protected onToggleCodeButtonClicked(): void {
    this.isCodeVisible.update(isVisible => !isVisible);
  }
}
