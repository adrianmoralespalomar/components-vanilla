import { Pipe, PipeTransform } from '@angular/core';

/** `aesy-button` → `<aesy-button>`. Lo que no es un selector (un servicio como `ToastService`) se deja tal cual. */
@Pipe({ name: 'showcaseSelector' })
export class ShowcaseSelectorPipe implements PipeTransform {
  transform(selector: string): string {
    return selector.includes('-') ? `<${selector}>` : selector;
  }
}
