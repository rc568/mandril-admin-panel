import { getProductById } from '../api/products.api';
import type { ProductMapped } from '../interfaces/api/get-products-mapped.interface';
import { mapProductToDisplay } from '../mappers/get-products-by-page.mapper';

export const getProductByIdAction = async (id: string): Promise<ProductMapped> => {
  const product = await getProductById(id);
  return mapProductToDisplay(product);
};
