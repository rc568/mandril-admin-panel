import { useContext } from 'react';
import { ProductCreateContext } from '../context/product-create-context';

export const useProductCreateContext = () => {
  const value = useContext(ProductCreateContext);
  if (!value) throw Error('No context provided');

  return value;
};
