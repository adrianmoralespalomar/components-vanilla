import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AESY_ICONS, ButtonComponent, IconComponent, InputTextComponent, RadioButtonComponent, RadioButtonOption, StepComponent, StepperComponent } from 'aesy-components';
import { ComponentApi } from '../../models/component-api.interface';
import { ApiReferenceComponent } from '../../ui/api-reference/api-reference.component';
import { CodeBlockComponent } from '../../ui/code-block/code-block.component';
import { DocPageComponent } from '../../ui/doc-page/doc-page.component';
import { DocSectionComponent } from '../../ui/doc-section/doc-section.component';
import { ICON_API } from './models/icon-api.const';
import { IconGalleryItem } from './models/icon-gallery-item.interface';
import { ICON_GALLERY_ITEMS } from './models/icon-gallery-items.const';
import { ICON_GALLERY_SIZE_OPTIONS } from './models/icon-gallery-size-options.const';
import { ICON_SNIPPETS } from './models/icon-snippets.const';

@Component({
  selector: 'app-icon-page',
  imports: [ApiReferenceComponent, ButtonComponent, CodeBlockComponent, DocPageComponent, DocSectionComponent, IconComponent, InputTextComponent, RadioButtonComponent, StepComponent, StepperComponent],
  templateUrl: './icon-page.component.html',
  styleUrl: './icon-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconPageComponent {
  private readonly document = inject(DOCUMENT);

  protected readonly ICON_API: ComponentApi = ICON_API;
  protected readonly ICONS = AESY_ICONS;
  protected readonly SIZE_OPTIONS: RadioButtonOption[] = ICON_GALLERY_SIZE_OPTIONS;
  protected readonly SNIPPETS = ICON_SNIPPETS;

  protected readonly previewColor = signal<string>('#12141a');
  protected readonly previewSizePx = signal<number>(24);
  protected readonly searchText = signal<string>('');
  protected readonly selectedItem = signal<IconGalleryItem>(ICON_GALLERY_ITEMS.find(item => item.name === 'home') ?? ICON_GALLERY_ITEMS[0]);

  protected readonly filteredItems = computed<IconGalleryItem[]>(() => {
    const normalizedSearchText = this.normalizeText(this.searchText());
    if (!normalizedSearchText) return ICON_GALLERY_ITEMS;
    return ICON_GALLERY_ITEMS.filter(item => this.normalizeText(`${item.name} ${item.keywords}`).includes(normalizedSearchText));
  });
  protected readonly selectedComponentCode = computed<string>(() => `<aesy-icon name="${this.selectedItem().name}" />`);
  protected readonly selectedConstantCode = computed<string>(() => {
    const { constantName } = this.selectedItem();
    return `import { ${constantName} } from 'aesy-components';\n\nprotected readonly ${constantName}: string = ${constantName};\n\n// <aesy-button ariaLabel="…" [iconSvg]="${constantName}" />`;
  });
  protected readonly selectedSvgCode = computed<string>(() => {
    const sizePx = this.previewSizePx();
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="${sizePx}" height="${sizePx}" fill="${this.previewColor()}"><path d="${AESY_ICONS[this.selectedItem().name]}"/></svg>`;
  });

  /** Minúsculas y sin tildes, para buscar «cancion» y encontrar «canción». */
  private normalizeText(text: string): string {
    return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  protected onColorInputChanged(event: Event): void {
    this.previewColor.set((event.target as HTMLInputElement).value);
  }

  protected onIconTileClicked(item: IconGalleryItem): void {
    this.selectedItem.set(item);
  }

  protected onDownloadSvgButtonClicked(): void {
    const svgUrl = URL.createObjectURL(new Blob([this.selectedSvgCode()], { type: 'image/svg+xml' }));
    const downloadLink = this.document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${this.selectedItem().name}.svg`;
    downloadLink.click();
    URL.revokeObjectURL(svgUrl);
  }
}
