import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'aesy-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  readonly disabled = input<boolean | undefined>(false);
  readonly label = input<string | null | undefined>(null);
  readonly iconSvg = input<string | null | undefined>(null);
  readonly type = input<'primary' | 'secondary' | 'tertiary' | 'success' | 'info' | 'warning' | 'danger'>('primary');
  buttonClick = output<PointerEvent>();
}
