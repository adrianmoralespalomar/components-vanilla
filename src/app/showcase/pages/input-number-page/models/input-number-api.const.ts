import { ComponentApi } from '../../../models/component-api.interface';

export const INPUT_NUMBER_API: ComponentApi = {
  inputs: [
    { name: 'label', type: 'string', defaultValue: "''", description: 'Texto de la etiqueta.' },
    { name: 'placeholder', type: 'string', defaultValue: "''", description: 'Texto mostrado con el campo vacío.' },
    { name: 'locale', type: 'string', defaultValue: "'es-ES'", description: 'Idioma del formato: es-ES → 1.234,56 · en-US → 1,234.56.' },
    { name: 'useGrouping', type: 'boolean', defaultValue: 'true', description: 'Muestra separadores de miles.' },
    { name: 'minFractionDigits', type: 'number', defaultValue: '0', description: 'Número mínimo de decimales mostrados.' },
    { name: 'maxFractionDigits', type: 'number', defaultValue: '2', description: 'Número máximo de decimales permitidos.' },
    { name: 'roundingMode', type: "'round' | 'truncate'", defaultValue: "'round'", description: 'Qué hacer con los decimales sobrantes: redondear (12,789 → 12,79) o truncar (→ 12,78).' },
    { name: 'formatOnBlur', type: 'boolean', defaultValue: 'true', description: 'Aplica el formato completo al perder el foco.' },
    { name: 'allowNegative', type: 'boolean', defaultValue: 'true', description: 'Permite escribir números negativos.' },
    { name: 'min', type: 'number | null', defaultValue: 'null', description: 'Valor mínimo.' },
    { name: 'max', type: 'number | null', defaultValue: 'null', description: 'Valor máximo.' },
    { name: 'step', type: 'number | null', defaultValue: 'null', description: 'Incremento de los botones + y −.' },
    { name: 'showButtons', type: 'boolean', defaultValue: 'false', description: 'Muestra los botones + y −.' },
    { name: 'prefix', type: 'string', defaultValue: "''", description: 'Texto antes del número, por ejemplo €.' },
    { name: 'suffix', type: 'string', defaultValue: "''", description: 'Texto después del número, por ejemplo %.' },
    { name: 'icon', type: 'string | null', defaultValue: 'null', description: 'Texto o carácter que se muestra como icono.' },
    { name: 'iconPosition', type: "'left' | 'right'", defaultValue: "'left'", description: 'Lado del icono.' },
    { name: 'textAlign', type: "'left' | 'center' | 'right'", defaultValue: "'left'", description: 'Alineación del número.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Impide editar sin deshabilitar el campo.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Deshabilita el campo cuando no está ligado a Angular Forms.' },
    { name: 'required', type: 'boolean | null', defaultValue: 'null', description: 'Marca el campo como obligatorio. Con null se detecta desde Validators.required.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Fuerza el estado inválido cuando no se usa Angular Forms.' },
    { name: 'errorMessage', type: 'string | null', defaultValue: 'null', description: 'Mensaje de error explícito. Sobrescribe el automático.' },
    { name: 'helpText', type: 'string | null', defaultValue: 'null', description: 'Texto de ayuda bajo el campo.' },
    { name: 'id', type: 'string | null', defaultValue: 'null', description: 'Id base del control.' }
  ],
  models: [{ name: 'value', type: 'number | null', defaultValue: 'null', description: 'Valor numérico sin Angular Forms. Siempre number o null, nunca el texto formateado.' }]
};
