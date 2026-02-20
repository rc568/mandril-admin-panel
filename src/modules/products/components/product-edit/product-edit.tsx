import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useHandleTooltip } from '@/hooks/common/useHandleTooltip';
import { useAttributes, useProductMutation } from '@/hooks/query';
import { productKeys } from '@/hooks/query/product/products.keys';
import { isEmptyPlainObject } from '@/lib/object-utils';
import { filterChangedFormFields } from '@/lib/react-hook-form/utils';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { messages } from '../../constants/products.messages';
import { ProductEditProvider } from '../../context/product-edit-context';
import type { ProductMapped } from '../../interfaces/api/get-products-mapped.interface';
import type { EditProductForm } from '../../interfaces/ui/create-product-form.interface';
import type { ProductEditFormMapper } from '../../interfaces/ui/product-edit-form.interface';
import { editProductSchema } from '../../validators/product.validators';
import { ProductEditGeneralInfo } from './product-edit-general-info';
import { ProductEditStatsCard } from './product-edit-stats-card';
import { ProductEditVariantsSection } from './product-edit-variants-section';

interface Props {
  productForm: ProductEditFormMapper;
  productUI: ProductMapped;
}

export const ProductEdit = ({ productForm, productUI }: Props) => {
  const navigate = useNavigate();

  const { open: openTooltip, show: showToolTip } = useHandleTooltip();

  const form = useForm<EditProductForm>({
    resolver: standardSchemaResolver(editProductSchema),
    defaultValues: productForm
  });

  const {
    formState: { dirtyFields },
    handleSubmit
  } = form;

  const { data: attributes } = useAttributes();
  const { editMutation } = useProductMutation();
  const variantsCode = productUI.productVariant.map((v) => ({ variantId: v.id, code: v.code }));

  const onSubmit = async (data: EditProductForm) => {
    const filterData = filterChangedFormFields(dirtyFields, data);
    if (!filterData || isEmptyPlainObject(filterData)) {
      showToolTip();
      return;
    }

    await editMutation.mutateAsync(
      { id: productUI.id.toString(), body: filterData },
      {
        onSuccess: (res) => {
          navigate(`/productos/editar/${res.slug}`);
          queryClient.invalidateQueries({ queryKey: [productKeys.detail(productUI.slug)] });
        }
      }
    );
  };

  return (
    <FormProvider {...form}>
      <ProductEditProvider variantsCode={variantsCode}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.5fr] gap-6 my-6">
            <ProductEditGeneralInfo attributes={attributes ?? []} onAdd={() => {}} />

            <ProductEditStatsCard createdAt={productUI.createdAt} createdBy={productUI.createdBy} />

            <div className="cols-span-1 lg:col-span-2">
              <ProductEditVariantsSection attributes={attributes ?? []} />
            </div>

            <Tooltip open={openTooltip}>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  className="w-fit cols-span-1 lg:col-start-2 ml-auto"
                  disabled={editMutation.isPending}
                >
                  Guardar cambios
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" variant="outline" size="md">
                <p>{messages.PRODUCT_NOT_MODIFIED}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </form>
      </ProductEditProvider>
    </FormProvider>
  );
};
