import { useContext } from 'react';
import { ProductEditContext } from '../context/product-edit-context';

export const useProductEditContext = () => {
  const value = useContext(ProductEditContext);
  if (!value) throw Error('No context provided');

  return value;
};
