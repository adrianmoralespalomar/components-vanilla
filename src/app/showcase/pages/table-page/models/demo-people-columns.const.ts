import { TableColumn } from 'aesy-components';
import { DEMO_COUNTRY_FILTER_OPTIONS } from '../../../models/demo-country-filter-options.const';
import { DemoPerson } from '../../../models/demo-person.interface';

export const DEMO_PEOPLE_COLUMNS: TableColumn<DemoPerson>[] = [
  { key: 'name', label: 'Nombre', type: 'text', sortable: true, filterable: true, fixed: true, width: '180px' },
  { key: 'role', label: 'Rol', type: 'text', sortable: true, filterable: true },
  { key: 'country', label: 'País', type: 'select', filterable: true, options: DEMO_COUNTRY_FILTER_OPTIONS },
  { key: 'age', label: 'Edad', type: 'number', sortable: true, filterable: true, alignCell: 'right', alignHeader: 'right' }
];
