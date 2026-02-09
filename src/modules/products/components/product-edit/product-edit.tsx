import { Button } from '@/components/ui/button';
import { useAttributes } from '@/hooks/query';
import { FormProvider, useForm } from 'react-hook-form';
import { ProductEditProvider } from '../../context/product-edit-context';
import type { ProductMapped } from '../../interfaces/api/get-products-mapped.interface';
import type { EditProductForm } from '../../interfaces/ui/create-product-form.interface';
import type { ProductEditFormMapper } from '../../interfaces/ui/product-edit-form.interface';
import { ProductEditGeneralInfo } from './product-edit-general-info';
import { ProductEditStatsCard } from './product-edit-stats-card';
import { ProductEditVariantsSection } from './product-edit-variants-section';

interface Props {
  productForm: ProductEditFormMapper;
  productUI: ProductMapped;
}

export const ProductEdit = ({ productForm, productUI }: Props) => {
  const form = useForm<EditProductForm>({
    defaultValues: productForm
  });

  const { data: attributes } = useAttributes();
  const variantsCode = productUI.productVariant.map((v) => ({ variantId: v.id, code: v.code }));

  const onSubmit = (data: any) => console.log(data);

  return (
    <FormProvider {...form}>
      <ProductEditProvider variantsCode={variantsCode}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.5fr] gap-6 my-6">
            <ProductEditGeneralInfo attributes={attributes ?? []} onAdd={() => {}} />

            <ProductEditStatsCard createdAt={productUI.createdAt} createdBy={productUI.createdBy} />

            <div className="cols-span-1 lg:col-span-2">
              <ProductEditVariantsSection attributes={attributes ?? []} />
            </div>

            <Button type="submit" className="w-fit cols-span-1 lg:col-start-2 ml-auto">
              Guardar cambios
            </Button>
          </div>
        </form>
      </ProductEditProvider>
    </FormProvider>
  );
};
