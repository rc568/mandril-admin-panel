import type { CreateProductPayload } from '../interfaces/api';
import type { CreateProductForm } from '../interfaces/ui';

export const productCreateCleanPayload = (product: CreateProductForm): CreateProductPayload => {
  const { attributesId, description, variants, ...rest } = product;

  const payload: CreateProductPayload = {
    ...rest,
    ...(description?.trim() ? { description: description.trim() } : {}),
    ...(attributesId && attributesId.length > 0 ? { attributesId } : {}),
    variants: variants.map((variant) => {
      const { attributes, ...variantFields } = variant;

      return {
        ...variantFields,
        ...(attributes && attributes.length > 0 ? { attributes } : {})
      };
    })
  };

  return payload;
};
