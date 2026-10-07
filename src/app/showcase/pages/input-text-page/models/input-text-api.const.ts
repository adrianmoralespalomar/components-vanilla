import { ComponentApi } from '../../../models/component-api.interface';

export const INPUT_TEXT_API: ComponentApi = {
  inputs: [
    { name: 'label', type: 'string', defaultValue: "''", description: 'Texto de la etiqueta.' },
    { name: 'placeholder', type: 'string', defaultValue: "''", description: 'Texto mostrado con el campo vacío.' },
    { name: 'type', type: "'text' | 'password' | 'email'", defaultValue: "'text'", description: 'Tipo del input nativo.' },
    { name: 'maxlength', type: 'number | null', defaultValue: 'null', description: 'Longitud máxima del texto.' },
    { name: 'showCharCount', type: 'boolean', defaultValue: 'false', description: 'Muestra el contador de caracteres (junto a maxlength, también el máximo).' },
    { name: 'allowTypeInvalidValue', type: 'boolean', defaultValue: 'false', description: 'Deja escribir por encima de maxlength para que se vea el error en lugar de cortar el texto.' },
    { name: 'icon', type: 'string | null', defaultValue: 'null', description: 'Texto o carácter que se muestra como icono.' },
    { name: 'iconPosition', type: "'left' | 'right'", defaultValue: "'left'", description: 'Lado del icono.' },
    { name: 'textAlign', type: "'left' | 'center' | 'right'", defaultValue: "'left'", description: 'Alineación del texto.' },
    { name: 'autocomplete', type: 'string', defaultValue: "'off'", description: 'Valor del atributo autocomplete del input.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Impide editar sin deshabilitar el campo.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Deshabilita el campo cuando no está ligado a Angular Forms.' },
    { name: 'required', type: 'boolean | null', defaultValue: 'null', description: 'Marca el campo como obligatorio. Con null se detecta desde Validators.required.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Fuerza el estado inválido cuando no se usa Angular Forms.' },
    { name: 'errorMessage', type: 'string | null', defaultValue: 'null', description: 'Mensaje de error explícito. Sobrescribe el automático.' },
    { name: 'helpText', type: 'string | null', defaultValue: 'null', description: 'Texto de ayuda bajo el campo.' },
    { name: 'id', type: 'string | null', defaultValue: 'null', description: 'Id base del control.' }
  ],
  models: [{ name: 'value', type: 'string', defaultValue: "''", description: 'Texto del campo sin Angular Forms.' }]
};
