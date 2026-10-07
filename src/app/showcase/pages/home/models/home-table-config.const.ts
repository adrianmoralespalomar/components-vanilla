import { TableConfig } from 'aesy-components';
import { DEMO_COUNTRY_FILTER_OPTIONS } from '../../../models/demo-country-filter-options.const';
import { DemoPerson } from '../../../models/demo-person.interface';

export const HOME_TABLE_CONFIG: TableConfig<DemoPerson> = {
  columns: [
    { key: 'name', label: 'Nombre', type: 'text', sortable: true, filterable: true },
    { key: 'role', label: 'Rol', type: 'text', sortable: true },
    { key: 'country', label: 'País', type: 'select', filterable: true, options: DEMO_COUNTRY_FILTER_OPTIONS },
    { key: 'age', label: 'Edad', type: 'number', sortable: true, alignCell: 'right', alignHeader: 'right' }
  ],
  tableName: 'homePeople',
  serverSide: false
};
