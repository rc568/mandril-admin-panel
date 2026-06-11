import { useFieldArray, useFormContext } from 'react-hook-form';
import type { EditProductForm } from '../interfaces/ui/create-product-form.interface';

const INITIAL_VARIANT_VALUE = {
  price: 0,
  purchasePrice: 0,
  quantityInStock: 0,
  attributes: [],
  variantId: undefined,
  isActive: true
};

export const useProductEditForm = () => {
  const {
    getValues,
    formState: { defaultValues }
  } = useFormContext<EditProductForm>();

  const variantsFA = useFieldArray<EditProductForm, 'variants'>({
    name: 'variants'
  });

  const attributesFA = useFieldArray<EditProductForm, 'attributesId'>({
    name: 'attributesId'
  });

  const selectedAttributesId = attributesFA.fields.map((attr) => attr.attributeId);

  const appendVariant = () => variantsFA.append(INITIAL_VARIANT_VALUE);
  const removeVariant = (index: number) => variantsFA.remove(index);

  const checkedAttributeId = (attributeId: number) => {
    const attributesId = getValues('attributesId') ?? [];
    const variants = getValues('variants') ?? [];

    const checkAttributeIndex = attributesId.findIndex((attr) => attr.attributeId === attributeId);

    if (checkAttributeIndex >= 0) {
      attributesFA.remove(checkAttributeIndex);

      if (attributesId.length - 1 === 0 && variants.length > 0) {
        variantsFA.remove(variants.map((_, index) => index).slice(1));
      }
      return;
    }

    attributesFA.append({ attributeId: attributeId });
    if (variants.length === 1) {
      appendVariant();
    }
  };

  const clearAttributes = () => {
    const defaultAttributes = defaultValues?.attributesId as EditProductForm['attributesId'];
    attributesFA.replace(defaultAttributes ?? []);
  };

  return {
    variantsFields: variantsFA.fields,
    attributesFields: attributesFA.fields,
    selectedAttributesId,
    appendVariant,
    removeVariant,
    checkedAttributeId,
    clearAttributes,
    defaultAttributesId: defaultValues?.attributesId
      ?.map((attr) => attr?.attributeId)
      .filter((attr) => attr !== undefined)
  };
};
