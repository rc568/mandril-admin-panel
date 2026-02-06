import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/get-all-attributes.interface';
import { useFormContext, useWatch } from 'react-hook-form';
import type { EditProductForm } from '../../interfaces/ui/create-product-form.interface';
import { ProductGeneralInfoUI } from '../common/product-general-info-ui';

interface Props {
  attributes: GetAttributesApiResponse;
  onAdd: () => void;
}

export const ProductEditGeneralInfo = ({ attributes, onAdd }: Props) => {
  const form = useFormContext<EditProductForm>();
  const attributesField = useWatch({ control: form.control, name: 'attributesId' });

  return (
    <ProductGeneralInfoUI<EditProductForm>
      attributes={attributes}
      onAdd={onAdd}
      form={form}
      attributesField={attributesField}
    />
  );
};
