import { MarkdownViewer } from '@/components/common/markdown-viewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { formatCurrency } from '@/lib/currency';
import { formatShortDate } from '@/lib/date-utils';
import { getAllCatalogs } from '@/services/catalog/get-all-catalogs.action';
import { getAllCategories } from '@/services/category/get-all-categories.action';
import { useQuery } from '@tanstack/react-query';
import { Info, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ProductMapped } from '../interfaces/api/get-products-mapped.interface';

interface Props {
  product: ProductMapped;
}

export const ProductEdit = ({ product }: Props) => {
  const [_localFilters, _setLocalFilters] = useState();

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

  return (
    <>
      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.5fr] gap-6 my-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del producto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Nombre del Producto</Label>
                  <Input value={product.name} onChange={() => {}} className="bg-background" />
                  <p className="text-xs text-muted-foreground">
                    Do not exceed 20 characters when entering the product name.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Slug</Label>
                  <Input value={product.slug} onChange={() => {}} className="bg-background" />
                  <p className="text-xs text-muted-foreground">
                    Do not exceed 20 characters when entering the product name.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    Categoría
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </Label>
                  <Select value={'11'} onValueChange={() => {}}>
                    <SelectTrigger className="bg-background w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Catálogo</Label>
                  <Select value={'2'} onValueChange={() => {}}>
                    <SelectTrigger className="bg-background w-full">
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
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                  Descripción
                  <Info className="h-3 w-3 text-muted-foreground" />
                </Label>
                <div className="p-4 border">
                  <MarkdownViewer content={product.description ?? ''} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Atributos de producto</Label>
                <div className="flex items-center gap-2">
                  {product.attributes.length > 0 ? (
                    <>
                      {product.attributes.map((attr) => (
                        <Badge variant={'outline'}>{attr.name}</Badge>
                      ))}
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground pr-2">Sin atributos</span>
                  )}
                  <Button size={'sm'}>
                    <Plus />
                    Añadir atributo
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <article className="flex flex-col gap-8">
              <div className="flex flex-col gap-4 text-sm pb-8 border-b">
                <h3 className="font-semibold text-base">Estadísticas:</h3>
                <div className="flex flex-col items-end w-full">
                  <div>
                    <span className="font-semibold text-xl">25 und</span>
                    <span className="text-muted-foreground text-sm italic ml-2">Vendidas este último mes</span>
                  </div>
                  <span className="italic text-success">15.45% ↑ (comparativa con el mes pasado)</span>
                </div>

                <div className="flex flex-col items-end w-full">
                  <div>
                    <span className="font-semibold text-xl">{formatCurrency(1500)}</span>
                    <span className="text-muted-foreground text-sm italic ml-2">Ganancia total este último mes</span>
                  </div>
                  <span className="italic text-destructive">13.45% ↓ (comparativa con el mes pasado)</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-sm">
                <h3 className="font-semibold text-base">Detalles del registro:</h3>
                <div className="flex justify-between w-full">
                  <span className="italic">Creado por:</span>
                  <span>{product.createdBy}</span>
                </div>

                <div className="flex justify-between w-full">
                  <span className="italic">Fecha de creación:</span>
                  <span>{formatShortDate(product.createdAt)}</span>
                </div>
              </div>
            </article>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold">Variantes del producto</h2>
        {product.productVariant.map((pv) => {
          return (
            <Card className="col-span-1 row-span-1 lg:col-span-2" key={pv.id}>
              <CardHeader className="border-b">
                <CardTitle>
                  <div className="flex justify-between">
                    <div className="flex gap-4 items-center">
                      <span className="text-sm">{pv.code}</span>
                      {pv.variantAttributes.map((va) => {
                        return <Badge key={va.attribute} variant={'outline'}>{`${va.attribute}: ${va.value}`}</Badge>;
                      })}
                    </div>
                    <Button size={'icon'} variant={'ghost'}>
                      <Trash2 className="size-5" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className=" grid grid-cols-4 gap-4" key={pv.id}>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground shrink-0 grow">Precio de Compra</Label>
                    <Input value={pv.purchasePrice} onChange={() => {}} className="bg-background" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">
                      Precio de Venta <span className="italic text-success">(Ganancia: 100%)</span>
                    </Label>
                    <Input value={pv.price} onChange={() => {}} className="bg-background" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground shrink-0 grow">Precio Oferta</Label>
                    <Input value={pv.purchasePrice} onChange={() => {}} className="bg-background" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground shrink-0 grow">Duración Oferta</Label>
                    <Input value={'01/01/26 - 31/01/26'} onChange={() => {}} className="bg-background" />
                    {/* <Calendar
                      mode="single"
                      selected={new Date()}
                      defaultMonth={new Date()}
                      captionLayout="dropdown"
                      startMonth={new Date(2021, 1)}
                      // onSelect={(date) => updateLocalFilters({ startDate: date })}
                      // disabled={(date) => (localFilters.endDate ? date > localFilters.endDate : false)}
                      className="pointer-events-auto"
                    /> */}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Stock</Label>
                    <Input value={pv.quantityInStock} type="number" onChange={() => {}} className="bg-background" />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Stock Alerta</Label>
                    <Input value={5} type="number" onChange={() => {}} className="bg-background" />
                  </div>

                  <div className="space-y-1 col-start-3 row-start-1 col-span-2 row-span-4">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      Imágenes de productos
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </label>

                    <div className="rounded-lg border-border bg-muted/30 overflow-hidden">
                      <div className="inset-0 bg-white overflow-x-auto overflow-y-hidden">
                        <div className="flex gap-2 p-2">
                          {pv.images.map((image) => {
                            return (
                              <div
                                key={image.id}
                                className="shrink-0 max-w-56 border-foreground/20 border rounded-sm p-2"
                              >
                                <img src={image.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 flex flex-col">
                    <div className="text-sm font-medium text-foreground opacity-0">Activo</div>
                    <div className="flex justify-between items-center grow">
                      <Label className="text-sm font-medium text-foreground">Activo</Label>
                      <Switch defaultChecked={pv.isActive} />
                    </div>
                  </div>

                  <div className="space-y-1">
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
                  </div>

                  <div className="text-sm font-medium text-foreground border-t pt-4 row-start-6 col-span-4">
                    Atributos
                  </div>

                  {pv.variantAttributes.length > 0 ? (
                    pv.variantAttributes.map((va) => {
                      return (
                        <div className="flex-1 space-y-1">
                          <Label className="text-sm font-medium text-foreground ">{va.attribute}</Label>
                          <Input value={va.value} onChange={() => {}} className="bg-background" />
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-sm text-muted-foreground">Sin atributos</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};
