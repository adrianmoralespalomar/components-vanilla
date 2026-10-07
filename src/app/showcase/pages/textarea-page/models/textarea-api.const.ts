import { ComponentApi } from '../../../models/component-api.interface';

export const TEXTAREA_API: ComponentApi = {
  inputs: [
    { name: 'label', type: 'string', defaultValue: "''", description: 'Texto de la etiqueta.' },
    { name: 'placeholder', type: 'string', defaultValue: "''", description: 'Texto mostrado con el campo vacío.' },
    { name: 'rows', type: 'number', defaultValue: '4', description: 'Altura inicial en líneas.' },
    { name: 'cols', type: 'number | null', defaultValue: 'null', description: 'Anchura en caracteres del textarea nativo.' },
    { name: 'resize', type: "'none' | 'vertical' | 'horizontal' | 'both'", defaultValue: "'vertical'", description: 'Hacia dónde se puede redimensionar.' },
    { name: 'maxlength', type: 'number | null', defaultValue: 'null', description: 'Longitud máxima del texto.' },
    { name: 'showCharCount', type: 'boolean', defaultValue: 'false', description: 'Muestra el contador de caracteres.' },
    { name: 'allowTypeInvalidValue', type: 'boolean', defaultValue: 'false', description: 'Deja escribir por encima de maxlength para que se vea el error.' },
    { name: 'textAlign', type: "'left' | 'center' | 'right'", defaultValue: "'left'", description: 'Alineación del texto.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Impide editar sin deshabilitar el campo.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Deshabilita el campo cuando no está ligado a Angular Forms.' },
    { name: 'required', type: 'boolean | null', defaultValue: 'null', description: 'Marca el campo como obligatorio. Con null se detecta desde Validators.required.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Fuerza el estado inválido cuando no se usa Angular Forms.' },
    { name: 'errorMessage', type: 'string | null', defaultValue: 'null', description: 'Mensaje de error explícito. Sobrescribe el automático.' },
    { name: 'helpText', type: 'string | null', defaultValue: 'null', description: 'Texto de ayuda bajo el campo.' },
    { name: 'id', type: 'string | null', defaultValue: 'null', description: 'Id base del control.' },
    { name: 'name', type: 'string | null', defaultValue: 'null', description: 'Nombre del control.' }
  ],
  models: [{ name: 'value', type: 'string', defaultValue: "''", description: 'Texto del campo sin Angular Forms.' }]
};
