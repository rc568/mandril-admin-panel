import { createContext } from 'react';
import { useProductEditForm } from '../hooks/use-product-edit-form';

export interface VariantsCode {
  variantId: number;
  code: string;
}

type ProductEditContextProps = ReturnType<typeof useProductEditForm> & { variantsCode: VariantsCode[] };

export const ProductEditContext = createContext<ProductEditContextProps | null>(null);
