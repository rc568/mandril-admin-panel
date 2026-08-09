import type { PropsWithChildren } from 'react';
import { useProductEditForm } from '../hooks/use-product-edit-form';
import { ProductEditContext, type VariantsCode } from './product-edit-context';

interface Props extends PropsWithChildren {
  variantsCode: VariantsCode[];
}

export const ProductEditProvider = ({ variantsCode, children }: Props) => {
  const editFormValues = useProductEditForm();
  const value = {
    ...editFormValues,
    variantsCode
  };

  return <ProductEditContext value={value}>{children}</ProductEditContext>;
};
