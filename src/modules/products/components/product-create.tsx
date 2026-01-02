import { FormErrorMessage } from '@/components/common/form-error-message';
import { MarkdownViewer } from '@/components/common/markdown-viewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllCatalogs } from '@/services/catalog/get-all-catalogs.action';
import { getAllCategories } from '@/services/category/get-all-categories.action';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Info, Plus, Trash2 } from 'lucide-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { createProductAction } from '../actions/create-product.action';
import type { CreateProductForm } from '../interfaces/ui/create-product-form.interface';
import { createProductSchema } from '../validators/product.validators';

export const ProductCreate = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<CreateProductForm>({
    resolver: standardSchemaResolver(createProductSchema),
    defaultValues: { variants: [{ attributes: [], price: 0, purchasePrice: 0, quantityInStock: 0 }] }
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'variants'
    // rules: { minLength: 1 }
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 60
  });

  const { data: catalogs } = useQuery({
    queryKey: ['catalogs'],
    queryFn: getAllCatalogs,
    staleTime: 1000 * 60 * 60
  });

  const createProductMutation = useMutation({
    mutationFn: createProductAction
  });

  const onSubmit = async (newProduct: CreateProductForm) => {
    await createProductMutation.mutateAsync(newProduct, {
      onSuccess: (res) => console.log('producto creado', res),
      onError: (res) => console.log(res.message)
    });
  };

  const { isPending } = createProductMutation;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 my-6">
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
                <Label className="text-sm font-medium text-foreground">Atributos de producto</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground pr-2">Sin atributos</span>
                  <Button size={'sm'} type="button">
                    <Plus />
                    Añadir atributo
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Variantes del producto</h2>
          <Button
            type="button"
            onClick={() => {
              append({ price: 0, purchasePrice: 0, quantityInStock: 0, attributes: [] });
            }}
          >
            <Plus />
            Agregar Variante
          </Button>
        </div>

        {fields.map((variant, index) => {
          return (
            // <Input key={variant.id} {...register(`variants.${index}.price`)} />
            <Card key={variant.id}>
              <CardHeader className="border-b">
                <CardTitle>
                  <div className="flex justify-between items-center">
                    <span>Variante {index + 1}</span>
                    {index > 0 && (
                      <Button size={'icon'} variant={'ghost'} type="button" onClick={() => remove(index)}>
                        <Trash2 className="size-5" />
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className=" grid grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label
                      htmlFor={`variant-${variant.id}-purchase-price`}
                      className="text-sm font-medium text-foreground"
                    >
                      Precio de Compra
                    </Label>
                    <Input
                      id={`variant-${variant.id}-purchase-price`}
                      {...register(`variants.${index}.purchasePrice`)}
                      className="bg-background"
                    />
                    {errors.variants?.[index]?.purchasePrice && (
                      <FormErrorMessage text={errors.variants[index].purchasePrice.message ?? ''} />
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`variant-${variant.id}-price`} className="text-sm font-medium text-foreground">
                      Precio de Venta <span className="italic text-success">(Ganancia: 100%)</span>
                    </Label>
                    <Input
                      id={`variant-${variant.id}-price`}
                      {...register(`variants.${index}.price`)}
                      className="bg-background"
                    />
                    {errors.variants?.[index]?.price && (
                      <FormErrorMessage text={errors.variants[index].price.message ?? ''} />
                    )}
                  </div>

                  {/* <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground shrink-0 grow">Precio Oferta</Label>
                    <Input className="bg-background" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground shrink-0 grow">Duración Oferta</Label>
                    <Input className="bg-background" />
                    <Calendar
                      mode="single"
                      selected={new Date()}
                      defaultMonth={new Date()}
                      captionLayout="dropdown"
                      startMonth={new Date(2021, 1)}
                      // onSelect={(date) => updateLocalFilters({ startDate: date })}
                      // disabled={(date) => (localFilters.endDate ? date > localFilters.endDate : false)}
                      className="pointer-events-auto"
                    />
                  </div> */}

                  <div className="space-y-1">
                    <Label htmlFor={`variant-${variant.id}-stock`} className="text-sm font-medium text-foreground">
                      Stock
                    </Label>
                    <Input
                      id={`variant-${variant.id}-stock`}
                      {...register(`variants.${index}.quantityInStock`)}
                      type="number"
                      className="bg-background"
                    />
                    {errors.variants?.[index]?.quantityInStock && (
                      <FormErrorMessage text={errors.variants[index].quantityInStock.message ?? ''} />
                    )}
                  </div>

                  {/* <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Stock Alerta</Label>
                    <Input className="bg-background" />
                  </div> */}

                  <div className="space-y-1 col-start-3 row-start-1 col-span-2 row-span-2">
                    <span className="text-sm font-medium text-foreground flex items-center gap-2">
                      Imágenes de productos
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </span>

                    <div className="rounded-lg border-border bg-muted/30 overflow-hidden">
                      <div className="inset-0 bg-white overflow-x-auto overflow-y-hidden">
                        <div className="flex gap-2 p-2">
                          {[0, 1, 2].map((image) => {
                            return (
                              <div key={image} className="shrink-0 max-w-56 border-foreground/20 border rounded-sm p-2">
                                <img
                                  src={image.toString()}
                                  alt={image.toString()}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Garantía</Label>
                    <Input value={'3 meses'} onChange={() => {}} className="bg-background" />
                  </div>

                  <div className="space-y-1 row-start-5">
                    <Label className="text-sm font-medium text-foreground">Largo (cm)</Label>
                    <Input value={'15'} onChange={() => {}} className="bg-background" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Ancho (cm)</Label>
                    <Input value={'12'} onChange={() => {}} className="bg-background" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Alto (cm)</Label>
                    <Input value={'11'} onChange={() => {}} className="bg-background" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Peso (gramos)</Label>
                    <Input value={'500'} onChange={() => {}} className="bg-background" />
                  </div> */}

                  <div className="text-sm font-medium text-foreground border-t pt-4 row-start-6 col-span-4">
                    Atributos
                  </div>

                  <span className="text-sm text-muted-foreground row-start-7">Sin atributos</span>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Button type="submit" disabled={isPending} className="w-fit justify-self-end">
          Crear producto
        </Button>
      </div>
    </form>
  );
};
