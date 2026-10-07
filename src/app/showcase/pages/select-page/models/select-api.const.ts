import { ComponentApi } from '../../../models/component-api.interface';

export const SELECT_API: ComponentApi = {
  inputs: [
    { name: 'options', type: 'SelectOption[]', defaultValue: '[]', description: 'Opciones disponibles.' },
    { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Permite seleccionar varias opciones. El valor pasa a ser un array.' },
    { name: 'label', type: 'string', defaultValue: "''", description: 'Texto de la etiqueta.' },
    { name: 'placeholder', type: 'string', defaultValue: "'Selecciona una opción'", description: 'Texto mostrado cuando no hay selección.' },
    { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Muestra un botón para limpiar la selección.' },
    { name: 'showSelectedIcon', type: 'boolean', defaultValue: 'false', description: 'Muestra un check junto a las opciones seleccionadas en el desplegable.' },
    { name: 'textAlign', type: "'left' | 'center' | 'right'", defaultValue: "'left'", description: 'Alineación del texto seleccionado.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Impide modificar la selección sin cambiar el aspecto a deshabilitado.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Deshabilita el componente cuando no está ligado a Angular Forms.' },
    { name: 'required', type: 'boolean | null', defaultValue: 'null', description: 'Marca el campo como obligatorio. Con null se detecta desde Validators.required.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Fuerza el estado inválido cuando no se usa Angular Forms.' },
    { name: 'errorMessage', type: 'string | null', defaultValue: 'null', description: 'Mensaje de error explícito. Sobrescribe el mensaje automático.' },
    { name: 'helpText', type: 'string | null', defaultValue: 'null', description: 'Texto de ayuda bajo el campo.' },
    { name: 'id', type: 'string | null', defaultValue: 'null', description: 'Id base; el control interno usa `${id}-select`.' },
    { name: 'name', type: 'string | null', defaultValue: 'null', description: 'Nombre del control.' }
  ],
  models: [{ name: 'value', type: 'any | any[] | null', defaultValue: 'null', description: 'Valor seleccionado sin Angular Forms. Un valor o null en simple; un array en múltiple.' }],
  outputs: [{ name: 'selectValueChanged', type: 'any | any[] | null', description: 'Se emite cada vez que cambia la selección.' }],
  types: [
    {
      name: 'SelectOption',
      properties: [
        { name: 'label', type: 'string', description: 'Texto visible de la opción.' },
        { name: 'value', type: 'any', description: 'Valor de la opción. Puede ser un objeto: se compara en profundidad.' },
        { name: 'disabled', type: 'boolean | undefined', description: 'Impide seleccionar la opción.' }
      ]
    }
  ]
};
