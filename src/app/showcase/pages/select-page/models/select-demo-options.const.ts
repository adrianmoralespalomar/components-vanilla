import { SelectOption } from 'aesy-components';

export const SELECT_DEMO_OPTIONS = {
  countriesWithDisabled: [
    { label: 'España', value: 'ES' },
    { label: 'Francia (sin stock)', value: 'FR', disabled: true },
    { label: 'Italia', value: 'IT' },
    { label: 'Portugal (sin stock)', value: 'PT', disabled: true }
  ],
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
