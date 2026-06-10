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
    const attributes = getValues('attributesId') ?? [];
    const variants = getValues('variants') ?? [];

    const attributeIndex = attributes.findIndex((attr) => attr.attributeId === attributeId);

    if (attributeIndex >= 0) {
      attributesFA.remove(attributeIndex);

      variants.forEach((_, variantIndex) => {
        const currentVariant = getValues(`variants.${variantIndex}`);
        const defaultVariantsAttr = defaultValues?.variants?.[variantIndex]?.attributes as NonNullable<
          EditProductForm['variants']
        >[number]['attributes'];

        variantsFA.update(variantIndex, {
          ...currentVariant,
          attributes: defaultVariantsAttr ?? [],
          variantId: currentVariant?.variantId!
        });
      });

      return;
    }

    attributesFA.append({ attributeId: attributeId });
  };

  const clearAttributes = () => {
    const defaultAttributes = defaultValues?.attributesId as EditProductForm['attributesId'];
    attributesFA.replace(defaultAttributes ?? []);

    variantsFA.fields.forEach((_, variantIndex) => {
      const currentVariant = getValues(`variants.${variantIndex}`);
      const defaultVariantsAttr = defaultValues?.variants?.[variantIndex]?.attributes as NonNullable<
        EditProductForm['variants']
      >[number]['attributes'];

      variantsFA.update(variantIndex, {
        ...currentVariant,
        attributes: defaultVariantsAttr ?? [],
        variantId: currentVariant?.variantId!
      });
    });
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
