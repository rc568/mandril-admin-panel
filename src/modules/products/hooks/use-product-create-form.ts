import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useFieldArray, useForm } from 'react-hook-form';
import type { CreateProductForm } from '../interfaces/ui/create-product-form.interface';
import { createProductSchema } from '../validators/product.validators';

export const useProductCreateForm = () => {
  const form = useForm<CreateProductForm>({
    resolver: standardSchemaResolver(createProductSchema),
    defaultValues: { variants: [{ attributes: [], price: 0, purchasePrice: 0, quantityInStock: 0 }] }
  });

  const variantsFA = useFieldArray({
    control: form.control,
    name: 'variants'
  });

  const attributesFA = useFieldArray({
    control: form.control,
    name: 'attributesId'
  });

  const selectedAttributesId = attributesFA.fields.map((attr) => attr.attributeId);

  const checkedAttributeId = (attributeId: number) => {
    const attributes = form.getValues('attributesId') ?? [];
    const variants = form.getValues('variants') ?? [];

    const index = attributes.findIndex((attrField) => attrField.attributeId === attributeId);
    const newAttributesLength = index >= 0 ? attributes.length - 1 : attributes.length + 1;

    if (index >= 0) {
      attributesFA.remove(index);
    } else {
      attributesFA.append({ attributeId: attributeId });
    }

    if (newAttributesLength > 0 && variants.length === 1) {
      return variantsFA.append({ price: 0, purchasePrice: 0, quantityInStock: 0, attributes: [] });
    }

    if (newAttributesLength <= 0 && variants.length > 1) {
      return variantsFA.remove(variants.map((_, index) => index).slice(1));
    }
  };

  const clearAttributes = () => {
    const variants = form.getValues('variants');
    variantsFA.remove(variants.map((_, index) => index).slice(1));
    attributesFA.remove();
  };

  return {
    form,
    variantsFA,
    attributesFA,
    selectedAttributesId,
    checkedAttributeId,
    clearAttributes
  };
};
