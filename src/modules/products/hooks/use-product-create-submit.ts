import { useProductMutation } from '@/hooks/query';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import type { CreateProductForm, ProductMapped } from '../interfaces/ui';
import { productCreateCleanPayload } from '../utils/product-create-clean-payload';
import { createProductSchema } from '../validators/product.validators';

interface Props {
  onCreateSuccess: (data: ProductMapped) => void;
}

export const useProductCreateSubmit = ({ onCreateSuccess }: Props) => {
  const { createProduct } = useProductMutation();

  const form = useForm<CreateProductForm>({
    resolver: standardSchemaResolver(createProductSchema),
    defaultValues: { variants: [{ attributes: [], price: 0, purchasePrice: 0, quantityInStock: 0 }] }
  });

  const { handleSubmit } = form;

  const onSubmit = async (newProduct: CreateProductForm) => {
    const payload = productCreateCleanPayload(newProduct);

    await createProduct.mutateAsync(payload, {
      onSuccess: (res) => onCreateSuccess(res)
    });
  };

  return {
    form,
    onSubmit: handleSubmit(onSubmit),
    isPending: createProduct.isPending
  };
};
