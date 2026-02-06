import { FormErrorMessage } from '@/components/common/form-error-message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { productProfit } from '@/lib/pricing-calculations';
import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/get-all-attributes.interface';
import { ImageIcon, Info, Trash2 } from 'lucide-react';
import type { Path, UseFormReturn } from 'react-hook-form';
import type { BaseProductFields } from '../../interfaces/ui/create-product-form.interface';
import { VariantAttributeField } from '../product-create/variant-attribute-field';
import { ProfitPercentage } from '../profit-percentage';

interface Props<T extends BaseProductFields> {
  attributes: GetAttributesApiResponse;
  attributesField: { attributeId: number }[];
  form: UseFormReturn<T>;
  index: number;
  id: string;
  code?: string;
  watchPrice: number;
  watchPurchasePrice: number;
  onDelete: (index: number) => void;
}

export const ProductVariantCardUI = <T extends BaseProductFields>({
  attributes,
  attributesField,
  form,
  index,
  id,
  code,
  watchPrice,
  watchPurchasePrice,
  onDelete
}: Props<T>) => {
  const {
    control,
    register,
    formState: { errors }
  } = form;
  const variantErrors = errors.variants as any;
  const currentVariantError = variantErrors?.[index];
  const domId = `variant-${id}`;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>
          <div className="flex justify-between items-center">
            {code ? <span>{code}</span> : <span>Variante {index + 1}</span>}
            {index > 1 && attributesField.length >= 0 && (
              <Button size={'icon'} variant={'ghost'} type="button" onClick={() => onDelete(index)}>
                <Trash2 className="size-5" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className=" grid grid-cols-4 gap-4">
          <div className="space-y-1">
            <Label htmlFor={`${domId}-purchase-price`} className="text-sm font-medium text-foreground">
              Precio de Compra
            </Label>
            <Input
              id={`${domId}-purchase-price`}
              {...register(`variants.${index}.purchasePrice` as Path<T>)}
              type="number"
              className="bg-background"
              placeholder="Precio de Compra"
            />
            {currentVariantError?.purchasePrice && (
              <FormErrorMessage text={currentVariantError.purchasePrice.message ?? ''} />
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor={`${domId}-price`}
              className="text-sm font-medium text-foreground flex justify-between flex-wrap"
            >
              Precio de Venta
              <span className="text-success">
                <ProfitPercentage num={productProfit(watchPrice, watchPurchasePrice)} />
              </span>
            </Label>
            <Input
              id={`${domId}-price`}
              {...register(`variants.${index}.price` as Path<T>)}
              type="number"
              className="bg-background"
              placeholder="Precio de Venta"
            />
            {currentVariantError?.price && <FormErrorMessage text={currentVariantError.price.message ?? ''} />}
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
            <Label htmlFor={`${domId}-stock`} className="text-sm font-medium text-foreground">
              Stock
            </Label>
            <Input
              id={`${domId}-stock`}
              {...register(`variants.${index}.quantityInStock` as Path<T>)}
              type="number"
              className="bg-background"
              placeholder="Stock"
            />
            {currentVariantError?.quantityInStock && (
              <FormErrorMessage text={currentVariantError.quantityInStock.message ?? ''} />
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

            <div className="rounded-lg border-border bg-muted/30 h-full">
              <div className="h-full rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/50 hover:bg-green-100/60 transition-colors cursor-pointer">
                <ImageIcon className="size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground text-center">
                  <span className="text-foreground underline">Selecciona o arrastra las imágenes aquí</span>
                </p>
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

          <div className="col-span-4 row-start-4 border-t flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground pt-4">Atributos</span>
            {attributesField.length > 0 ? (
              attributesField.map((attrField, indexField) => (
                <div key={attrField.attributeId}>
                  <VariantAttributeField
                    attributeId={attrField.attributeId}
                    attributeIndex={indexField}
                    attributeName={attributes.find((attr) => attr.id === attrField.attributeId)?.name}
                    control={control}
                    variantIndex={index}
                  />
                  {currentVariantError?.attributes?.[indexField]?.valueId && (
                    <FormErrorMessage text={currentVariantError.attributes[indexField].valueId?.message ?? ''} />
                  )}
                </div>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Sin atributos</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
