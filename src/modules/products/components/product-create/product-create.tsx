import { Button } from '@/components/ui/button';
import { useAttributes, useProduct } from '@/hooks/query';
import { useState } from 'react';
import { useProductCreateForm } from '../../hooks/use-product-create-form';
import type { CreateProductForm } from '../../interfaces/ui/create-product-form.interface';
import { ProductAddAttributesDialog } from './../product-create/product-add-attributes-dialog';
import { ProductGeneralInfo } from './product-general-info';
import { ProductVariantsSection } from './product-variants-section';

export const ProductCreate = () => {
  const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);

  const {
    form: { register, handleSubmit, control, formState },
    attributesFA,
    selectedAttributesId,
    variantsFA,
    checkedAttributeId,
    clearAttributes
  } = useProductCreateForm();

  const { data: attributes } = useAttributes();

  const { mutation: mutateProduct } = useProduct();

  const onSubmit = async (newProduct: CreateProductForm) => {
    await mutateProduct.mutateAsync(newProduct, {
      onSuccess: (res) => console.log('producto creado', res),
      onError: (res) => console.log(res.message)
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 my-6">
        <ProductGeneralInfo
          attributes={attributes ?? []}
          attributesField={attributesFA}
          register={register}
          control={control}
          errors={formState.errors}
          onAdd={() => setIsAttributesModalOpen(true)}
        />

        <ProductVariantsSection
          register={register}
          control={control}
          errors={formState.errors}
          attributes={attributes ?? []}
          attributesField={attributesFA}
          variantsField={variantsFA}
        />

        <Button type="submit" disabled={mutateProduct.isPending} className="w-fit justify-self-end">
          Crear producto
        </Button>

        <ProductAddAttributesDialog
          open={isAttributesModalOpen}
          onOpenChange={setIsAttributesModalOpen}
          attributes={attributes ?? []}
          selectedAttributesId={selectedAttributesId}
          onToggle={checkedAttributeId}
          cleanAttributes={clearAttributes}
        />
      </div>
    </form>
  );
};
