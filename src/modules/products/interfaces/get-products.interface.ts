import type { Product } from './product.interface';

interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ApiPayload {
  pagination: Pagination;
  products: Product[];
}

export interface GetProductsApiResponse {
  data: ApiPayload;
}
