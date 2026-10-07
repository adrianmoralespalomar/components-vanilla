import { DemoProduct } from './demo-product.interface';

/** Respuesta de https://dummyjson.com/products (solo los campos que usa la demo). */
export interface DummyProductsResponse {
  limit: number;
  products: DemoProduct[];
  skip: number;
  total: number;
}
