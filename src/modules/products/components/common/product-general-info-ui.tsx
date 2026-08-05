import { InputField } from '@/components/common/form';
import { FormErrorMessage } from '@/components/common/form-error-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/api';
import { Plus } from 'lucide-react';
import type { Path, UseFormReturn } from 'react-hook-form';
import type { BaseProductFields } from '../../interfaces/ui';
import { CatalogSelectInput } from '../catalog-select-input';
import { CategorySelectInput } from '../category-select-input';
import { DescriptionField } from '../description-field';

interface Props<T extends BaseProductFields> {
  attributes: GetAttributesApiResponse;
  attributesField?: { attributeId: number }[];
  form: UseFormReturn<T>;
  onAdd: () => void;
}

export const ProductGeneralInfoUI = <T extends BaseProductFields>({
  attributes,
  attributesField,
  form,
  onAdd
}: Props<T>) => {
  const {
    register,
    control,
    formState: { errors }
  } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del producto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="Nombre"
              placeholder="Nombre del producto"
              error={errors?.name && String(errors.name.message)}
              {...register('name' as Path<T>)}
            />

            <InputField
              label="Slug"
              placeholder="Slug del producto"
              error={errors?.slug && String(errors.slug.message)}
              {...register('slug' as Path<T>)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <CategorySelectInput<T>
              control={control}
              name={'categoryId' as Path<T>}
              error={errors?.categoryId && String(errors.categoryId.message)}
            />

            <CatalogSelectInput<T>
              control={control}
              name={'catalogId' as Path<T>}
              error={errors?.catalogId && String(errors.catalogId.message)}
            />
          </div>

          <div className="space-y-2">
            <DescriptionField defaultContent="*Descripción del producto...*" />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Atributos de producto</h3>
            {errors.attributesId && <FormErrorMessage text={String(errors.attributesId.message)} />}
            <div className="flex items-center gap-2">
              {attributesField && attributesField.length > 0 ? (
                attributesField?.map((attrField) => (
                  <Badge key={attrField.attributeId} variant={'outline'} className="px-3 py-1">
                    {attributes && attributes.find((attr) => attrField.attributeId === attr.id)?.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground pr-2">Sin atributos</span>
              )}
              <Button size={'sm'} type="button" onClick={onAdd}>
                <Plus />
                Añadir atributo
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
