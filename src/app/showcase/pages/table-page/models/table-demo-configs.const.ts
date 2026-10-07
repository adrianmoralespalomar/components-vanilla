import { TableConfig } from 'aesy-components';
import { DEMO_COUNTRY_FILTER_OPTIONS } from '../../../models/demo-country-filter-options.const';
import { DemoPerson } from '../../../models/demo-person.interface';
import { DEMO_CITIES } from './demo-cities.const';
import { DemoCity } from './demo-city.interface';
import { DEMO_PEOPLE_COLUMNS } from './demo-people-columns.const';
import { DemoProduct } from './demo-product.interface';

export const TABLE_DEMO_CONFIGS = {
  localPeople: {
    columns: DEMO_PEOPLE_COLUMNS,
    isHeaderFixed: true,
    persistFilters: true,
    serverSide: false,
    tableName: 'docsLocalPeople'
  } satisfies TableConfig<DemoPerson>,
  asyncPeople: {
    columns: DEMO_PEOPLE_COLUMNS.map(column => ({ ...column, fixed: false })),
    serverSide: false,
    tableName: 'docsAsyncPeople'
  } satisfies TableConfig<DemoPerson>,
  selectableCities: {
    columns: [
      { key: 'name', label: 'Ciudad', type: 'text', sortable: true, filterable: true },
      { key: 'country', label: 'País', type: 'select', sortable: true, filterable: true, options: DEMO_COUNTRY_FILTER_OPTIONS },
      { key: 'population', label: 'Habitantes', type: 'number', sortable: true, alignCell: 'right', alignHeader: 'right' }
    ],
    selectable: { key: 'name', selectedValues: DEMO_CITIES.filter(city => city.country === 'España').map(city => city.name) },
    serverSide: false,
    tableName: 'docsSelectableCities'
  } satisfies TableConfig<DemoCity>,
  draggablePeople: {
    columns: DEMO_PEOPLE_COLUMNS.map(column => ({ ...column, fixed: false })),
    draggableColumns: true,
    draggableRows: true,
    serverSide: false,
    tableName: 'docsDraggablePeople'
  } satisfies TableConfig<DemoPerson>,
  serverProducts: {
    columns: [
      { key: 'id', label: 'ID', type: 'number', sortable: true, fixed: true, width: '80px' },
      { key: 'title', label: 'Producto', type: 'text', sortable: true, filterable: true, width: '240px' },
      { key: 'category', label: 'Categoría', type: 'text' },
      { key: 'price', label: 'Precio ($)', type: 'number', sortable: true, alignCell: 'right', alignHeader: 'right' }
    ],
    selectable: { key: 'id' },
    serverSide: true,
    tableName: 'docsServerProducts'
  } satisfies TableConfig<DemoProduct>,
  customPagination: {
    columns: DEMO_PEOPLE_COLUMNS.map(column => ({ ...column, filterable: false, fixed: false })),
    serverSide: false,
    tableName: 'docsCustomPagination'
  } satisfies TableConfig<DemoPerson>
};
