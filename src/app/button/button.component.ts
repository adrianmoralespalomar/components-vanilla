import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  readonly label = input<string>('');
  readonly type = input<'primary' | 'secondary' | 'tertiary' | 'success' | 'info' | 'warning' | 'danger'>('primary');
  readonly disabled = input<boolean>(false);
  buttonClick = output<PointerEvent>();
}
