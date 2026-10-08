import { TableConfig } from 'aesy-components';
import { DemoPerson } from '../../../models/demo-person.interface';

export const STEPPER_LAZY_TABLE_CONFIG: TableConfig<DemoPerson> = {
  columns: [
    { key: 'name', label: 'Nombre', type: 'text', sortable: true },
    { key: 'role', label: 'Rol', type: 'text' }
  ],
  tableName: 'stepperLazyPeople',
  serverSide: false
};
