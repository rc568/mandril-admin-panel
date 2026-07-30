import { createProduct } from '../api/products.api';
import type { CreateProductPayload } from '../interfaces/api';
import { mapProductToDisplay } from '../mappers/get-products-by-page.mapper';

export const createProductAction = async (body: CreateProductPayload) => {
  const newProduct = await createProduct(body);
  return mapProductToDisplay(newProduct);
};
