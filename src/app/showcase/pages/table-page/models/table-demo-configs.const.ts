import { AESY_ICON_PLUS, TableConfig } from 'aesy-components';
import { DEMO_COUNTRY_FILTER_OPTIONS } from '../../../models/demo-country-filter-options.const';
import { DemoPerson } from '../../../models/demo-person.interface';
import { DEMO_CITIES } from './demo-cities.const';
import { DemoCity } from './demo-city.interface';
import { DemoCountry } from './demo-country.interface';
import { DemoOrder } from './demo-order.interface';
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
  customCells: {
    columns: [
      { key: 'name', label: 'Nombre', type: 'text', sortable: true, filterable: true },
      { key: 'role', label: 'Rol', type: 'text', sortable: true },
      { key: 'country', label: 'País', type: 'select', sortable: true, filterable: true, options: DEMO_COUNTRY_FILTER_OPTIONS },
      { key: 'actions', label: 'Acciones', type: 'custom', width: '200px', alignCell: 'right', alignHeader: 'right' }
    ],
    serverSide: false,
    tableName: 'docsCustomCells'
  } satisfies TableConfig<DemoPerson>,
  expandableCountries: {
    columns: [{ key: 'name', label: 'País', type: 'text', sortable: true }],
    expandable: {
      key: 'name',
      subRowsKey: 'cities',
      subTable: {
        columns: [
          { key: 'name', label: 'Ciudad', type: 'text', sortable: true },
          { key: 'population', label: 'Habitantes', type: 'number', sortable: true, alignCell: 'right', alignHeader: 'right' }
        ],
        tableName: 'docsExpandableCities'
      }
    },
    tableName: 'docsExpandableCountries'
  } satisfies TableConfig<DemoCountry, DemoCity>,
  expandableRightPlus: {
    columns: [{ key: 'name', label: 'País (icono + a la derecha)', type: 'text' }],
    expandable: {
      key: 'name',
      subRowsKey: 'cities',
      togglePosition: 'after',
      toggleIconSvg: AESY_ICON_PLUS,
      subTable: {
        columns: [
          { key: 'name', label: 'Ciudad', type: 'text', sortable: true },
          { key: 'population', label: 'Habitantes', type: 'number', sortable: true, alignCell: 'right', alignHeader: 'right' }
        ],
        tableName: 'docsExpandableCitiesPlus'
      }
    },
    tableName: 'docsExpandableRightPlus'
  } satisfies TableConfig<DemoCountry, DemoCity>,
  expandableCustomButton: {
    columns: [{ key: 'name', label: 'País (botón propio a la derecha)', type: 'text' }],
    expandable: {
      key: 'name',
      subRowsKey: 'cities',
      togglePosition: 'after',
      headerLabel: 'Ciudades',
      subTable: {
        columns: [
          { key: 'name', label: 'Ciudad', type: 'text', sortable: true },
          { key: 'population', label: 'Habitantes', type: 'number', sortable: true, alignCell: 'right', alignHeader: 'right' }
        ],
        tableName: 'docsExpandableCitiesButton'
      }
    },
    tableName: 'docsExpandableCustomButton'
  } satisfies TableConfig<DemoCountry, DemoCity>,
  themedPeople: {
    columns: [
      { key: 'name', label: 'Nombre', type: 'text', sortable: true },
      { key: 'role', label: 'Rol', type: 'text', sortable: true },
      { key: 'age', label: 'Edad', type: 'number', sortable: true, alignCell: 'right', alignHeader: 'right' },
      { key: 'actions', label: 'Acciones', type: 'custom', width: '220px', alignCell: 'right', alignHeader: 'right' }
    ],
    tableName: 'docsThemedPeople'
  } satisfies TableConfig<DemoPerson>,
  customRows: {
    clickableRows: true,
    columns: [
      { key: 'name', label: 'Equipo', type: 'text', sortable: true, filterable: true },
      { key: 'age', label: 'Edad', type: 'number', sortable: true }
    ],
    rowClass: (person: DemoPerson) => (person.age >= 40 ? 'row-senior' : []),
    tableName: 'docsCustomRows'
  } satisfies TableConfig<DemoPerson>,
  emptyPeople: {
    columns: [
      { key: 'name', label: 'Nombre', type: 'text' },
      { key: 'role', label: 'Rol', type: 'text' }
    ],
    tableName: 'docsEmptyPeople'
  } satisfies TableConfig<DemoPerson>,
  expandableDetail: {
    columns: [{ key: 'name', label: 'País (panel libre)', type: 'text' }],
    expandable: { key: 'name' },
    tableName: 'docsExpandableDetail'
  } satisfies TableConfig<DemoCountry>,
  expandablePeople: {
    columns: [
      { key: 'name', label: 'Nombre', type: 'text', sortable: true },
      { key: 'role', label: 'Rol', type: 'text' }
    ],
    expandable: {
      key: 'name',
      singleExpansion: true,
      subTable: {
        columns: [
          { key: 'product', label: 'Producto', type: 'text', sortable: true },
          { key: 'amount', label: 'Importe (€)', type: 'number', sortable: true, alignCell: 'right', alignHeader: 'right' }
        ],
        tableName: 'docsExpandableOrders'
      }
    },
    tableName: 'docsExpandablePeople'
  } satisfies TableConfig<DemoPerson, DemoOrder>,
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
  citiesWithoutPagination: {
    columns: [
      { key: 'name', label: 'Ciudad', type: 'text', sortable: true },
      { key: 'country', label: 'País', type: 'text', sortable: true },
      { key: 'population', label: 'Habitantes', type: 'number', sortable: true, alignCell: 'right', alignHeader: 'right' }
    ],
    serverSide: false,
    tableName: 'docsCitiesWithoutPagination'
  } satisfies TableConfig<DemoCity>,
  customPagination: {
    columns: DEMO_PEOPLE_COLUMNS.map(column => ({ ...column, filterable: false, fixed: false })),
    serverSide: false,
    tableName: 'docsCustomPagination'
  } satisfies TableConfig<DemoPerson>
};
