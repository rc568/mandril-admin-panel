export interface GetProductsFilters {
  page: number;
  limit: number;
  catalogId?: string;
  categoryId?: string;
  isActive?: string;
  minPrice?: string;
  maxPrice?: string;
  orderBy?: string;
}
