# aesy-components

Librería de componentes para Angular 22: standalone, `OnPush`, basada en signals e integrada con Angular Forms. Todo el aspecto se personaliza con variables CSS.

## Componentes

| Componente | Selector | Documentación |
|---|---|---|
| Accordion | `aesy-accordion`, `aesy-accordion-item` | [AccordionComponent.md](src/lib/accordion/AccordionComponent.md) |
| Button | `aesy-button` | [ButtonComponent.md](src/lib/button/ButtonComponent.md) |
| Checkbox | `aesy-checkbox` | [CheckboxComponent.md](src/lib/form-controls/checkbox/CheckboxComponent.md) |
| Datepicker | `aesy-datepicker` | [DatepickerComponent.md](src/lib/form-controls/datepicker/DatepickerComponent.md) |
| Dialog | `aesy-dialog`, `aesy-dialog-actions`, `DialogService` | [DialogComponent.md](src/lib/dialog/DialogComponent.md) |
| Input number | `aesy-input-number` | [InputNumberComponent.md](src/lib/form-controls/input-number/InputNumberComponent.md) |
| Input text | `aesy-input-text` | [InputTextComponent.md](src/lib/form-controls/input-text/InputTextComponent.md) |
| Radio button | `aesy-radio-button` | [RadioButtonComponent.md](src/lib/form-controls/radio-button/RadioButtonComponent.md) |
| Select | `aesy-select` | [SelectComponent.md](src/lib/form-controls/select/SelectComponent.md) |
| Stepper | `aesy-stepper`, `aesy-step` | [StepperComponent.md](src/lib/stepper/StepperComponent.md) |
| Table | `aesy-table` | [TableComponent.md](src/lib/table/TableComponent.md) |
| Toast | `ToastService` | [ToastService.md](src/lib/toast/ToastService.md) |
| Textarea | `aesy-textarea` | [TextareaComponent.md](src/lib/form-controls/textarea/TextareaComponent.md) |

Para verlos funcionando, con todos sus casos de uso, arranca el showcase del repositorio con `npm run debugapp`.

## Instalación

```bash
npm install aesy-components
```

### Dependencias (peer)

| Paquete | Versión |
|---|---|
| `@angular/core`, `@angular/common` | `^22.1.0` |
| `@angular/forms` | `^22.1.0` |
| `@angular/cdk` | `^22.1.0` (overlay del select y del datepicker, drag & drop de la tabla) |
| `@angular/router` | `^22.1.0` (solo lo usa la tabla, para `persistFilters`) |

## Tema CSS

Los controles de formulario comparten variables comunes (`--aesy-form-controls-*`) que se definen en `:root`. Importa el tema una vez en los estilos globales de tu aplicación:

```css
/* styles.css */
@import 'aesy-components/theme/public-theme.css';
```

Para cambiar el aspecto de todos los controles, sobrescribe esas variables en `:root`; para uno solo, decláralas sobre el propio componente:

```css
:root {
  --aesy-form-controls-radius: 0.75rem;
  --aesy-form-controls-border-color-focus: #3b3bf0;
}

aesy-select {
  --aesy-select-dropdown-option-selected-background: #3b3bf0;
}
```

Cada componente tiene además sus variables propias con el prefijo `--aesy-<componente>-`, documentadas en su `.md`. Más detalle sobre cómo sobrescribirlas en [how-to-override-classes.md](src/lib/form-controls/how-to-override-classes.md).

## Uso

Los componentes son standalone: impórtalos directamente donde los uses.

```ts
import { ButtonComponent, SelectComponent, SelectOption } from 'aesy-components';

@Component({
  selector: 'app-profile',
  imports: [ButtonComponent, ReactiveFormsModule, SelectComponent],
  template: `
    <aesy-select label="País" [options]="COUNTRY_OPTIONS" [formControl]="countryControl" />
    <aesy-button type="success" label="Guardar" [disabled]="countryControl.invalid" (buttonClick)="onSaveButtonClicked()" />
  `
})
export class ProfileComponent {
  protected readonly COUNTRY_OPTIONS: SelectOption[] = [
    { label: 'España', value: 'ES' },
    { label: 'Francia', value: 'FR' }
  ];
  protected readonly countryControl = new FormControl<string | null>(null, { validators: [Validators.required] });

  protected onSaveButtonClicked(): void {}
}
```

### Con o sin Angular Forms

Todos los controles de formulario funcionan de dos formas:

- **Con Angular Forms**: `[formControl]` o `formControlName`. Detectan `Validators.required` (asterisco incluido) y muestran el mensaje de error al tocar el campo. Los validadores propios pueden definir su texto con `{ miError: { message: 'Texto del error' } }`.
- **Sin Angular Forms**: `[(value)]` y, para el error, `invalid` + `errorMessage`.

### Tipos exportados

Además de los componentes, la librería exporta sus tipos públicos: `AccordionAppearance`, `AccordionTogglePosition`, `AccordionHeadingLevel`, `ButtonType`, `DialogConfig`, `DialogRef`, `DialogRole`, `DialogSize`, `AESY_DIALOG_DATA`, `IconPosition`, `InputTextType`, `TextareaResize`, `RadioButtonOption`, `SelectOption`, `TableConfig`, `TableColumn`, `TableSelectableConfig`, `PaginationMeta`, `PaginationMetaRowsPerPage`, `RequestData`, `RowOrderChange`, `StepperOrientation`, `StepperLabelPosition`, `StepperSelectionChange`, `ToastOptions`, `ToastRef`, `ToastType`, `ToastPosition`, `ToastDismissReason`, `ToastGlobalConfig` y `provideAesyToastConfig`.

## Desarrollo

```bash
# Compilar la librería en dist/aesy-components
npm run generate-lib

# Compilar en modo watch y arrancar el showcase
npm run debugapp

# Simular la publicación: compila la librería y muestra qué se incluiría, sin publicar
# (antes: npm login y con el debugapp parado, que pone la versión 0.0.0-watch)
npm run publish-lib-dry-run

# Publicar de verdad
npm publish ./dist/aesy-components
```

Para añadir un componente nuevo, sigue el checklist del [README del repositorio](../../README.md#crear-un-componente-nuevo-checklist). Los problemas conocidos y mejoras pendientes están en [PENDIENTES.md](PENDIENTES.md).

## Licencia

[MIT](LICENSE) © amoradev
