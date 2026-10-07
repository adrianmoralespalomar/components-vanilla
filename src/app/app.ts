import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './showcase/layout/sidebar/sidebar.component';
import { MOBILE_LAYOUT_MAX_WIDTH_PX } from './showcase/models/mobile-layout-max-width-px.const';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="showcase-layout">
      <app-sidebar class="showcase-sidebar" />
      <main class="showcase-main">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './app.css'
})
export class App {
  private readonly viewportScroller = inject(ViewportScroller);

  constructor() {
    // Deja hueco para la barra superior fija en móvil al saltar a un apartado del índice
    this.viewportScroller.setOffset(() => [0, window.innerWidth <= MOBILE_LAYOUT_MAX_WIDTH_PX ? 88 : 24]);
  }
}
