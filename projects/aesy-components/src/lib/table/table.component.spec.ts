import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TableCellDirective } from './directives/table-cell.directive';
import { RequestData } from './models/request-data.interface';
import { TableConfig } from './models/table-config.interface';
import { TableComponent } from './table.component';

interface TestPerson {
  id: number;
  name: string;
}

const TEST_PEOPLE: TestPerson[] = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Luis' },
  { id: 3, name: 'Marta' }
];

@Component({
  imports: [TableCellDirective, TableComponent],
  template: `
    <aesy-table [data]="people" [config]="config()" (requestData)="lastRequestData.set($event)">
      <ng-template aesyTableCell="actions" [aesyTableCellRows]="people" let-person>
        <button class="remove-button" type="button">Quitar {{ person.name }}</button>
      </ng-template>
    </aesy-table>
  `
})
class TableHostComponent {
  readonly config = signal<TableConfig<TestPerson>>({
    columns: [
      { key: 'name', label: 'Nombre', type: 'text', sortable: true, filterable: true },
      { key: 'actions', label: 'Acciones', type: 'custom' }
    ],
    tableName: 'people'
  });
  readonly lastRequestData = signal<RequestData | null>(null);
  readonly people: TestPerson[] = TEST_PEOPLE;
}

describe('TableComponent', () => {
  let fixture: ComponentFixture<TableHostComponent>;
  let hostElement: HTMLElement;

  async function createHost(config?: TableConfig<TestPerson>): Promise<void> {
    fixture = TestBed.createComponent(TableHostComponent);
    if (config) fixture.componentInstance.config.set(config);
    hostElement = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHostComponent],
      providers: [provideRouter([]), provideZonelessChangeDetection()]
    }).compileComponents();
  });

  it('sin paginationMetaConfig muestra todas las filas y no pinta la paginación', async () => {
    await createHost();

    expect(hostElement.querySelectorAll('.aesy-table-row').length).toBe(TEST_PEOPLE.length);
    expect(hostElement.querySelector('aesy-table-pagination')).toBeNull();
  });

  it('pinta las celdas de una columna custom con su aesyTableCell', async () => {
    await createHost();

    const removeButtons = Array.from(hostElement.querySelectorAll('.remove-button')).map(button => button.textContent?.trim());
    expect(removeButtons).toEqual(['Quitar Ana', 'Quitar Luis', 'Quitar Marta']);
  });

  it('una columna custom no se puede ordenar', async () => {
    await createHost();

    const headerLabels = Array.from(hostElement.querySelectorAll<HTMLElement>('.aesy-table-th-label'));
    const actionsHeaderLabel = headerLabels.find(label => label.textContent?.trim() === 'Acciones');
    const nameHeaderLabel = headerLabels.find(label => label.textContent?.trim() === 'Nombre');
    expect(actionsHeaderLabel?.classList.contains('aesy-table-th-sortable')).toBe(false);
    expect(nameHeaderLabel?.classList.contains('aesy-table-th-sortable')).toBe(true);
  });

  it('en modo servidor sin paginación pide todas las filas (page y rowsPerPageCurrent a null)', async () => {
    await createHost({
      columns: [{ key: 'name', label: 'Nombre', type: 'text', sortable: true }],
      serverSide: true,
      tableName: 'serverPeople'
    });

    hostElement.querySelector<HTMLElement>('.aesy-table-th-sortable')?.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.lastRequestData()).toEqual({ page: null, rowsPerPageCurrent: null, filters: {}, sortByKey: 'name', sortDirection: 'asc' });
  });
});
