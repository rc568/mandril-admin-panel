import type { Product } from './product.interface';

interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface GetProductsApiResponse {
  pagination: Pagination;
  products: Product[];
}

export interface GetProductsQueryParams {
  page: number;
  limit: number;
  catalogId?: string;
  categoryId?: string;
  isActive?: string;
  minPrice?: string;
  maxPrice?: string;
  orderBy?: string;
}
