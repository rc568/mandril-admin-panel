import type { ProductVariant } from './product.interface';

interface ScrollPagination {
  limit: number;
  nextOffset: number;
}

export interface SearchProductVariant extends Omit<ProductVariant, 'id' | 'isActive' | 'images'> {
  name: string;
  variantId: number;
}

export interface GetSearchProductVariantsApiResponse {
  pagination: ScrollPagination;
  products: SearchProductVariant[];
}
