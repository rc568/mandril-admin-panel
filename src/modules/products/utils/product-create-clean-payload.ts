import type { CreateProductForm } from '../interfaces/ui';

export const productCreateCleanPayload = (product: CreateProductForm): CreateProductForm => {
  const { attributesId, variants, ...rest } = product;

  const payload: CreateProductForm = {
    ...rest,
    ...(attributesId?.length === 0 ? {} : attributesId),
    variants: variants.map((variant) => {
      const { attributes, ...rest } = variant;

      return {
        ...rest,
        ...(attributesId?.length === 0 ? {} : attributes)
      };
    })
  };

  return payload;
};
