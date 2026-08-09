import { InputField } from '@/components/common/form';
import { FormErrorMessage } from '@/components/common/form-error-message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CURRENCY_SYMBOL } from '@/constants/unit';
import { productProfit } from '@/lib/pricing-calculations';
import { cn } from '@/lib/utils';
import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/api';
import { ImageIcon, Info, Trash2 } from 'lucide-react';
import type { Path, UseFormReturn } from 'react-hook-form';
import type { BaseProduct, VariantFieldError } from '../../interfaces/ui';
import { VariantAttributeField } from '../product-create/variant-attribute-field';
import { ProfitPercentage } from '../profit-percentage';

interface Props<T extends BaseProduct> {
  attributes: GetAttributesApiResponse;
  attributesField: { attributeId: number }[];
  form: UseFormReturn<T>;
  variantError?: VariantFieldError;
  index: number;
  code?: string;
  watchPrice: number;
  watchPurchasePrice: number;
  onDelete: (index: number) => void;
}

export const ProductVariantCardUI = <T extends BaseProduct>({
  attributes,
  attributesField,
  form,
  variantError,
  index,
  code,
  watchPrice,
  watchPurchasePrice,
  onDelete
}: Props<T>) => {
  const { register } = form;

  const profit = productProfit(watchPrice, watchPurchasePrice);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>
          <div className="flex justify-between items-center">
            {code ? <span>{code}</span> : <span>Variante {index + 1}</span>}
            {index > 1 && attributesField.length >= 0 && (
              <Button
                size={'icon'}
                variant={'ghost'}
                type="button"
                onClick={() => onDelete(index)}
                className={cn({ hidden: code })}
              >
                <Trash2 className="size-5" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <InputField
            label="Precio de Compra"
            type="number"
            step="any"
            startAdornment={CURRENCY_SYMBOL}
            {...register(`variants.${index}.purchasePrice` as Path<T>, { valueAsNumber: true })}
            error={variantError?.purchasePrice && String(variantError.purchasePrice.message)}
          />

          <InputField
            label="Precio de Venta"
            type="number"
            step="any"
            startAdornment={CURRENCY_SYMBOL}
            {...register(`variants.${index}.price` as Path<T>, { valueAsNumber: true })}
            error={variantError?.price && String(variantError.price.message)}
          />

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

          <InputField
            label="Stock"
            type="number"
            {...register(`variants.${index}.quantityInStock` as Path<T>, { valueAsNumber: true })}
            error={variantError?.quantityInStock && String(variantError.quantityInStock.message)}
          />

          <div className="space-y-2">
            <Label asChild className="text-sm font-medium text-foreground">
              <span>Ganancia</span>
            </Label>
            <div className="flex items-center justify-end h-9">
              <ProfitPercentage num={profit} />
            </div>
          </div>

          {/* <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">Stock Alerta</Label>
                    <Input className="bg-background" />
                  </div> */}

          <div className="space-y-1 min-h-36 row-start-2 col-span-full lg:col-start-3 lg:row-start-1 lg:col-span-2 lg:row-span-2">
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
                  {variantError?.attributes?.[indexField]?.attributeId && (
                    <FormErrorMessage text={variantError?.attributes?.[indexField]?.attributeId.message ?? ''} />
                  )}

                  <VariantAttributeField
                    form={form}
                    attributeId={attrField.attributeId}
                    attributeIndex={indexField}
                    attributeName={attributes.find((attr) => attr.id === attrField.attributeId)?.name}
                    variantIndex={index}
                  />
                  {variantError?.attributes?.[indexField]?.valueId && (
                    <FormErrorMessage text={variantError?.attributes?.[indexField]?.valueId.message ?? ''} />
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
