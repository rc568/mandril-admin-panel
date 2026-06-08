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
import { productEditPayload } from '../utils/product-edit-payload';
import { editProductSchema } from '../validators/product.validators';

interface Props {
  productId: string;
  previousSlug: string;
  defaultValues: ProductEditFormMapper;
  onNoChanges: () => void;
  onEditSuccess: (data: ProductMapped) => void;
}

export const useProductEditSubmit = ({ productId, previousSlug, defaultValues, onNoChanges, onEditSuccess }: Props) => {
  const { editMutation } = useProductMutation();

  const form = useForm<EditProductForm>({
    resolver: standardSchemaResolver(editProductSchema),
    defaultValues: defaultValues
  });

  const {
    formState: { dirtyFields },
    handleSubmit,
    reset
  } = form;

  const onSubmit = async (data: EditProductForm) => {
    const { variants: _, attributesId: __, ...generalDirtyFields } = dirtyFields;

    const filteredGeneralData = filterChangedFormFields(generalDirtyFields, data);

    const hasVariantChanges = dirtyFields.variants && dirtyFields.variants.some((v) => v !== undefined);

    const payload: EditProductForm = {
      ...filteredGeneralData,
      ...(hasVariantChanges && data.attributesId?.length !== 0 ? { attributesId: data.attributesId } : {}),
      ...(hasVariantChanges ? { variants: data.variants } : {})
    };

    console.log('data', data);
    console.log('payload', payload);

    // Revisar esta función
    // Pendiente agregar
    const payload2 = productEditPayload(payload);

    console.log('payload', payload2);

    // const filterData = filterChangedFormFields(dirty, data);

    // if (!filterData || isEmptyPlainObject(filterData)) {
    //   onNoChanges();
    //   return;
    // }

    if (isEmptyPlainObject(payload2)) {
      onNoChanges();
      return;
    }

    await editMutation.mutateAsync(
      { id: productId, body: payload },
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
