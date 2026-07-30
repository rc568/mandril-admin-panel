import { FormErrorMessage } from '@/components/common/form-error-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/get-all-attributes.interface';
import { Plus } from 'lucide-react';
import type { Path, UseFormRegister, UseFormReturn } from 'react-hook-form';
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
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Nombre del Producto
              </Label>
              <Input
                id="name"
                {...(register as unknown as UseFormRegister<BaseProductFields>)('name')}
                placeholder="Nombre del producto"
                className="bg-background"
                autoComplete="off"
              />
              {errors.name?.message && <FormErrorMessage text={String(errors.name.message)} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-medium text-foreground">
                Slug
              </Label>
              <Input
                id="slug"
                {...(register as unknown as UseFormRegister<BaseProductFields>)('slug')}
                placeholder="Slug del producto"
                className="bg-background"
                autoComplete="off"
              />
              {errors.slug?.message && <FormErrorMessage text={String(errors.slug.message)} />}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <CategorySelectInput<T> control={control} name={'categoryId' as Path<T>} errors={errors} />
            </div>

            <div className="space-y-2">
              <CatalogSelectInput<T> control={control} name={'catalogId' as Path<T>} errors={errors} />
            </div>
          </div>

          <div className="space-y-2">
            <DescriptionField defaultContent="*Descripción del producto...*" />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Atributos de producto</h3>
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
