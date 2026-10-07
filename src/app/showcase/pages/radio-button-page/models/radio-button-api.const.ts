import { ComponentApi } from '../../../models/component-api.interface';

export const RADIO_BUTTON_API: ComponentApi = {
  inputs: [
    { name: 'options', type: 'RadioButtonOption[]', defaultValue: '[]', description: 'Opciones del grupo.' },
    { name: 'label', type: 'string', defaultValue: "''", description: 'Título del grupo (legend).' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'vertical'", description: 'Disposición de las opciones.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Impide cambiar la opción sin deshabilitar el grupo.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Deshabilita el grupo cuando no está ligado a Angular Forms.' },
    { name: 'required', type: 'boolean | null', defaultValue: 'null', description: 'Marca el grupo como obligatorio. Con null se detecta desde Validators.required.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Fuerza el estado inválido cuando no se usa Angular Forms.' },
    { name: 'errorMessage', type: 'string | null', defaultValue: 'null', description: 'Mensaje de error explícito.' },
    { name: 'helpText', type: 'string | null', defaultValue: 'null', description: 'Texto de ayuda bajo el grupo.' },
    { name: 'id', type: 'string | null', defaultValue: 'null', description: 'Id base del grupo.' },
    { name: 'name', type: 'string | null', defaultValue: 'null', description: 'Atributo name compartido por los radios.' }
  ],
  models: [{ name: 'value', type: 'any', defaultValue: 'null', description: 'Valor de la opción seleccionada. Admite objetos, que se comparan en profundidad.' }],
  types: [
    {
      name: 'RadioButtonOption',
      properties: [
        { name: 'label', type: 'string | undefined', description: 'Texto visible de la opción.' },
        { name: 'value', type: 'any', description: 'Valor de la opción.' }
      ]
    }
  ]
};
