import { createContext, type PropsWithChildren } from 'react';
import { useProductCreateForm } from '../hooks/use-product-create-form';

type ProductCreateContextProps = ReturnType<typeof useProductCreateForm>;

export const ProductCreateContext = createContext<ProductCreateContextProps | null>(null);

export const ProductCreateProvider = ({ children }: PropsWithChildren) => {
  const value = useProductCreateForm();

  return <ProductCreateContext value={value}>{children}</ProductCreateContext>;
};
