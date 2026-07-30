import { editProduct } from '../api/products.api';
import type { EditProductPayload } from '../interfaces/api';
import { mapProductToDisplay } from '../mappers/get-products-by-page.mapper';

export const editProductAction = async ({ id, body }: { id: string; body: EditProductPayload }) => {
  const updateProduct = await editProduct(id, body);
  return mapProductToDisplay(updateProduct);
};
