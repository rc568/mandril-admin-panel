import { Title } from '@/components/common/title';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { getProductByIdAction } from '../actions/get-product-by-id.action';
import { ProductEdit } from '../components/product-edit';
import { mapProductToEditForm } from '../mappers/product-to-edit-form.mapper';

export const ProductEditPage = () => {
  const params = useParams();

  const {
    data: product,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['productId', { id: params.id }],
    queryFn: () => getProductByIdAction(params.id!),
    staleTime: 1000 * 60 * 5,
    retry: false
  });

  if (isLoading) return <h1>Cargando ... </h1>;

  if (!product || isError) return <h1>No se encontró el producto buscado</h1>;

  return (
    <div className="max-w-7xl mx-auto">
      <Title title="Editar Producto" subtitle="Modifica tu producto." />
      <ProductEdit productForm={mapProductToEditForm(product)} productUI={product} />
    </div>
  );
};
