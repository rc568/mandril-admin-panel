import { Button } from '@/components/ui/button';
import { useAttributes, useProductMutation } from '@/hooks/query';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { ProductCreateGeneralInfo, ProductCreateVariantsSection } from '.';
import { ProductCreateProvider } from '../../context/product-create-context';
import type { CreateProductForm } from '../../interfaces/ui/create-product-form.interface';
import { createProductSchema } from '../../validators/product.validators';
import { ProductAddAttributesDialog } from './product-add-attributes-dialog';

export const ProductCreate = () => {
  const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);
  const navigate = useNavigate();

  const form = useForm<CreateProductForm>({
    resolver: standardSchemaResolver(createProductSchema),
    defaultValues: { variants: [{ attributes: [], price: 0, purchasePrice: 0, quantityInStock: 0 }] }
  });

  const { data: attributes } = useAttributes();

  const { createProduct } = useProductMutation();

  const onSubmit = async (newProduct: CreateProductForm) => {
    await createProduct.mutateAsync(newProduct, {
      onSuccess: (res) => {
        navigate(`/productos/editar/${res.slug}`);
      }
    });
  };

  return (
    <FormProvider {...form}>
      <ProductCreateProvider>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 my-6">
            <ProductCreateGeneralInfo attributes={attributes ?? []} onAdd={() => setIsAttributesModalOpen(true)} />

            <ProductCreateVariantsSection attributes={attributes ?? []} />

            <Button type="submit" disabled={createProduct.isPending} className="w-fit ml-auto">
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
