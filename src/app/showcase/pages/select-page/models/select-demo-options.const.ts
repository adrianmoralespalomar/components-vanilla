import { SelectOption } from 'aesy-components';

export const SELECT_DEMO_OPTIONS = {
  countriesWithDisabled: [
    { label: 'España', value: 'ES' },
    { label: 'Francia (sin stock)', value: 'FR', disabled: true },
    { label: 'Italia', value: 'IT' },
    { label: 'Portugal (sin stock)', value: 'PT', disabled: true }
  ],
  // Lista larga y con tildes para probar la búsqueda
  searchableCountries: [
    'Alemania', 'Argentina', 'Australia', 'Austria', 'Bélgica', 'Brasil', 'Canadá', 'Chile', 'China', 'Colombia', 'Corea del Sur', 'Dinamarca',
    'Ecuador', 'Egipto', 'España', 'Estados Unidos', 'Finlandia', 'Francia', 'Grecia', 'India', 'Irlanda', 'Italia', 'Japón', 'Marruecos',
    'México', 'Noruega', 'Países Bajos', 'Perú', 'Polonia', 'Portugal', 'Reino Unido', 'Suecia', 'Suiza', 'Turquía', 'Uruguay', 'Venezuela'
  ].map(country => ({ label: country, value: country })),
  shippingMethods: [
    { label: 'Estándar · 3-5 días', value: { id: 1, code: 'STANDARD', price: 0 } },
    { label: 'Exprés · 24 h', value: { id: 2, code: 'EXPRESS', price: 4.95 } },
    { label: 'Recogida en tienda', value: { id: 3, code: 'PICKUP', price: 0 } }
  ],
  skills: [
    { label: 'Angular', value: 'angular' },
    { label: 'CSS', value: 'css' },
    { label: 'RxJS', value: 'rxjs' },
    { label: 'Signals', value: 'signals' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Testing', value: 'testing' }
  ]
} satisfies Record<string, SelectOption[]>;
