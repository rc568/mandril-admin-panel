import type { PropsWithChildren } from 'react';
import { useProductCreateForm } from '../hooks/use-product-create-form';
import { ProductCreateContext } from './product-create-context';

export const ProductCreateProvider = ({ children }: PropsWithChildren) => {
  const value = useProductCreateForm();

  return <ProductCreateContext value={value}>{children}</ProductCreateContext>;
};
