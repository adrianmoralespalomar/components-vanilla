import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CodeLanguage } from '../../models/code-language.type';
import { COPIED_FEEDBACK_DURATION_MS } from '../../models/copied-feedback-duration-ms.const';

@Component({
  selector: 'app-code-block',
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
  readonly language = input<CodeLanguage>('html');

  protected readonly isCopied = signal<boolean>(false);

  protected async onCopyButtonClicked(): Promise<void> {
    await navigator.clipboard.writeText(this.code());
    this.isCopied.set(true);
    setTimeout(() => this.isCopied.set(false), COPIED_FEEDBACK_DURATION_MS);
  }
}
