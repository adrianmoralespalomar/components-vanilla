# StepperComponent

Asistente por pasos: `aesy-stepper` coordina varios `aesy-step` y muestra en cada momento el contenido del paso actual, en horizontal o en vertical.

Selectores: `aesy-stepper` y `aesy-step`. Directivas: `aesyStepperNext`, `aesyStepperPrevious` y `aesyStepContent`.

## Características

- **Horizontal o vertical con el mismo componente** (`orientation`). En vertical cada paso se despliega bajo su cabecera con la misma animación que el acordeón. Al cambiar de orientación se conservan el paso actual y el contenido.
- Modo lineal (`linear`): no se avanza hasta completar el paso actual.
- Validación por formulario con `stepControl`: al intentar avanzar con errores se marcan los campos y la cabecera muestra `errorMessage`.
- Pasos opcionales y no editables.
- `selectedIndex` es un `model` (`[(selectedIndex)]`) y `selectionChange` avisa de cada cambio.
- Métodos `next()`, `previous()`, `goToStep()` y `reset()`, y directivas para convertir cualquier botón en avanzar o retroceder.
- Etiqueta debajo del icono (`labelPosition="bottom"`), etiquetas con HTML propio e iconos de completado y error configurables.
- Contenido diferido con `ng-template[aesyStepContent]`.
- Responsive: en contenedores estrechos (≤ 560px) el modo horizontal solo muestra el texto del paso actual.
- Accesible: `tablist`/`tab`/`tabpanel`, foco itinerante con flechas, Inicio y Fin.
- Variables CSS `--aesy-stepper-*` heredables. Standalone y `OnPush`.

---

# ¿Por qué un solo componente y no un acordeón para el vertical?

Visualmente el vertical es un acordeón, pero la lógica es la de un stepper: solo puede estar abierto el paso actual, el orden importa, hay pasos completados, con error o bloqueados, y la navegación la decide el modo lineal, no el usuario abriendo paneles. Con un único componente:

- la API es la misma en las dos orientaciones y se puede cambiar en caliente (por ejemplo, vertical en móvil);
- el estado (paso actual, completados, formularios) no se duplica;
- la semántica de accesibilidad es la de un asistente por pasos, no la de un acordeón.

Del acordeón reutiliza la técnica de animación (`grid-template-rows` de `0fr` a `1fr`) y el uso de `inert` en los paneles cerrados.

---

# Importación

```ts
import { StepComponent, StepperComponent, StepperNextDirective, StepperPreviousDirective } from 'aesy-components';

@Component({
  imports: [StepComponent, StepperComponent, StepperNextDirective, StepperPreviousDirective]
})
export class CheckoutComponent {}
```

Para el contenido diferido importa también `StepContentDirective`. Tipos: `StepperOrientation`, `StepperLabelPosition` y `StepperSelectionChange`.

---

# Uso básico

```html
<aesy-stepper>
  <aesy-step label="Carrito">
    …
    <aesy-button type="secondary" label="Siguiente" aesyStepperNext />
  </aesy-step>
  <aesy-step label="Envío">
    …
    <aesy-button label="Atrás" aesyStepperPrevious />
    <aesy-button type="secondary" label="Siguiente" aesyStepperNext />
  </aesy-step>
  <aesy-step label="Pago">…</aesy-step>
</aesy-stepper>
```

`aesyStepperNext` y `aesyStepperPrevious` funcionan en un `button` nativo o en un `aesy-button`. También se puede navegar pulsando las cabeceras.

---

# Vertical

```html
<aesy-stepper orientation="vertical">…</aesy-stepper>

<!-- O dinámico, por ejemplo según el ancho de pantalla -->
<aesy-stepper [orientation]="stepperOrientation()">…</aesy-stepper>
```

---

# Lineal con formularios

```ts
protected readonly personalDataForm = new FormGroup({
  fullName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
});
```

```html
<aesy-stepper #checkoutStepper [linear]="true">
  <aesy-step label="Tus datos" errorMessage="Revisa tus datos" [stepControl]="personalDataForm">
    <form [formGroup]="personalDataForm">
      <aesy-input-text label="Nombre" formControlName="fullName" />
    </form>
    <aesy-button label="Siguiente" aesyStepperNext />
  </aesy-step>
  …
  <aesy-step label="Resumen">
    <aesy-button label="Empezar de nuevo" (buttonClick)="checkoutStepper.reset()" />
  </aesy-step>
</aesy-stepper>
```

- Con `linear`, las cabeceras de los pasos a los que aún no se puede ir quedan bloqueadas (`aria-disabled`).
- Al intentar avanzar con el formulario inválido, el stepper hace `markAllAsTouched()` (los campos muestran sus errores), el paso pasa a estado de error y la cabecera muestra `errorMessage`.
- `reset()` vuelve al primer paso y hace `reset()` de todos los `stepControl`.

## Cuándo está completado un paso

Si no se indica `completed`, se calcula: el paso se ha visitado y dejado (o se ha intentado avanzar desde él) y, si tiene `stepControl`, es válido. Con `[completed]="true | false"` lo decides tú.

---

# Opcional y no editable

```html
<aesy-stepper [linear]="true">
  <aesy-step label="Crear cuenta" [editable]="false">…</aesy-step>
  <aesy-step label="Foto de perfil" [optional]="true">…</aesy-step>
  <aesy-step label="Listo">…</aesy-step>
</aesy-stepper>
```

- `optional`: muestra `optionalLabel` («Opcional») bajo la etiqueta y no bloquea el modo lineal.
- `editable` en `false`: una vez completado no se puede volver a él.

---

# Estado controlado y eventos

```ts
protected readonly currentStepIndex = signal<number>(0);

protected onTripStepperSelectionChanged(selectionChange: StepperSelectionChange): void {
  console.log(selectionChange.previousIndex, '→', selectionChange.selectedIndex);
}
```

```html
<aesy-stepper
  #tripStepper
  [(selectedIndex)]="currentStepIndex"
  (selectionChange)="onTripStepperSelectionChanged($event)">
  …
</aesy-stepper>
```

Cambiar `selectedIndex` desde fuera no aplica las restricciones de `linear` (es un cambio por código). `selectionChange` no se emite en la carga inicial.

---

# Etiquetas e iconos personalizados

```html
<aesy-stepper [completedIconSvg]="STAR_ICON_PATH">
  <aesy-step>
    <span aesyStepLabel>
      Pedido
      <span class="badge">3</span>
    </span>
    …
  </aesy-step>
</aesy-stepper>
```

`aesyStepLabel` se añade a la etiqueta, detrás de `label`. `completedIconSvg` y `errorIconSvg` reciben el atributo `d` de un `<path>` en un `viewBox` de 20×20.

> No pongas elementos interactivos en la etiqueta: va dentro del `button` de la cabecera.

---

# Carga diferida

```html
<aesy-step label="Equipo">
  <ng-template aesyStepContent>
    <aesy-table [data]="people()" [config]="TABLE_CONFIG" [paginationMetaConfig]="TABLE_PAGINATION" />
  </ng-template>
</aesy-step>
```

El contenido del `ng-template` no se crea hasta que el paso se selecciona por primera vez y después se conserva.

---

# Accesibilidad

- Las cabeceras forman un `role="tablist"` con `aria-orientation`; cada una es un `role="tab"` con `aria-selected` y `aria-controls`; cada contenido es un `role="tabpanel"` con `aria-labelledby`.
- Foco itinerante: solo la cabecera del paso actual tiene `tabindex="0"`. <kbd>←</kbd>/<kbd>→</kbd> (en vertical <kbd>↑</kbd>/<kbd>↓</kbd>) mueven el foco, <kbd>Inicio</kbd>/<kbd>Fin</kbd> van a la primera y la última, <kbd>Enter</kbd>/<kbd>Espacio</kbd> seleccionan.
- Los pasos bloqueados usan `aria-disabled` (no `disabled`) para que sigan recibiendo el foco y se anuncien.
- Los pasos completados añaden «(completado)» al nombre accesible. En vertical, los paneles cerrados llevan `inert`.
- Sin animaciones con `prefers-reduced-motion: reduce`.

---

# API

## aesy-stepper · Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `orientation` | `StepperOrientation` | `'horizontal'` | `'horizontal' \| 'vertical'`. |
| `linear` | `boolean` | `false` | Solo deja avanzar si los pasos anteriores están completados u opcionales. |
| `labelPosition` | `StepperLabelPosition` | `'end'` | Solo en horizontal: `'end' \| 'bottom'`. |
| `optionalLabel` | `string` | `'Opcional'` | Texto de los pasos opcionales. |
| `completedIconSvg` | `string \| null` | `null` | Path SVG del icono de completado. `null` = check. |
| `errorIconSvg` | `string \| null` | `null` | Path SVG del icono de error. `null` = exclamación. |

## aesy-stepper · Model

| Model | Tipo | Default | Descripción |
|---|---|---|---|
| `selectedIndex` | `number` | `0` | Paso actual. |

## aesy-stepper · Outputs

| Output | Tipo | Descripción |
|---|---|---|
| `selectionChange` | `StepperSelectionChange` | `{ previousIndex, selectedIndex }` en cada cambio. No en la carga inicial. |

## aesy-stepper · Métodos

| Método | Descripción |
|---|---|
| `next()`, `previous()` | Paso siguiente o anterior, respetando `linear`. |
| `goToStep(index)` | Va al paso indicado si se puede. |
| `reset()` | Vuelve al primer paso y reinicia el estado y el formulario de todos los pasos. |

## aesy-step · Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Texto de la cabecera. |
| `stepControl` | `AbstractControl \| null` | `null` | Formulario del paso. |
| `errorMessage` | `string` | `''` | Texto bajo la etiqueta cuando el paso tiene error. |
| `optional` | `boolean` | `false` | No bloquea el modo lineal. |
| `editable` | `boolean` | `true` | `false` = no se puede volver a él una vez completado. |
| `completed` | `boolean \| null` | `null` | `null` = se calcula. |

## Directivas

| Directiva | Clase | Descripción |
|---|---|---|
| `[aesyStepperNext]` | `StepperNextDirective` | Al hacer clic llama a `next()` del stepper que lo contiene. |
| `[aesyStepperPrevious]` | `StepperPreviousDirective` | Al hacer clic llama a `previous()`. |
| `ng-template[aesyStepContent]` | `StepContentDirective` | Contenido diferido del paso. |

## Tipos

```ts
export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperLabelPosition = 'end' | 'bottom';

export interface StepperSelectionChange {
  previousIndex: number;
  selectedIndex: number;
}
```

---

# CSS Variables

Como en el acordeón, **no se declaran en `:host`**: se leen con su valor por defecto y se heredan, así que puedes declararlas en el stepper o en cualquier contenedor, incluido `:root`.

| Variable | Defecto |
|---|---|
| `--aesy-stepper-text-color` | `#374151` |
| `--aesy-stepper-header-padding` | `0.5rem` |
| `--aesy-stepper-header-gap` | `0.75rem` |
| `--aesy-stepper-header-border-radius` | `0.5rem` |
| `--aesy-stepper-header-background-hover` | `#f9fafb` |
| `--aesy-stepper-icon-size` | `2rem` |
| `--aesy-stepper-icon-background` | `#e5e7eb` |
| `--aesy-stepper-icon-color` | `#4b5563` |
| `--aesy-stepper-icon-background-active` | `#3b82f6` |
| `--aesy-stepper-icon-background-completed` | `#3b82f6` |
| `--aesy-stepper-icon-color-active` | `#ffffff` |
| `--aesy-stepper-label-color` | `#6b7280` |
| `--aesy-stepper-label-color-active` | `#111827` |
| `--aesy-stepper-label-color-completed` | `#374151` |
| `--aesy-stepper-label-font-size` | `0.875rem` |
| `--aesy-stepper-optional-color` | `#9ca3af` |
| `--aesy-stepper-error-color` | `#dc2626` |
| `--aesy-stepper-connector-color` | `#e5e7eb` |
| `--aesy-stepper-connector-color-completed` | `#3b82f6` |
| `--aesy-stepper-connector-width` | `1px` |
| `--aesy-stepper-panel-padding` | `1.5rem 0.5rem 0.5rem` (horizontal) |
| `--aesy-stepper-vertical-panel-padding` | `0.25rem 0 1.5rem` (vertical) |
| `--aesy-stepper-vertical-gap` | `1rem` (vertical) |
| `--aesy-stepper-focus-color` | `#3b82f6` |
| `--aesy-stepper-transition-duration` | `0.25s` |
