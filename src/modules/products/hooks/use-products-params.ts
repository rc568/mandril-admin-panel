import { useSearchParams } from 'react-router';
import { PRODUCT_ORDER_BY_ARRAY } from '../constants/product.constants';
import type { GetProductsQueryParams } from '../interfaces/get-products.interface';

interface UseTableFiltersConfig {
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
}

export const useProductsParams = (config: UseTableFiltersConfig = {}) => {
  const { defaultPage = 1, defaultLimit = 48, maxLimit = 96 } = config;

  const [searchParams, setSearchParams] = useSearchParams();

  const queryPage = searchParams.get('page') ?? defaultPage.toString();
  const queryLimit = searchParams.get('limit') ?? defaultLimit.toString();
  const queryCatalogId = searchParams.get('catalogId');
  const queryCategoryId = searchParams.get('categoryId');
  const queryIsActive = searchParams.get('isActive');
  const queryMinPrice = searchParams.get('minPrice');
  const queryMaxPrice = searchParams.get('maxPrice');
  const queryOrderBy = searchParams.get('orderBy');

  const page = Number.isNaN(parseInt(queryPage)) || parseInt(queryPage) <= 0 ? defaultPage : parseInt(queryPage);
  const limit =
    Number.isNaN(parseInt(queryLimit)) || parseInt(queryLimit) > maxLimit || parseInt(queryLimit) <= 0
      ? defaultLimit
      : parseInt(queryLimit);

  const catalogId = queryCatalogId && !Number.isNaN(Number(queryCatalogId)) ? queryCatalogId : undefined;
  const categoryId = queryCategoryId && !Number.isNaN(Number(queryCategoryId)) ? queryCategoryId : undefined;
  const isActive = queryIsActive === 'true' || queryIsActive === 'false' ? queryIsActive : undefined;
  const minPrice = queryMinPrice && !Number.isNaN(Number(queryMinPrice)) ? queryMinPrice : undefined;
  const maxPrice = queryMaxPrice && !Number.isNaN(Number(queryMaxPrice)) ? queryMaxPrice : undefined;
  const orderBy = queryOrderBy && PRODUCT_ORDER_BY_ARRAY.includes(queryOrderBy) ? queryOrderBy : undefined;

  const filters: GetProductsQueryParams = {
    limit,
    page,
    catalogId,
    categoryId,
    isActive,
    minPrice,
    maxPrice,
    orderBy
  };

  const setPage = (page: number) => {
    setSearchParams((prev) => {
      prev.set('page', page.toString());
      return prev;
    });
  };

  const setLimit = (limit: string) => {
    setSearchParams((prev) => {
      prev.set('limit', limit);
      prev.delete('page');
      return prev;
    });
  };

  const setOrderBy = (orderBy: string) => {
    setSearchParams((prev) => {
      prev.delete('page');
      prev.set('orderBy', orderBy);
      return prev;
    });
  };

  const setFilters = (newFilters: Partial<GetProductsQueryParams>) => {
    setSearchParams((prev) => {
      const newFiltersEntries = Object.entries(newFilters);

      if (newFiltersEntries.length === 0) {
        const searchParams = new URLSearchParams();
        if (limit) searchParams.set('limit', limit.toString());
        return searchParams;
      }

      if (
        newFilters.catalogId === filters.catalogId &&
        newFilters.categoryId === filters.categoryId &&
        newFilters.isActive === filters.isActive &&
        newFilters.minPrice === filters.minPrice &&
        newFilters.maxPrice === filters.maxPrice
      ) {
        return prev;
      }

      prev.delete('page');

      newFiltersEntries.forEach(([key, value]) => {
        if (!value) {
          prev.delete(key);
          return;
        }

        prev.set(key, value.toString());
      });

      return prev;
    });
  };

  return {
    filters,
    setPage,
    setLimit,
    setOrderBy,
    setFilters
  };
};
