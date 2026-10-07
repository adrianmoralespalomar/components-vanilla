import { ComponentApi } from '../../../models/component-api.interface';

export const CHECKBOX_API: ComponentApi = {
  inputs: [
    { name: 'label', type: 'string', defaultValue: "''", description: 'Texto de la casilla.' },
    { name: 'labelPosition', type: "'left' | 'right'", defaultValue: "'right'", description: 'Lado en el que se coloca la etiqueta.' },
    { name: 'size', type: "'small' | 'medium' | 'large'", defaultValue: "'medium'", description: 'Tamaño visual de la casilla y del texto.' },
    { name: 'indeterminate', type: 'boolean', defaultValue: 'false', description: 'Muestra el estado mixto, típico de un "seleccionar todo" parcial.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Impide cambiar el valor sin deshabilitar el control.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Deshabilita la casilla cuando no está ligada a Angular Forms.' },
    { name: 'required', type: 'boolean | null', defaultValue: 'null', description: 'Marca el campo como obligatorio. Con null se detecta desde Validators.required o Validators.requiredTrue.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Fuerza el estado inválido cuando no se usa Angular Forms.' },
    { name: 'errorMessage', type: 'string | null', defaultValue: 'null', description: 'Mensaje de error explícito. Sobrescribe el automático.' },
    { name: 'helpText', type: 'string | null', defaultValue: 'null', description: 'Texto de ayuda bajo la casilla.' },
    { name: 'id', type: 'string | null', defaultValue: 'null', description: 'Id base; el input interno usa `${id}-checkbox`.' },
    { name: 'name', type: 'string | null', defaultValue: 'null', description: 'Nombre del control.' }
  ],
  models: [{ name: 'value', type: 'boolean', defaultValue: 'false', description: 'Estado marcado sin Angular Forms.' }]
};
