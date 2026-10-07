import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ButtonComponent, ButtonType, CheckboxComponent, InputTextComponent, SelectComponent, SelectOption } from 'aesy-components';
import { ComponentApi } from '../../models/component-api.interface';
import { ApiReferenceComponent } from '../../ui/api-reference/api-reference.component';
import { CodeBlockComponent } from '../../ui/code-block/code-block.component';
import { DocPageComponent } from '../../ui/doc-page/doc-page.component';
import { DocSectionComponent } from '../../ui/doc-section/doc-section.component';
import { ValuePreviewComponent } from '../../ui/value-preview/value-preview.component';
import { BUTTON_API } from './models/button-api.const';
import { BUTTON_ICON_PATHS } from './models/button-icon-paths.const';
import { BUTTON_SNIPPETS } from './models/button-snippets.const';
import { BUTTON_TYPE_OPTIONS } from './models/button-type-options.const';
import { ButtonVariantDoc } from './models/button-variant-doc.interface';
import { BUTTON_VARIANT_DOCS } from './models/button-variant-docs.const';

@Component({
  selector: 'app-button-page',
  imports: [ApiReferenceComponent, ButtonComponent, CheckboxComponent, CodeBlockComponent, DocPageComponent, DocSectionComponent, InputTextComponent, SelectComponent, ValuePreviewComponent],
  templateUrl: './button-page.component.html',
  styleUrl: './button-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonPageComponent {
  protected readonly API: ComponentApi = BUTTON_API;
  protected readonly ICON_PATHS = BUTTON_ICON_PATHS;
  protected readonly SNIPPETS = BUTTON_SNIPPETS;
  protected readonly TYPE_OPTIONS: SelectOption[] = BUTTON_TYPE_OPTIONS;
  protected readonly VARIANT_DOCS: ButtonVariantDoc[] = BUTTON_VARIANT_DOCS;

  protected readonly isPlaygroundDisabled = signal<boolean>(false);
  protected readonly lastClickSummary = signal<string>('Pulsa el botón para ver el evento');
  protected readonly lastPlaygroundEvent = signal<string>('ninguno');
  protected readonly playgroundLabel = signal<string>('Guardar cambios');
  protected readonly playgroundType = signal<ButtonType>('primary');

  protected readonly playgroundCode = computed<string>(() => {
    const codeLines: string[] = ['<aesy-button'];
    if (this.playgroundType() !== 'primary') codeLines.push(`  type="${this.playgroundType()}"`);
    codeLines.push(`  label="${this.playgroundLabel()}"`);
    if (this.isPlaygroundDisabled()) codeLines.push('  [disabled]="true"');
    codeLines.push('  (buttonClick)="onSaveButtonClicked($event)" />');
    return codeLines.join('\n');
  });

  protected onEventsDemoButtonClicked(event: PointerEvent): void {
    this.lastClickSummary.set(`${event.type} · x: ${Math.round(event.clientX)}, y: ${Math.round(event.clientY)} · pointerType: ${event.pointerType || 'desconocido'}`);
  }

  protected onPlaygroundButtonClicked(): void {
    this.lastPlaygroundEvent.set(`buttonClick · ${this.playgroundType()} · ${new Date().toLocaleTimeString('es-ES')}`);
  }
}
