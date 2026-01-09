import { FormErrorMessage } from '@/components/common/form-error-message';
import { MarkdownViewer } from '@/components/common/markdown-viewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/get-all-attributes.interface';
import { Info, Plus } from 'lucide-react';
import { type Control, type FieldErrors, type UseFieldArrayReturn, type UseFormRegister } from 'react-hook-form';
import type { CreateProductForm } from '../../interfaces/ui/create-product-form.interface';
import { CatalogSelectInput } from '../catalog-select-input';
import { CategorySelectInput } from '../category-select-input';

interface Props {
  attributes: GetAttributesApiResponse;
  register: UseFormRegister<CreateProductForm>;
  control: Control<CreateProductForm>;
  attributesField: UseFieldArrayReturn<CreateProductForm, 'attributesId'>;
  errors: FieldErrors<CreateProductForm>;
  onAdd: () => void;
}

export const ProductGeneralInfo = ({ attributes, attributesField, register, control, errors, onAdd }: Props) => {
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
              <Input id="name" {...register('name')} placeholder="Nombre del producto" className="bg-background" />
              {errors.name?.message && <FormErrorMessage text={errors.name.message} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-medium text-foreground">
                Slug
              </Label>
              <Input id="slug" {...register('slug')} placeholder="Slug del producto" className="bg-background" />
              {errors.slug?.message && <FormErrorMessage text={errors.slug.message} />}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <CategorySelectInput<CreateProductForm> control={control} name="categoryId" errors={errors} />
            </div>

            <div className="space-y-2">
              <CatalogSelectInput<CreateProductForm> control={control} name="catalogId" errors={errors} />
            </div>
          </div>

          <div className="space-y-2">
            <Label id="description" className="text-sm font-medium text-foreground flex items-center gap-2">
              Descripción (*)
              <Info className="h-3 w-3 text-muted-foreground" />
            </Label>
            <div aria-labelledby="description" className="p-4 border">
              <MarkdownViewer content="" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Atributos de producto</h3>
            <div className="flex items-center gap-2">
              {attributesField.fields.length > 0 ? (
                attributesField.fields.map((attrField) => (
                  <Badge key={attrField.id} variant={'outline'} className="px-3 py-1">
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
