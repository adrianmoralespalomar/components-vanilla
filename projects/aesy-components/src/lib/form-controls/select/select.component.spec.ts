import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOption } from './models/select-option.interface';
import { SelectComponent } from './select.component';

const COUNTRY_OPTIONS: SelectOption[] = [
  { label: 'Alemania', value: 'DE' },
  { label: 'España', value: 'ES' },
  { label: 'Japón', value: 'JP' },
  { label: 'México', value: 'MX' }
];

@Component({
  imports: [SelectComponent],
  template: `<aesy-select [options]="COUNTRY_OPTIONS" [multiple]="multiple()" [searchable]="searchable()" [(value)]="value" />`
})
class SelectHostComponent {
  protected readonly COUNTRY_OPTIONS: SelectOption[] = COUNTRY_OPTIONS;

  readonly multiple = signal<boolean>(false);
  readonly searchable = signal<boolean>(true);
  readonly value = signal<unknown>(null);
}

describe('SelectComponent', () => {
  let fixture: ComponentFixture<SelectHostComponent>;

  const getSearchInput = (): HTMLInputElement | null => document.querySelector<HTMLInputElement>('.cdk-overlay-container .aesy-select-dropdown-search-input');
  const getVisibleOptionLabels = (): string[] => Array.from(document.querySelectorAll('.cdk-overlay-container [role=option]')).map(option => option.textContent?.trim() ?? '');

  async function openSelect(): Promise<void> {
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button.aesy-select-input-container')?.click();
    await fixture.whenStable();
  }

  async function search(text: string): Promise<void> {
    const searchInput = getSearchInput();
    if (!searchInput) throw new Error('No hay campo de búsqueda');
    searchInput.value = text;
    searchInput.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  async function pressKeyInSearch(key: string): Promise<void> {
    getSearchInput()?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectHostComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectHostComponent);
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('sin searchable no muestra el campo de búsqueda', async () => {
    fixture.componentInstance.searchable.set(false);
    await fixture.whenStable();
    await openSelect();

    expect(getSearchInput()).toBeNull();
    expect(getVisibleOptionLabels().length).toBe(COUNTRY_OPTIONS.length);
  });

  it('filtra sin distinguir mayúsculas ni tildes', async () => {
    await openSelect();
    await search('JAPON');

    expect(getVisibleOptionLabels()).toEqual(['Japón']);
  });

  it('muestra el texto de sin resultados cuando nada coincide', async () => {
    await openSelect();
    await search('zzz');

    expect(getVisibleOptionLabels()).toEqual([]);
    expect(document.querySelector('.cdk-overlay-container .aesy-select-dropdown-no-options')?.textContent?.trim()).toBe('Sin resultados');
  });

  it('Enter en el buscador elige la primera opción filtrada y cierra', async () => {
    await openSelect();
    await search('mex');
    await pressKeyInSearch('Enter');

    expect(fixture.componentInstance.value()).toBe('MX');
    expect(getSearchInput()).toBeNull();
  });

  it('en múltiple sigue abierto y mantiene la búsqueda al elegir', async () => {
    fixture.componentInstance.multiple.set(true);
    fixture.componentInstance.value.set([]);
    await fixture.whenStable();
    await openSelect();
    await search('a');
    await pressKeyInSearch('ArrowDown');
    await pressKeyInSearch('Enter');

    expect(fixture.componentInstance.value()).toEqual(['ES']);
    expect(getSearchInput()?.value).toBe('a');
  });

  it('al cerrar y volver a abrir la búsqueda empieza vacía', async () => {
    await openSelect();
    await search('esp');
    await pressKeyInSearch('Escape');
    await openSelect();

    expect(getSearchInput()?.value).toBe('');
    expect(getVisibleOptionLabels().length).toBe(COUNTRY_OPTIONS.length);
  });
});
