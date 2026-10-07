import { ComponentApi } from '../../../models/component-api.interface';

export const DATEPICKER_API: ComponentApi = {
  inputs: [
    { name: 'label', type: 'string', defaultValue: "''", description: 'Texto de la etiqueta.' },
    { name: 'placeholder', type: 'string', defaultValue: "'Selecciona una fecha'", description: 'Texto mostrado sin fecha seleccionada.' },
    { name: 'format', type: 'string', defaultValue: "'DD/MM/YYYY'", description: 'Formato de visualización y de salida cuando emitType es string.' },
    { name: 'emitType', type: "'date' | 'string'", defaultValue: "'date'", description: 'Tipo del valor emitido: un Date o un string con el formato indicado.' },
    { name: 'locale', type: 'string', defaultValue: "'es-ES'", description: 'Idioma de los nombres de meses y días.' },
    { name: 'firstDayOfWeek', type: "'monday' | 'sunday'", defaultValue: "'monday'", description: 'Día con el que empieza cada semana en el calendario.' },
    { name: 'minDate', type: 'Date | string | null', defaultValue: 'null', description: 'Fecha mínima seleccionable.' },
    { name: 'maxDate', type: 'Date | string | null', defaultValue: 'null', description: 'Fecha máxima seleccionable.' },
    { name: 'calendarWidth', type: "'auto' | 'full'", defaultValue: "'auto'", description: 'Ancho del calendario: el suyo propio o el del campo.' },
    { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Muestra un botón para borrar la fecha.' },
    { name: 'textAlign', type: "'left' | 'center' | 'right'", defaultValue: "'left'", description: 'Alineación del texto del campo.' },
    { name: 'readonly', type: 'boolean', defaultValue: 'false', description: 'Impide cambiar la fecha sin deshabilitar el campo.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Deshabilita el campo cuando no está ligado a Angular Forms.' },
    { name: 'required', type: 'boolean | null', defaultValue: 'null', description: 'Marca el campo como obligatorio. Con null se detecta desde Validators.required.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Fuerza el estado inválido cuando no se usa Angular Forms.' },
    { name: 'errorMessage', type: 'string | null', defaultValue: 'null', description: 'Mensaje de error explícito.' },
    { name: 'helpText', type: 'string | null', defaultValue: 'null', description: 'Texto de ayuda bajo el campo.' },
    { name: 'id', type: 'string | null', defaultValue: 'null', description: 'Id base del control.' },
    { name: 'name', type: 'string | null', defaultValue: 'null', description: 'Nombre del control.' }
  ],
  models: [{ name: 'value', type: 'Date | string | null', defaultValue: 'null', description: 'Fecha seleccionada sin Angular Forms. Acepta un Date o un string en el formato indicado.' }]
};
