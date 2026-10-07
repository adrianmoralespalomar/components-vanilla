# ComponentsVanilla

Librería de componentes Angular (`projects/aesy-components`) y un showcase (`src/app`) para probarlos: una landing con una vista previa en vivo de cada componente y una página de documentación por componente con ejemplos, código y API.

## Arrancar el showcase

```bash
npm run debugapp
```

Compila la librería en modo watch y, cuando termina, lanza `ng serve`, así los cambios en la librería se ven sin reiniciar nada. Necesita las dependencias de desarrollo `concurrently` y `wait-on` (ya están en `package.json`).

## Crear un componente nuevo (checklist)

Ejemplo con un componente `Badge`. Sustituye `badge` / `Badge` por el tuyo.

### 1. En la librería (`projects/aesy-components/src/lib`)

- [ ] Crea la carpeta del componente:
  - Controles de formulario → `lib/form-controls/badge/`
  - Resto → `lib/badge/`
- [ ] Ficheros: `badge.component.ts`, `badge.component.html`, `badge.component.css`.
- [ ] Selector con prefijo `aesy-` (`aesy-badge`), standalone, `ChangeDetectionStrategy.OnPush` e inputs con `input()` / `model()` / `output()`.
- [ ] Variables CSS en `:host` con prefijo `--aesy-badge-` para todo lo personalizable (colores, radios, espaciados).
- [ ] Si es un control de formulario: implementa `ControlValueAccessor`, usa las variables comunes `--aesy-form-controls-*` de `lib/form-controls/theme/` y los utils de `form-controls/shared/utils` (`getValidationErrorMessage`, `hasRequiredValidator`), igual que `input-text` o `select`.
- [ ] Interfaces y tipos en `lib/badge/models/` (`badge-variant.type.ts`, `badge-option.interface.ts`…).
- [ ] Exporta en `projects/aesy-components/src/public-api.ts` el componente **y** sus tipos/interfaces públicos (si no, quien use la librería no podrá tiparlos).
- [ ] Opcional: documentación técnica en `lib/badge/BadgeComponent.md`, como los demás.

Con `npm run debugapp` en marcha la librería se recompila sola. Si no, `npm run generate-lib`.

### 2. Registrarlo en el showcase

- [ ] Añade su entrada en `src/app/showcase/models/showcase-entries.const.ts`. Con esto ya aparece en la barra lateral (en orden alfabético), en la landing y tiene su ruta `/components/badge`:

  ```ts
  {
    slug: 'badge',
    name: 'Badge',
    selector: 'aesy-badge',
    description: 'Etiqueta corta para estados y contadores.',
    loadPage: () => import('../pages/badge-page/badge-page.component').then(m => m.BadgePageComponent)
  },
  ```

### 3. Crear su página de documentación (`src/app/showcase/pages/badge-page/`)

- [ ] `models/badge-api.const.ts`: inputs, models, outputs y tipos (`ComponentApi`). Copia la estructura de `select-page/models/select-api.const.ts`.
- [ ] `models/badge-snippets.const.ts`: el código de cada ejemplo (`ts`, `html`, `css`), con `satisfies Record<string, DocSnippet>`.
- [ ] `badge-page.component.ts`: importa `DocPageComponent`, `DocSectionComponent`, `ApiReferenceComponent` (y `ValuePreviewComponent` si quieres enseñar el valor) y expón `API` y `SNIPPETS`.
- [ ] `badge-page.component.html`: una `app-doc-section` por caso de uso. El índice de la barra lateral se genera solo a partir de ellas, en el orden en que las escribas:

  ```html
  <app-doc-page slug="badge">
    <!-- Ejemplos: tarjeta con la demo dentro y botón "Ver código" -->
    <app-doc-section sectionId="basico" heading="Básico" description="…" [snippet]="SNIPPETS.basic">
      <aesy-badge label="Nuevo" />
    </app-doc-section>

    <!-- Referencia: sin tarjeta, el código se muestra siempre -->
    <app-doc-section sectionId="personalizacion" heading="Personalización" group="reference" variant="plain" [snippet]="SNIPPETS.theming" />
    <app-doc-section sectionId="api" heading="API" group="reference" variant="plain">
      <app-api-reference [api]="API" />
    </app-doc-section>
  </app-doc-page>
  ```

  Orden recomendado (el mismo en todas las páginas): básico → variantes/opciones → estados (deshabilitado, solo lectura) → ayuda y errores → Reactive Forms → Personalización → API.

- [ ] Para avisos sobre el componente (algo que aún no soporta), añade en `app-doc-page` un `<p class="demo-note" docPageNotes>…</p>`.
- [ ] Para maquetar las demos tienes clases globales en `src/styles.css`: `demo-row`, `demo-grid`, `demo-stack`, `demo-narrow`, `demo-caption`, `demo-note`.

### 4. Vista previa en la landing (opcional)

- [ ] Añade un `@case ('badge') { … }` en `src/app/showcase/pages/home/home.component.html` e importa el componente en `home.component.ts`. Si no lo haces, la tarjeta sale igualmente con el texto "aún no tiene vista previa". Si la demo necesita todo el ancho (como la tabla), pon `isPreviewWide: true` en su entrada.

### 5. Comprobar

- [ ] `npm run debugapp` y revisa `/` y `/components/badge` en escritorio y en móvil.
- [ ] `npm run build` para confirmar que la librería y la app compilan en producción.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
