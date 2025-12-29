import { createProduct } from '../api/products.api';
import type { CreateProductForm } from '../interfaces/ui/create-product-form.interface';
import { mapProductToDisplay } from '../mappers/get-products-by-page.mapper';

export const createProductAction = async (body: CreateProductForm) => {
  const newProduct = await createProduct(body);
  return mapProductToDisplay(newProduct);
};
