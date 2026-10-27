import { createContext } from 'react';
import { useProductEditForm } from '../hooks/use-product-edit-form';

export interface ProductVariantSummary {
  variantId: number;
  code: string;
  availableQuantity: number;
}

type ProductEditContextProps = ReturnType<typeof useProductEditForm> & { productVariants: ProductVariantSummary[] };

export const ProductEditContext = createContext<ProductEditContextProps | null>(null);
