import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DocSection } from '../../models/doc-section.interface';
import { SHOWCASE_ENTRIES } from '../../models/showcase-entries.const';
import { ShowcaseEntry } from '../../models/showcase-entry.interface';
import { DocTocService } from '../../services/doc-toc.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  private readonly docTocService = inject(DocTocService);

  protected readonly SHOWCASE_ENTRIES: ShowcaseEntry[] = SHOWCASE_ENTRIES;

  protected readonly activeSectionId = this.docTocService.activeSectionId;
  protected readonly exampleSections = computed<DocSection[]>(() => this.docTocService.sections().filter(section => section.group === 'examples'));
  protected readonly isMenuOpen = signal<boolean>(false);
  protected readonly referenceSections = computed<DocSection[]>(() => this.docTocService.sections().filter(section => section.group === 'reference'));

  protected onMenuToggleButtonClicked(): void {
    this.isMenuOpen.update(isOpen => !isOpen);
  }

  protected onNavigationLinkClicked(): void {
    this.isMenuOpen.set(false);
  }
}
