import { Title } from '@/components/common/title';
import { ProductCreate } from '../components/product-create';

export const ProductCreatePage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Title title="Crear Producto" subtitle="Crea un nuevo producto y sus variantes." />
      <ProductCreate />
    </div>
  );
};
