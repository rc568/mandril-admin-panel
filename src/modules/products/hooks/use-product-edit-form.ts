import { useFieldArray, useFormContext } from 'react-hook-form';
import type { EditProductForm } from '../interfaces/ui';

const INITIAL_VARIANT_VALUE = {
  price: 0,
  purchasePrice: 0,
  attributes: [],
  variantId: undefined,
  isActive: true
};

export const useProductEditForm = () => {
  const {
    getValues,
    setValue,
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
      variants.forEach((variant, variantIndex) => {
        setValue(
          `variants.${variantIndex}.attributes`,
          variant.attributes?.filter((attribute) => attribute.attributeId !== attributeId) ?? [],
          { shouldDirty: true, shouldValidate: true }
        );
      });

      if (attributesId.length - 1 === 0 && variants.length > 1) {
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
    const defaultAttributes = (defaultValues?.attributesId as EditProductForm['attributesId']) ?? [];
    const defaultAttributeIds = new Set(defaultAttributes.map((attribute) => attribute.attributeId));
    const variants = getValues('variants') ?? [];

    attributesFA.replace(defaultAttributes);
    variants.forEach((variant, variantIndex) => {
      setValue(
        `variants.${variantIndex}.attributes`,
        variant.attributes?.filter((attribute) => defaultAttributeIds.has(attribute.attributeId)) ?? [],
        { shouldDirty: true, shouldValidate: true }
      );
    });

    if (defaultAttributes.length === 0) {
      variantsFA.remove(variants.map((_, index) => index).slice(1));
    }
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
