import { useProductMutation } from '@/hooks/query';
import { productKeys } from '@/hooks/query/product/products.keys';
import { isEmptyPlainObject } from '@/lib/object-utils';
import { filterChangedFormFields } from '@/lib/react-hook-form/utils';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import type { ProductMapped } from '../interfaces/api/get-products-mapped.interface';
import type { EditProductForm } from '../interfaces/ui/create-product-form.interface';
import type { ProductEditFormMapper } from '../interfaces/ui/product-edit-form.interface';
import { mapProductToEditForm } from '../mappers/product-to-edit-form.mapper';
import { editProductSchema } from '../validators/product.validators';

interface Props {
  productId: string;
  previousSlug: string;
  productForm: ProductEditFormMapper;
  onNoChanges: () => void;
  onEditSuccess: (data: ProductMapped) => void;
}

export const useProductEditSubmit = ({ productId, previousSlug, productForm, onNoChanges, onEditSuccess }: Props) => {
  const { editMutation } = useProductMutation();

  const form = useForm<EditProductForm>({
    resolver: standardSchemaResolver(editProductSchema),
    defaultValues: productForm
  });

  const {
    formState: { dirtyFields },
    handleSubmit,
    reset
  } = form;

  const onSubmit = async (data: EditProductForm) => {
    const { variants, ...rest } = dirtyFields;

    const dirty = {
      ...rest,
      ...(variants?.length
        ? {
            variants: variants.map((v) => {
              const { attributes, ...rest } = v;

              return {
                ...rest,
                variantId: true,
                ...(attributes?.length
                  ? { attributes: attributes.map((atrr) => ({ ...atrr, attributeId: true })) }
                  : {})
              };
            })
          }
        : {})
    };

    const filterData = filterChangedFormFields(dirty, data, ['variantId', 'attributeId']);
    if (!filterData || isEmptyPlainObject(filterData)) {
      onNoChanges();
      return;
    }

    await editMutation.mutateAsync(
      { id: productId, body: filterData },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: productKeys.detail(previousSlug) });
          reset(mapProductToEditForm(res));
          onEditSuccess(res);
        }
      }
    );
  };

  return {
    form,
    onSubmit: handleSubmit(onSubmit),
    isPending: editMutation.isPending
  };
};
