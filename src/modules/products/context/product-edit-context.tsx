import { createContext, type PropsWithChildren } from 'react';
import { useProductEditForm } from '../hooks/use-product-edit-form';

type ProductEditContextProps = ReturnType<typeof useProductEditForm> & { variantsCode: VariantsCode[] };

export const ProductEditContext = createContext<ProductEditContextProps | null>(null);

interface VariantsCode {
  variantId: number;
  code: string;
}

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
