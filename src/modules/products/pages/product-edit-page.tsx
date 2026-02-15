import { Title } from '@/components/common/title';
import { useProduct } from '@/hooks/query';
import { useParams } from 'react-router';
import { ProductEdit } from '../components/product-edit';
import { mapProductToEditForm } from '../mappers/product-to-edit-form.mapper';

export const ProductEditPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: product, isPending, isError } = useProduct(id);

  if (isPending) return <h1>Cargando ... </h1>;

  if (isError) return <h1>Ocurrió un error inesperado... vuelva a intentar</h1>;

  if (!product) return <h1>No se encontró el producto buscado</h1>;

  return (
    <div className="max-w-7xl mx-auto">
      <Title title="Editar Producto" subtitle="Modifica aquí la información del producto." showLink={false} />
      <ProductEdit productForm={mapProductToEditForm(product)} productUI={product} />
    </div>
  );
};
