import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AesyIconName } from './models/aesy-icon-name.type';
import { AESY_ICONS } from './models/aesy-icons.const';

/**
 * Icono del set de aesy-components. Toma el color del texto (`currentColor`) y por defecto es decorativo
 * (`aria-hidden`); con `ariaLabel` se anuncia como imagen.
 *
 * ```html
 * <aesy-icon name="home" />
 * <aesy-icon name="warning" size="2rem" ariaLabel="Aviso" />
 * ```
 */
@Component({
  selector: 'aesy-icon',
  template: `
    <svg viewBox="0 0 20 20" focusable="false" [attr.aria-hidden]="ariaLabel() ? null : 'true'" [attr.aria-label]="ariaLabel()" [attr.role]="ariaLabel() ? 'img' : null">
      <path [attr.d]="path()" />
    </svg>
  `,
  styleUrl: './icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.--aesy-icon-size]': 'size()' }
})
export class IconComponent {
  /** Nombre accesible. Sin él, el icono es decorativo y los lectores de pantalla lo ignoran. */
  readonly ariaLabel = input<string | null>(null);
  readonly name = input.required<AesyIconName>();
  /** Alto y ancho (cualquier longitud CSS). null = `--aesy-icon-size` (1.25rem). */
  readonly size = input<string | null>(null);

  protected readonly path = computed<string>(() => AESY_ICONS[this.name()]);
}
