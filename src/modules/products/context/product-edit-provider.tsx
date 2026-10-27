import type { PropsWithChildren } from 'react';
import { useProductEditForm } from '../hooks/use-product-edit-form';
import { ProductEditContext, type ProductVariantSummary } from './product-edit-context';

interface Props extends PropsWithChildren {
  productVariants: ProductVariantSummary[];
}

export const ProductEditProvider = ({ productVariants, children }: Props) => {
  const editFormValues = useProductEditForm();
  const value = {
    ...editFormValues,
    productVariants
  };

  return <ProductEditContext value={value}>{children}</ProductEditContext>;
};
