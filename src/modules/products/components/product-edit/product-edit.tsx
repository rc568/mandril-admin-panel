import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useHandleTooltip } from '@/hooks/common/useHandleTooltip';
import { useAttributes } from '@/hooks/query';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { messages } from '../../constants/products.messages';

import { ProductEditProvider } from '../../context/product-edit-provider';
import { useProductEditSubmit } from '../../hooks/use-product-edit-submit';
import type { EditProductForm, ProductMapped } from '../../interfaces/ui';
import { ProductAddAttributesDialog } from './product-add-attributes-dialog';
import { ProductEditGeneralInfo } from './product-edit-general-info';
import { ProductEditStatsCard } from './product-edit-stats-card';
import { ProductEditVariantsSection } from './product-edit-variants-section';

interface Props {
  productForm: EditProductForm;
  productUI: ProductMapped;
}

export const ProductEdit = ({ productForm, productUI }: Props) => {
  const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);
  const navigate = useNavigate();

  const { open: openTooltip, show: showToolTip } = useHandleTooltip();

  const { data: attributes } = useAttributes();
  const variantsCode = productUI.productVariant.map((v) => ({ variantId: v.id, code: v.code }));

  const { form, isPending, onSubmit } = useProductEditSubmit({
    productId: productUI.id.toString(),
    previousSlug: productUI.slug,
    defaultValues: productForm,
    onNoChanges: showToolTip,
    onEditSuccess: (res) => navigate(`/productos/editar/${res.slug}`)
  });

  return (
    <FormProvider {...form}>
      <ProductEditProvider variantsCode={variantsCode}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.5fr] gap-6 my-6">
            <ProductEditGeneralInfo attributes={attributes ?? []} onAdd={() => setIsAttributesModalOpen(true)} />

            <ProductEditStatsCard createdAt={productUI.createdAt} createdBy={productUI.createdBy} />

            <div className="cols-span-1 lg:col-span-2">
              <ProductEditVariantsSection />
            </div>

            <Tooltip open={openTooltip}>
              <TooltipTrigger asChild>
                <Button type="submit" className="w-fit col-span-1 lg:col-start-2 ml-auto" disabled={isPending}>
                  {isPending ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" variant="outline" size="md">
                <p>{messages.PRODUCT_NOT_MODIFIED}</p>
              </TooltipContent>
            </Tooltip>

            <ProductAddAttributesDialog
              open={isAttributesModalOpen}
              onOpenChange={setIsAttributesModalOpen}
              attributes={attributes ?? []}
            />
          </div>
        </form>
      </ProductEditProvider>
    </FormProvider>
  );
};
