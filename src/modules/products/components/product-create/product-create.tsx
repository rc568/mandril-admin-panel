import { Button } from '@/components/ui/button';
import { useAttributes } from '@/hooks/query';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { ProductCreateGeneralInfo, ProductCreateVariantsSection } from '.';
import { ProductCreateProvider } from '../../context/product-create-provider';
import { useProductCreateSubmit } from '../../hooks/use-product-create-submit';
import { ProductAddAttributesDialog } from './product-add-attributes-dialog';

export const ProductCreate = () => {
  const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: attributes } = useAttributes();

  const { form, onSubmit, isPending } = useProductCreateSubmit({
    onCreateSuccess: (res) => navigate(`/productos/editar/${res.slug}`)
  });

  return (
    <FormProvider {...form}>
      <ProductCreateProvider>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-6 my-6">
            <ProductCreateGeneralInfo attributes={attributes ?? []} onAdd={() => setIsAttributesModalOpen(true)} />

            <ProductCreateVariantsSection />

            <Button type="submit" disabled={isPending} className="w-fit ml-auto">
              {isPending ? 'Creando...' : 'Crear producto'}
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
