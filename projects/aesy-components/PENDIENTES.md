# Pendientes de la librería

Lista de problemas y mejoras detectados en `aesy-components`. Marca cada punto al resolverlo.

## Comportamiento

- [ ] **Tabla con `draggableRows` en local:** solo reordena los datos originales si no hay filtro ni orden activos (está documentado). Valorar resolverlo o desactivar el arrastre mientras haya filtro u orden.
- [ ] **Tabla sin "seleccionar todo":** con `selectable` solo hay casilla por fila. Añadir una casilla en la cabecera (con estado indeterminado) que seleccione las filas visibles o todas.

## Documentación

- [ ] Los `.md` de los componentes no se incluyen en el paquete de npm (solo se copian el tema y el README), así que los enlaces del README a ellos solo funcionan en el repositorio. Valorar añadirlos a `assets` en `ng-package.json` o enlazar a un showcase publicado.

## Publicación en npm

- [ ] **`peerDependencies` incompletas** en `projects/aesy-components/package.json`:
  - [ ] Añadir `@angular/forms` (lo usan casi todos los controles).
  - [ ] `@angular/router`: lo usa la tabla (`persistFilters` escribe query params). Añadirlo como peer o quitar esa dependencia de la tabla (por ejemplo, inyectarlo de forma opcional o delegar la persistencia en quien la use).
- [ ] Borrar `src/lib/aesy-components.ts` (componente de plantilla del CLI que no se usa).
- [ ] Metadatos del `package.json`: `description`, `license`, `repository`, `keywords`, `author`.
- [ ] Añadir fichero `LICENSE`.
- [ ] Comprobar si el nombre `aesy-components` está libre en npm (`npm view aesy-components`); si no, usar un scope (`@usuario/aesy-components`).
- [ ] Revisar el rango de `peerDependencies` (`^22.1.0`) si se quiere usar en proyectos con otras versiones de Angular.
- [ ] Tests: solo hay specs de `button` y `table`. Cubrir al menos los controles de formulario y el acordeón (apertura simple y `multi`, `opened`/`closed`, teclado, contenido diferido).
- [ ] Revisar textos fijos en español dentro de los componentes (mensajes de validación por defecto, placeholders, paginación) por si se quiere internacionalizar.

## Hecho

- [x] Selectores unificados con `aesy-`: `aesy-datepicker`, `aesy-input-number`, `aesy-input-text`, `aesy-radio-button`, `aesy-textarea` (también los ids generados y los `.md`). **Cambio incompatible** para quien usara los antiguos `app-*`.
- [x] Variables CSS del checkbox renombradas de `--checkbox-*` a `--aesy-checkbox-*`. **Cambio incompatible** para quien las sobrescribiera.
- [x] Tipos exportados en `public-api.ts`: `ButtonType`, `InputTextType`, `IconPosition` (compartido por input-text e input-number), `TextareaResize`, `RadioButtonOption` (fichero renombrado a `radio-button-option.interface.ts`), `RowOrderChange<T>` y `PaginationMetaRowsPerPage`.
- [x] `TableComponent` acepta filas tipadas con `interface`: la restricción pasa de `T extends Record<string, unknown>` a `T extends object` y el acceso por clave en texto queda en `getCellValue`. Quitado también el genérico sin uso de `TablePaginationComponent`.
- [x] Tabla en modo local: la primera pintada mostraba todas las filas sin paginar hasta el primer filtro, orden o cambio de página.
- [x] Checkbox indeterminado: no se veía (marca blanca sobre fondo blanco) y el input nativo no recibía `indeterminate`.
- [x] Textarea: `field-sizing: content` anulaba `rows`; ahora `rows` es la altura mínima.
- [x] Checkbox: eliminado un `console.log('CLICK', …)` olvidado.
- [x] Documentación de los `.md` existentes corregida: quitado el input `size`, que no existe en select, input-text, input-number ni radio-button; imports desde `'aesy-components'`; añadidos `showSelectedIcon`, `textAlign` y el output `selectValueChanged` al select y `textAlign` al input-text; variables CSS del radio reescritas con las reales. `RadioButton.md` renombrado a `RadioButtonComponent.md`.
- [x] Nuevos `.md` para Button, Checkbox, Datepicker, Textarea y Table.
- [x] README de la librería reescrito: componentes, instalación, peers, tema CSS, uso con y sin Angular Forms, tipos exportados y desarrollo.
- [x] Checkbox integrado con `NgControl` como el resto de controles: detecta `Validators.required` y `Validators.requiredTrue` (asterisco) y muestra el error al tocarlo, con el mensaje automático o `errorMessage`. `hasRequiredValidator` reconoce ahora también `requiredTrue`.
- [x] Tabla en modo local: reacciona a los cambios de `data` (carga asíncrona, altas, bajas) y de `paginationMetaConfig`, conservando filtros, orden y página. Documentado que no emite `requestData`.
- [x] Tabla: `selectable.selectedValues` no se usaba y la selección iba por referencia de objeto. Ahora se guarda por `selectable.key`, respeta `selectedValues` y sobrevive a que `data` traiga objetos nuevos.
- [x] Button: input `ariaLabel` para botones de solo icono; el SVG del icono va con `aria-hidden`.
- [x] Tabla: la cabecera de la columna de selección ya no muestra el texto fijo `Pick`; queda vacía y se puede configurar con `selectable.headerLabel`.
- [x] Tabla en modo servidor: `selectionChange` devuelve las filas seleccionadas de todas las páginas, no solo de la cargada (se guardan al marcarlas). Las de `selectedValues` se incorporan al llegar su página.
- [x] Paginación de la tabla: los botones de solo icono tienen `ariaLabel` ("Primera página", "Página anterior"…); si llevan texto, se usa el texto.
