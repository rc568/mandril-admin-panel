import type { ApiPayload } from './get-products.interface';
import type { Product, ProductVariant } from './product.interface';

export type StockStatus = 'Sin Stock' | 'Bajo Stock' | 'En Stock';

interface ProductVariantMapped extends ProductVariant {
  profitPercentage: string;
  stockStatus: StockStatus;
}

export interface ProductMapped extends Product {
  productVariant: ProductVariantMapped[];
}

export interface GetProductsMapped extends ApiPayload {
  products: ProductMapped[];
}
