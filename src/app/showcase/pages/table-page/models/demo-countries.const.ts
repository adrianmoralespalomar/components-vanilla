import { DEMO_CITIES } from './demo-cities.const';
import { DemoCountry } from './demo-country.interface';

export const DEMO_COUNTRIES: DemoCountry[] = [...new Set(DEMO_CITIES.map(city => city.country))].map(countryName => ({
  name: countryName,
  cities: DEMO_CITIES.filter(city => city.country === countryName)
}));
