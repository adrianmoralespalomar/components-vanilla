import { ComponentApi } from '../../../models/component-api.interface';

export const STEP_API: ComponentApi = {
  inputs: [
    { name: 'label', type: 'string', defaultValue: "''", description: 'Texto de la cabecera. Para HTML propio, proyecta un elemento con aesyStepLabel.' },
    { name: 'stepControl', type: 'AbstractControl | null', defaultValue: 'null', description: 'Formulario del paso: decide si está completo y, en modo lineal, si se puede avanzar.' },
    { name: 'errorMessage', type: 'string', defaultValue: "''", description: 'Texto bajo la etiqueta cuando el paso tiene error (visitado con stepControl inválido).' },
    { name: 'optional', type: 'boolean', defaultValue: 'false', description: 'Muestra «Opcional» y no bloquea el modo lineal.' },
    { name: 'editable', type: 'boolean', defaultValue: 'true', description: 'false = una vez completado ya no se puede volver a él.' },
    { name: 'completed', type: 'boolean | null', defaultValue: 'null', description: 'null = se calcula (visitado y, si hay stepControl, válido). true/false lo fuerza.' }
  ],
  types: [
    {
      name: 'Contenido proyectado',
      properties: [
        { name: 'contenido por defecto', type: 'ng-content', description: 'Contenido del paso.' },
        { name: '[aesyStepLabel]', type: 'atributo', description: 'Se añade a la etiqueta de la cabecera, detrás de label.' },
        { name: 'ng-template[aesyStepContent]', type: 'directiva', description: 'Contenido diferido.' }
      ]
    }
  ]
};
