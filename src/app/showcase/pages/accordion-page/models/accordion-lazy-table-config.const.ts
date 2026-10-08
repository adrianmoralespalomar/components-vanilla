import { TableConfig } from 'aesy-components';
import { DemoPerson } from '../../../models/demo-person.interface';

export const ACCORDION_LAZY_TABLE_CONFIG: TableConfig<DemoPerson> = {
  columns: [
    { key: 'name', label: 'Nombre', type: 'text', sortable: true },
    { key: 'role', label: 'Rol', type: 'text', sortable: true },
    { key: 'country', label: 'País', type: 'text' }
  ],
  tableName: 'accordionLazyPeople',
  serverSide: false
};
