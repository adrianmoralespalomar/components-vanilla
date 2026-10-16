import { DemoCity } from './demo-city.interface';

export interface DemoCountry {
  /** Filas de la subtabla: viajan dentro de la propia fila. */
  cities: DemoCity[];
  name: string;
}
