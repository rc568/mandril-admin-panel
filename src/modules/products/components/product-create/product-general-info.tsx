import { FormErrorMessage } from '@/components/common/form-error-message';
import { MarkdownViewer } from '@/components/common/markdown-viewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/get-all-attributes.interface';
import { Info, Plus } from 'lucide-react';
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFieldArrayReturn,
  type UseFormRegister
} from 'react-hook-form';
import type { Catalog, Category } from '../../interfaces/api/product.interface';
import type { CreateProductForm } from '../../interfaces/ui/create-product-form.interface';

interface Props {
  attributes: GetAttributesApiResponse;
  categories: Category[];
  catalogs: Catalog[];
  register: UseFormRegister<CreateProductForm>;
  control: Control<CreateProductForm>;
  attributesField: UseFieldArrayReturn<CreateProductForm, 'attributesId'>;
  errors: FieldErrors<CreateProductForm>;
  onAdd: () => void;
}

export const ProductGeneralInfo = ({
  attributes,
  catalogs,
  categories,
  attributesField,
  register,
  control,
  errors,
  onAdd
}: Props) => {
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
              <Label id="category" className="text-sm font-medium text-foreground flex items-center gap-2">
                Categoría
              </Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(v)}>
                    <SelectTrigger aria-labelledby="category" className="bg-background w-full">
                      <SelectValue placeholder="Seleccionar Categoría" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {categories &&
                        categories.map((cat) => {
                          return (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId?.message && <FormErrorMessage text={errors.categoryId.message} />}
            </div>

            <div className="space-y-2">
              <Label id="catalog" className="text-sm font-medium text-foreground">
                Catálogo
              </Label>
              <Controller
                control={control}
                name="catalogId"
                render={({ field }) => (
                  <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(v)}>
                    <SelectTrigger aria-labelledby="catalog" className="bg-background w-full">
                      <SelectValue placeholder="Seleccionar Catálogo" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogs &&
                        catalogs.map((cat) => {
                          return (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.catalogId?.message && <FormErrorMessage text={errors.catalogId.message} />}
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
