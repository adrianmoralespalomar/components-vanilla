import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-value-preview',
  imports: [JsonPipe],
  template: `<span class="value-preview-label">{{ label() }}</span><code class="value-preview-value">{{ value() | json }}</code>`,
  styleUrl: './value-preview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValuePreviewComponent {
  readonly label = input<string>('Valor');
  readonly value = input<unknown>(null);
}
