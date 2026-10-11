import { DocSnippet } from '../../../models/doc-snippet.interface';

export const SIDEBAR_SNIPPETS = {
  basic: {
    ts: `import {
  AESY_ICON_CHART,
  AESY_ICON_HOME,
  AESY_ICON_INBOX,
  AESY_ICON_MENU,
  ButtonComponent,
  SidebarComponent,
  SidebarEntry,
  SidebarItem,
  SidebarItemComponent,
  SidebarLayoutComponent,
  SidebarMainComponent,
  SidebarTriggerDirective
} from 'aesy-components';

@Component({
  imports: [ButtonComponent, SidebarComponent, SidebarItemComponent, SidebarLayoutComponent, SidebarMainComponent, SidebarTriggerDirective]
})
export class AppShellComponent {
  protected readonly AESY_ICON_MENU: string = AESY_ICON_MENU;
  protected readonly MENU_ENTRIES: SidebarEntry[] = [
    {
      label: 'Navegación',
      items: [
        { id: 'inicio', label: 'Inicio', iconSvg: AESY_ICON_HOME },
        { id: 'bandeja', label: 'Bandeja de entrada', iconSvg: AESY_ICON_INBOX, badge: 12 }
      ]
    },
    {
      label: 'Proyectos',
      items: [
        {
          label: 'Analítica',
          iconSvg: AESY_ICON_CHART,
          children: [
            { id: 'resumen', label: 'Resumen' },
            { id: 'informes', label: 'Informes' }
          ]
        }
      ]
    }
  ];

  protected onMenuItemClicked(item: SidebarItem): void {
    console.log(item.id);
  }
}`,
    html: `<aesy-sidebar-layout>
  <aesy-sidebar #nav [items]="MENU_ENTRIES" (itemClick)="onMenuItemClicked($event)">
    <aesy-sidebar-item aesySidebarHeader label="Acme Inc">
      <span class="logo" aesySidebarItemIcon>A</span>
    </aesy-sidebar-item>
    <aesy-sidebar-item aesySidebarFooter label="Juan Díaz">
      <span class="avatar" aesySidebarItemIcon>JD</span>
    </aesy-sidebar-item>
  </aesy-sidebar>

  <aesy-sidebar-main>
    <header>
      <aesy-button ariaLabel="Mostrar u ocultar el menú" [iconSvg]="AESY_ICON_MENU" [aesySidebarTrigger]="nav" />
    </header>
    <router-outlet />
  </aesy-sidebar-main>
</aesy-sidebar-layout>`
  },
  variants: {
    html: `<aesy-sidebar
  variant="inset"
  collapsible="icon"
  side="left"
  [overlay]="false"
  [openOnHover]="false"
  [backdrop]="false"
  [rail]="true"
  [items]="MENU_ENTRIES" />

<!-- Anchos (o --aesy-sidebar-width y --aesy-sidebar-icon-width en CSS) -->
<aesy-sidebar width="18rem" iconWidth="4rem" [items]="MENU_ENTRIES" />`
  },
  manual: {
    ts: `import { InputTextComponent, SidebarGroupComponent, SidebarItemComponent } from 'aesy-components';`,
    html: `<aesy-sidebar #nav variant="floating">
  <aesy-sidebar-item aesySidebarHeader label="Acme Inc">
    <span class="logo" aesySidebarItemIcon>A</span>
  </aesy-sidebar-item>

  <aesy-input-text class="menu-search" placeholder="Buscar…" ariaLabel="Buscar en el menú" />

  <aesy-sidebar-group label="General">
    <aesy-sidebar-item label="Inicio" [iconSvg]="AESY_ICON_HOME" link="/" [linkActiveExact]="true" />
    <aesy-sidebar-item label="Bandeja de entrada" badge="5" [iconSvg]="AESY_ICON_INBOX" link="/bandeja" />

    <!-- Ítems dentro de un ítem: submenú -->
    <aesy-sidebar-item label="Analítica" [iconSvg]="AESY_ICON_CHART">
      <aesy-sidebar-item label="Resumen" link="/analitica/resumen" />
      <aesy-sidebar-item label="Informes" link="/analitica/informes" />
    </aesy-sidebar-item>
  </aesy-sidebar-group>

  <aesy-sidebar-group label="Equipo">
    <aesy-sidebar-item label="Lucía Martín" (itemClick)="openChat('lucia')">
      <span class="avatar" aesySidebarItemIcon>LM</span>
    </aesy-sidebar-item>
  </aesy-sidebar-group>

  <div class="menu-promo">…</div>

  <aesy-sidebar-item aesySidebarFooter label="Ajustes" [iconSvg]="AESY_ICON_SLIDERS" link="/ajustes" />
</aesy-sidebar>`,
    css: `/* Plegado a iconos, oculta lo que no es un ítem */
aesy-sidebar[data-state='collapsed'] {
  .menu-search,
  .menu-promo {
    display: none;
  }
}`
  },
  router: {
    ts: `import { SidebarEntry } from 'aesy-components';

protected readonly MENU_ENTRIES: SidebarEntry[] = [
  { label: 'Inicio', iconSvg: AESY_ICON_HOME, link: '/', linkActiveExact: true },
  {
    label: 'Componentes',
    items: [
      { label: 'Accordion', link: ['/components', 'accordion'] },
      { label: 'Button', link: ['/components', 'button'] }
    ]
  },
  {
    label: 'Enlaces',
    items: [{ label: 'Repositorio en GitHub', iconSvg: AESY_ICON_STAR, href: 'https://github.com/…', target: '_blank' }]
  }
];

// Con query params o fragmento, pasa un UrlTree:
// { label: 'Pendientes', link: this.router.createUrlTree(['/tareas'], { queryParams: { estado: 'pendiente' } }) }`,
    html: `<aesy-sidebar [items]="MENU_ENTRIES" />`
  },
  nested: {
    ts: `protected readonly FILE_ENTRIES: SidebarEntry[] = [
  {
    label: 'Archivos',
    items: [
      {
        label: 'Documentos',
        iconSvg: AESY_ICON_FOLDER,
        children: [
          {
            label: 'Trabajo',
            children: [
              { label: 'Proyectos', children: [{ label: 'Informe T1', link: '/archivos/informe-t1' }] },
              { label: 'Facturas', link: '/archivos/facturas' }
            ]
          },
          { label: 'Personal', expanded: true, children: [{ label: 'Recetas', link: '/archivos/recetas' }] }
        ]
      }
    ]
  }
];`,
    html: `<aesy-sidebar [items]="FILE_ENTRIES" />`
  },
  controlled: {
    ts: `protected readonly isMenuOpen = signal<boolean>(true);`,
    html: `<aesy-checkbox label="open" [(value)]="isMenuOpen" />
<aesy-button label="toggle()" (buttonClick)="nav.toggle()" />

<aesy-sidebar #nav collapsible="offcanvas" [items]="MENU_ENTRIES" [(open)]="isMenuOpen" />`
  },
  dual: {
    html: `<aesy-sidebar-layout>
  <aesy-sidebar #nav [items]="MENU_ENTRIES" [open]="false" />

  <aesy-sidebar-main>
    <header>
      <aesy-button ariaLabel="Mostrar u ocultar el menú" [iconSvg]="AESY_ICON_MENU" [aesySidebarTrigger]="nav" />
      <aesy-button ariaLabel="Avisos" [iconSvg]="AESY_ICON_BELL" [aesySidebarTrigger]="notifications" />
    </header>
    …
  </aesy-sidebar-main>

  <aesy-sidebar
    #notifications
    side="right"
    collapsible="offcanvas"
    width="18rem"
    ariaLabel="Avisos"
    [overlay]="true"
    [backdrop]="true"
    [(open)]="isNotificationsPanelOpen">
    <div aesySidebarHeader>Avisos</div>
    <ul>…</ul>
    <aesy-button aesySidebarFooter label="Marcar todo como leído" (buttonClick)="notifications.hide()" />
  </aesy-sidebar>
</aesy-sidebar-layout>`
  },
  mobile: {
    html: `<!-- Por debajo de 1024 px de ventana: oculto, por encima del contenido y con fondo oscuro -->
<aesy-sidebar [mobileBreakpoint]="1024" [items]="MENU_ENTRIES" />`
  },
  theming: {
    css: `.dark-sidebar {
  --aesy-sidebar-background: #111827;
  --aesy-sidebar-badge-background: #f59e0b;
  --aesy-sidebar-badge-color: #111827;
  --aesy-sidebar-border-color: #1f2937;
  --aesy-sidebar-focus-color: #a5b4fc;
  --aesy-sidebar-item-active-background: #312e81;
  --aesy-sidebar-item-active-color: #e0e7ff;
  --aesy-sidebar-item-background-hover: #1f2937;
  --aesy-sidebar-item-border-radius: 999px;
  --aesy-sidebar-item-icon-color: #9ca3af;
  --aesy-sidebar-scrollbar-color: #374151;
  --aesy-sidebar-submenu-border-color: #374151;
  --aesy-sidebar-text-color: #e5e7eb;
  --aesy-sidebar-width: 15rem;
}

/* Todas las variables y su valor por defecto:
  Tamaños
  --aesy-sidebar-width: 16rem;
  --aesy-sidebar-icon-width: 3.5rem;
  --aesy-sidebar-padding: 0.5rem;
  --aesy-sidebar-gap: 0.5rem;                 (hueco de floating e inset)
  --aesy-sidebar-content-gap: 0.5rem;         (entre grupos)
  --aesy-sidebar-layout-height: 100dvh;

  Panel
  --aesy-sidebar-background: #ffffff;
  --aesy-sidebar-text-color: #374151;
  --aesy-sidebar-border-color: #e5e7eb;
  --aesy-sidebar-overlay-shadow: 0 10px 30px rgb(17 24 39 / 0.12);
  --aesy-sidebar-floating-border-radius: 0.75rem;
  --aesy-sidebar-floating-shadow: 0 4px 16px rgb(17 24 39 / 0.08);
  --aesy-sidebar-inset-background: #f4f4f5;
  --aesy-sidebar-z-index: 20;

  Ítems
  --aesy-sidebar-item-height: 2.25rem;
  --aesy-sidebar-item-border-radius: 0.5rem;
  --aesy-sidebar-item-gap: 0.625rem;
  --aesy-sidebar-item-spacing: 0.125rem;
  --aesy-sidebar-item-font-size: 0.875rem;
  --aesy-sidebar-item-font-weight: 500;
  --aesy-sidebar-item-color: inherit;
  --aesy-sidebar-item-icon-size: 1.125rem;
  --aesy-sidebar-item-icon-color: #6b7280;
  --aesy-sidebar-item-background-hover: #f3f4f6;
  --aesy-sidebar-item-active-background: #eef2ff;
  --aesy-sidebar-item-active-color: #4338ca;
  --aesy-sidebar-item-active-font-weight: 600;
  --aesy-sidebar-subitem-height: 2rem;
  --aesy-sidebar-subitem-font-weight: 400;
  --aesy-sidebar-submenu-border-color: #e5e7eb;
  --aesy-sidebar-badge-background: #4f46e5;
  --aesy-sidebar-badge-color: #ffffff;
  --aesy-sidebar-badge-font-size: 0.75rem;
  --aesy-sidebar-disabled-color: #9ca3af;
  --aesy-sidebar-focus-color: #3b82f6;

  Grupos
  --aesy-sidebar-group-label-color: #6b7280;
  --aesy-sidebar-group-label-font-size: 0.75rem;
  --aesy-sidebar-group-label-font-weight: 500;
  --aesy-sidebar-group-label-height: 2rem;

  Layout y contenido
  --aesy-sidebar-layout-background: transparent;
  --aesy-sidebar-backdrop-background: rgb(17 24 39 / 0.4);
  --aesy-sidebar-main-background: #ffffff;
  --aesy-sidebar-main-inset-border-color: #e5e7eb;
  --aesy-sidebar-main-inset-border-radius: 0.75rem;
  --aesy-sidebar-main-inset-shadow: 0 1px 3px rgb(17 24 39 / 0.06);
  --aesy-sidebar-rail-color: #d1d5db;
  --aesy-sidebar-scrollbar-color: #d1d5db;
  --aesy-sidebar-transition-duration: 0.2s;
*/`,
    html: `<aesy-sidebar class="dark-sidebar" [items]="MENU_ENTRIES" />`
  }
} satisfies Record<string, DocSnippet>;
