import { useFieldArray, useFormContext } from 'react-hook-form';
import type { EditProductForm } from '../interfaces/ui/create-product-form.interface';

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

  const checkedAttributeId = (attributeId: number) => {
    const attributes = getValues('attributesId') ?? [];
    const variants = getValues('variants') ?? [];

    const index = attributes.findIndex((attr) => attr.attributeId === attributeId);

    if (index >= 0) {
      attributesFA.remove(index);

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
    variantsFA,
    attributesFA,
    selectedAttributesId,
    checkedAttributeId,
    clearAttributes,
    defaultAttributesId: defaultValues?.attributesId
      ?.map((attr) => attr?.attributeId)
      .filter((attr) => attr !== undefined)
  };
};
