import { Button } from '@/components/ui/button';
import { useAttributes, useProduct } from '@/hooks/query';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ProductCreateProvider } from '../../context/product-create-context';
import type { CreateProductForm } from '../../interfaces/ui/create-product-form.interface';
import { createProductSchema } from '../../validators/product.validators';
import { ProductAddAttributesDialog } from './product-add-attributes-dialog';
import { ProductGeneralInfo } from './product-general-info';
import { ProductVariantsSection } from './product-variants-section';

export const ProductCreate = () => {
  const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);

  const form = useForm<CreateProductForm>({
    resolver: standardSchemaResolver(createProductSchema),
    defaultValues: { variants: [{ attributes: [], price: 0, purchasePrice: 0, quantityInStock: 0 }] }
  });

  const { data: attributes } = useAttributes();

  const { mutation: mutateProduct } = useProduct();

  const onSubmit = async (newProduct: CreateProductForm) => {
    await mutateProduct.mutateAsync(newProduct, {
      onSuccess: (res) => console.log('producto creado', res),
      onError: (res) => console.log(res.message)
    });
  };

  return (
    <FormProvider {...form}>
      <ProductCreateProvider>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 my-6">
            <ProductGeneralInfo attributes={attributes ?? []} onAdd={() => setIsAttributesModalOpen(true)} />

            <ProductVariantsSection attributes={attributes ?? []} />

            <Button type="submit" disabled={mutateProduct.isPending} className="w-fit justify-self-end">
              Crear producto
            </Button>

            <ProductAddAttributesDialog
              open={isAttributesModalOpen}
              onOpenChange={setIsAttributesModalOpen}
              attributes={attributes ?? []}
            />
          </div>
        </form>
      </ProductCreateProvider>
    </FormProvider>
  );
};
