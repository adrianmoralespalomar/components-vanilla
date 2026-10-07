import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonType } from './models/button-type.type';

@Component({
  selector: 'aesy-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  /** Nombre accesible. Imprescindible si el botón solo tiene icono; con `label` no hace falta. */
  readonly ariaLabel = input<string | null>(null);
  readonly disabled = input<boolean | undefined>(false);
  readonly label = input<string | null | undefined>(null);
  readonly iconSvg = input<string | null | undefined>(null);
  readonly type = input<ButtonType>('primary');
  buttonClick = output<PointerEvent>();
}
