import { createContext } from 'react';
import { useProductCreateForm } from '../hooks/use-product-create-form';

type ProductCreateContextProps = ReturnType<typeof useProductCreateForm>;

export const ProductCreateContext = createContext<ProductCreateContextProps | null>(null);
