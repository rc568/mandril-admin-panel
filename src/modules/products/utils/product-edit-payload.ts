import type { EditProductForm } from '../interfaces/ui/create-product-form.interface';

export const productEditPayload = (data: EditProductForm): EditProductForm => {
  const { attributesId, variants, ...rest } = data;

  const onlyOneVariant = attributesId?.length === 0 && variants?.length === 1;

  const payload: EditProductForm = {
    ...rest,
    ...(onlyOneVariant ? {} : { attributesId: attributesId }),
    ...(onlyOneVariant
      ? {
          variants: data.variants?.map((v) => {
            const { attributes, ...variant } = v;
            return { ...variant };
          })
        }
      : {
          variants
        })
  };

  return payload;
};
