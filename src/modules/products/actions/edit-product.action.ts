import { editProduct } from '../api/products.api';
import type { EditProductForm } from '../interfaces/ui/create-product-form.interface';
import { mapProductToDisplay } from '../mappers/get-products-by-page.mapper';

export const editProductAction = async ({ id, body }: { id: number; body: EditProductForm }) => {
  const updateProduct = await editProduct(id, body);
  return mapProductToDisplay(updateProduct);
};
