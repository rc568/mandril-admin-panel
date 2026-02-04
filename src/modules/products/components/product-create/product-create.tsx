import { Button } from '@/components/ui/button';
import { useAttributes, useProduct } from '@/hooks/query';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ProductCreateGeneralInfo, ProductCreateVariantsSection } from '.';
import { ProductCreateProvider } from '../../context/product-create-context';
import type { CreateProductForm } from '../../interfaces/ui/create-product-form.interface';
import { createProductSchema } from '../../validators/product.validators';
import { ProductAddAttributesDialog } from './product-add-attributes-dialog';

export const ProductCreate = () => {
  const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);
  const navigate = useNavigate();

  const form = useForm<CreateProductForm>({
    resolver: standardSchemaResolver(createProductSchema),
    defaultValues: { variants: [{ attributes: [], price: 0, purchasePrice: 0, quantityInStock: 0 }] }
  });

  const { data: attributes } = useAttributes();

  const { mutation: mutateProduct } = useProduct();

  const onSubmit = async (newProduct: CreateProductForm) => {
    await mutateProduct.mutateAsync(newProduct, {
      onSuccess: (res) => {
        toast.success('Producto creado exitosamente.');
        navigate(`/productos/editar/${res.slug}`);
      },
      onError: (error) => {
        const apiError = error.response?.data;

        if (apiError?.validationErrors && apiError?.validationErrors.length > 0) {
          toast.error('Errores de validación:', {
            description: (
              <ul>
                {apiError.validationErrors.map((val) => (
                  <li key={val.field}>
                    <span className="capitalize font-bold">{val.field}: </span>
                    {val.message}
                  </li>
                ))}
              </ul>
            )
          });
          return;
        }

        toast.error(apiError?.message ?? 'Ocurrió un error inesperado.');
      }
    });
  };

  return (
    <FormProvider {...form}>
      <ProductCreateProvider>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 my-6">
            <ProductCreateGeneralInfo attributes={attributes ?? []} onAdd={() => setIsAttributesModalOpen(true)} />

            <ProductCreateVariantsSection attributes={attributes ?? []} />

            <Button type="submit" disabled={mutateProduct.isPending} className="w-fit justify-self-end">
              Crear producto
            </Button>

            <ProductAddAttributesDialog
              open={isAttributesModalOpen}
              onOpenChange={setIsAttributesModalOpen}
              attributes={attributes ?? []}
            />
          </div>
        </form>
      </ProductCreateProvider>
    </FormProvider>
  );
};
