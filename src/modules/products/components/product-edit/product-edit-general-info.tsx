import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/api';
import { useFormContext, useWatch } from 'react-hook-form';
import type { EditProductForm } from '../../interfaces/ui';
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
