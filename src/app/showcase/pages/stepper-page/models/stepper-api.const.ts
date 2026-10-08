import { ComponentApi } from '../../../models/component-api.interface';

export const STEPPER_API: ComponentApi = {
  inputs: [
    { name: 'orientation', type: "StepperOrientation ('horizontal' | 'vertical')", defaultValue: "'horizontal'", description: 'Pasos en fila con el contenido debajo, o uno bajo otro desplegándose como un acordeón.' },
    { name: 'linear', type: 'boolean', defaultValue: 'false', description: 'Solo deja avanzar si los pasos anteriores están completados u opcionales.' },
    { name: 'labelPosition', type: "StepperLabelPosition ('end' | 'bottom')", defaultValue: "'end'", description: 'Solo en horizontal: etiqueta junto al icono o debajo.' },
    { name: 'optionalLabel', type: 'string', defaultValue: "'Opcional'", description: 'Texto bajo la etiqueta de los pasos opcionales.' },
    { name: 'completedIconSvg', type: 'string | null', defaultValue: 'null (check)', description: 'Path SVG (viewBox 20×20) del icono de paso completado.' },
    { name: 'errorIconSvg', type: 'string | null', defaultValue: 'null (exclamación)', description: 'Path SVG (viewBox 20×20) del icono de paso con error.' }
  ],
  models: [{ name: 'selectedIndex', type: 'number', defaultValue: '0', description: 'Paso actual. Con [(selectedIndex)] lo controlas desde fuera (sin las restricciones de linear).' }],
  outputs: [{ name: 'selectionChange', type: 'StepperSelectionChange', description: '{ previousIndex, selectedIndex } en cada cambio de paso. No se emite en la carga inicial.' }],
  types: [
    {
      name: 'Métodos públicos',
      properties: [
        { name: 'next() / previous()', type: 'void', description: 'Paso siguiente o anterior, respetando linear.' },
        { name: 'goToStep(index)', type: 'void', description: 'Va al paso indicado si se puede.' },
        { name: 'reset()', type: 'void', description: 'Vuelve al primer paso y reinicia el estado y el formulario de todos los pasos.' }
      ]
    },
    {
      name: 'Directivas',
      properties: [
        { name: '[aesyStepperNext]', type: 'StepperNextDirective', description: 'En un button o aesy-button dentro de un paso: al hacer clic llama a next().' },
        { name: '[aesyStepperPrevious]', type: 'StepperPreviousDirective', description: 'Igual, con previous().' },
        { name: 'ng-template[aesyStepContent]', type: 'StepContentDirective', description: 'Contenido diferido del paso: se crea al seleccionarlo por primera vez.' }
      ]
    }
  ]
};
