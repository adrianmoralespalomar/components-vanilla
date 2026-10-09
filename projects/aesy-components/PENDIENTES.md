# Pendientes de la librería

Lista de problemas y mejoras detectados en `aesy-components`. Marca cada punto al resolverlo.

## Comportamiento

- [ ] **Tabla con `draggableRows` en local:** solo reordena los datos originales si no hay filtro ni orden activos (está documentado). Valorar resolverlo o desactivar el arrastre mientras haya filtro u orden.
- [ ] **Tabla sin "seleccionar todo":** con `selectable` solo hay casilla por fila. Añadir una casilla en la cabecera (con estado indeterminado) que seleccione las filas visibles o todas.

## Diálogo y toasts

- [ ] Toasts con un diálogo modal abierto: se ven por encima, pero no se pueden pulsar (el navegador deja inerte todo lo que está fuera del diálogo) y los que ya estaban reinician su animación al recolocarse delante. Valorar mostrar el contenedor dentro del diálogo abierto.
- [ ] Revisar textos fijos en español (`'Cerrar'`, `'Cerrar notificación'`, `'Notificaciones'`) junto con el resto de i18n.

## Documentación

- [ ] Los `.md` de los componentes no se incluyen en el paquete de npm (solo se copian el tema y el README), así que los enlaces del README a ellos solo funcionan en el repositorio. Valorar añadirlos a `assets` en `ng-package.json` o enlazar a un showcase publicado.

## Publicación en npm

- [ ] Cuando salga Angular 23: probar la librería en un proyecto con esa versión y añadir `^23.0.0` a `peerDependencies`. El repositorio sigue en la versión mínima admitida (20) para compilarla.
- [ ] Tests con vitest 3 (el que admite Angular 20): `npm audit` avisa de vulnerabilidades en vitest/tinypool. Solo afectan al entorno de tests local, no al paquete publicado.
- [ ] Tests: solo hay specs de `button` y `table` (la tabla cubre celdas personalizadas, columnas `custom`, tabla sin paginación y `requestData` sin paginación). Cubrir al menos los controles de formulario, el acordeón (apertura simple y `multi`, `opened`/`closed`, teclado, contenido diferido) el stepper (modo lineal con `stepControl`, opcional/no editable, `reset`, orientación, teclado), el diálogo (`open`/`close(result)`, Escape y fondo, `DialogService` y `afterClosed`) y los toasts (temporizador con pausa, `maxVisible`, `onAction`/`afterDismissed`).
- [ ] Revisar textos fijos en español dentro de los componentes (mensajes de validación por defecto, placeholders, paginación) por si se quiere internacionalizar.

## Hecho

- [x] Tabla: celdas personalizadas con `ng-template[aesyTableCell]` (con `aesyTableCellRows` para que la fila llegue tipada), columnas `type: 'custom'` (su `key` no tiene que estar en la fila y no se ordenan ni filtran; el resto de columnas siguen comprobando su `key`), `paginationMetaConfig` opcional (en servidor, `requestData` llega con `page` y `rowsPerPageCurrent` a `null`) y cabecera sin hueco de filtros si ninguna columna es `filterable`. **Cambios incompatibles**: una columna con `key` fuera de `T` necesita `type: 'custom'`, y `RequestData.page` / `rowsPerPageCurrent` pasan a admitir `null`. También: sin `ResizeObserver` (SSR, jsdom) la tabla ya no rompe, el observer se desconecta al destruirla, fuera el `allowSignalWrites` obsoleto y specs de `button` y `table` reescritos (los del CLI ya no compilaban).
- [x] Angular 20 como versión mínima: el repositorio baja a Angular 20.3 (TypeScript 5.9, vitest 3) para compilar la librería con la versión más antigua admitida, y `peerDependencies` pasa a `^20.0.0 || ^21.0.0 || ^22.0.0`. Probado instalando el paquete en apps con Angular 20.0, 21 y 22 (compilación estricta y en el navegador, con y sin zone.js). Ajustes: `strict` y `strictTemplates` activados (los tipos publicados perdían los `| null`), tipos explícitos en `control` y `stepControl` (inferidos se publicaban como `AbstractControl<any, any, any>`, que Angular 20.0 no admite). Las plantillas no pueden usar sintaxis posterior a Angular 20.0 (por ejemplo, `@else if (…; as …)`). El showcase activa `provideZonelessChangeDetection()` y el builder de tests lleva `buildTarget`, `runner` y `tsConfig`.
- [x] Preparado para publicar en npm: `peerDependencies` completas (`@angular/forms` y `@angular/router`), metadatos del `package.json` (descripción, licencia, repositorio, palabras clave, autor), licencia MIT (`LICENSE`), versión `0.1.0` y borrado el componente de plantilla del CLI. El nombre `aesy-components` está libre en npm.
- [x] Controles de formulario con `formControlName`: se suscribían a los eventos del control en `ngOnInit`, cuando Angular aún no lo ha asignado, así que un `markAllAsTouched()` o un `reset()` hecho desde fuera no se reflejaba hasta interactuar con el campo. Ahora se inicializan en `ngAfterContentInit` (los 7 controles). Con `[formControl]` ya funcionaba.
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
