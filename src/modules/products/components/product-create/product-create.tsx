import { Button } from '@/components/ui/button';
import { useAttributes, useCatalogs, useCategories } from '@/hooks/query';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { createProductAction } from '../../actions/create-product.action';
import { useProductCreateForm } from '../../hooks/use-product-create-form';
import type { CreateProductForm } from '../../interfaces/ui/create-product-form.interface';
import { ProductAddAttributesDialog } from './../product-create/product-add-attributes-dialog';
import { ProductGeneralInfo } from './product-general-info';
import { ProductVariantsSection } from './product-variants-section';

export const ProductCreate = () => {
  const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);

  const { form, attributesFA, selectedAttributesId, variantsFA, checkedAttributeId, clearAttributes } =
    useProductCreateForm();

  const { register, handleSubmit, control, formState } = form;

  const { data: categories } = useCategories();
  const { data: catalogs } = useCatalogs();
  const { data: attributes } = useAttributes();

  const createProductMutation = useMutation({
    mutationFn: createProductAction
  });

  const onSubmit = async (newProduct: CreateProductForm) => {
    await createProductMutation.mutateAsync(newProduct, {
      onSuccess: (res) => console.log('producto creado', res),
      onError: (res) => console.log(res.message)
    });
  };

  const { isPending } = createProductMutation;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 my-6">
        <ProductGeneralInfo
          attributes={attributes ?? []}
          catalogs={catalogs ?? []}
          categories={categories ?? []}
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

        <Button type="submit" disabled={isPending} className="w-fit justify-self-end">
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
