import { useFieldArray, useFormContext } from 'react-hook-form';
import type { EditProductForm } from '../interfaces/ui/create-product-form.interface';

export const useProductEditForm = () => {
  const { getValues, setValue } = useFormContext<EditProductForm>();

  const variantsFA = useFieldArray<EditProductForm, 'variants'>({
    name: 'variants'
  });

  const attributesFA = useFieldArray<EditProductForm, 'attributesId'>({
    name: 'attributesId'
  });

  const selectedAttributesId = attributesFA.fields.map((attr) => attr.attributeId);

  // const checkedAttributeId = (attributeId: number) => {
  //   const attributes = getValues('attributesId') ?? [];
  //   const variants = getValues('variants') ?? [];

  //   const index = attributes.findIndex((attrField) => attrField.attributeId === attributeId);
  //   const newAttributesLength = index >= 0 ? attributes.length - 1 : attributes.length + 1;

  //   if (index >= 0) {
  //     attributesFA.remove(index);
  //   } else {
  //     attributesFA.append({ attributeId: attributeId });
  //   }

  //   if (newAttributesLength > 0 && variants.length === 1) {
  //     return variantsFA.append({ price: 0, purchasePrice: 0, quantityInStock: 0, attributes: [] });
  //   }

  //   if (newAttributesLength <= 0 && variants.length > 1) {
  //     variantsFA.remove(variants.map((_, index) => index).slice(1));
  //     setValue(`variants.${0}.attributes`, []);
  //   }
  // };

  // const clearAttributes = () => {
  //   const variants = getValues('variants');
  //   variantsFA.remove(variants.map((_, index) => index).slice(1));
  //   setValue(`variants.${0}.attributes`, []);
  //   attributesFA.remove();
  // };

  return {
    variantsFA,
    attributesFA,
    selectedAttributesId
    // checkedAttributeId,
    // clearAttributes
  };
};
