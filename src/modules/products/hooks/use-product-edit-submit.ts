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
    const { variants, ...rest } = dirtyFields;

    const dirty = {
      ...rest,
      ...(variants?.length
        ? {
            variants: variants.map((v) => {
              const { attributes, ...rest } = v;

              const attributesWithId = attributes?.map((attr) => {
                const { attributeId: _attributeId, ...attrRest } = attr;
                const attrHasChanges = Object.values(attrRest).some((v) => v === true);

                if (!attrHasChanges) return undefined;

                return {
                  ...attrRest,
                  attributeId: true
                };
              });

              const variantHasChanges =
                Object.values(rest).filter((v) => v === true).length > 0 || attributesWithId?.length;

              if (!variantHasChanges) return undefined;

              return {
                ...rest,
                variantId: true,
                ...(attributesWithId?.length ? { attributes: attributesWithId } : {})
              };
            })
          }
        : {})
    };

    const filterData = filterChangedFormFields(dirty, data);

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
