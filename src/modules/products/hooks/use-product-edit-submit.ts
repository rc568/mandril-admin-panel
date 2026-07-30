import { useProductMutation } from '@/hooks/query';
import { productKeys } from '@/hooks/query/product/products.keys';
import { isEmptyPlainObject } from '@/lib/object-utils';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import type { EditProductForm, ProductMapped } from '../interfaces/ui';
import { mapProductToEditForm } from '../mappers/product-to-edit-form.mapper';
import { getProductEditPayload } from '../utils/product-edit-payload';
import { editProductSchema } from '../validators/product.validators';

interface Props {
  productId: string;
  previousSlug: string;
  defaultValues: EditProductForm;
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
    const payload = getProductEditPayload(data, dirtyFields);

    if (isEmptyPlainObject(payload)) {
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
