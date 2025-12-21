import { productApi } from '../api/products.api';
import type { GetProductsMapped } from '../interfaces/get-products-mapped.interface';
import type { GetProductsApiResponse, GetProductsQueryParams } from '../interfaces/get-products.interface';
import { mapProductToDisplay } from '../mappers/get-products-by-page.mapper';

export const getProductsByPage = async ({
  limit,
  page,
  categoryId,
  catalogId,
  isActive,
  maxPrice,
  minPrice,
  orderBy
}: GetProductsQueryParams): Promise<GetProductsMapped> => {
  const params: Record<string, number | string> = {
    limit: limit,
    page: page
  };

  if (categoryId) params.categoryId = categoryId;
  if (catalogId) params.catalogId = catalogId;
  if (isActive) params.isActive = isActive;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (orderBy) params.orderBy = orderBy;

  const response = await productApi.get<GetProductsApiResponse>('/', {
    params: params
  });
  const { pagination, products } = response.data;

  return {
    pagination,
    products: products.map((p) => mapProductToDisplay(p))
  };
};
