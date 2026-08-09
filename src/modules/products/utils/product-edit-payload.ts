import { filterChangedFormFields } from '@/lib/react-hook-form/utils';
import type { FormState } from 'react-hook-form';
import type { EditProductForm } from '../interfaces/ui';

export const getProductEditPayload = (
  dataForm: EditProductForm,
  dirtyFields: FormState<EditProductForm>['dirtyFields']
): EditProductForm => {
  const { variants: _, attributesId: __, ...generalDirtyFields } = dirtyFields;
  const { attributesId: attributesIdForm, variants: variantsForm } = dataForm;

  const generalDataPayload = filterChangedFormFields(generalDirtyFields, dataForm);

  const hasOnlyOneVariant = attributesIdForm?.length === 0 && variantsForm?.length === 1;
  const hasVariantFieldsChanges = dirtyFields.variants && dirtyFields.variants.some((v) => v !== undefined);

  const payload: EditProductForm = {
    ...(generalDataPayload ?? {}),
    ...(hasVariantFieldsChanges
      ? hasOnlyOneVariant
        ? {
            variants: variantsForm?.map((v) => {
              const { attributes: _attributes, ...variant } = v;
              return { ...variant };
            })
          }
        : {
            variants: variantsForm,
            attributesId: attributesIdForm
          }
      : {})
  };

  return payload;
};
