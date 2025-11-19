import { formatCurrency } from '@/lib/currency';
import { Package } from 'lucide-react';
import { ProductStatCard } from './product-stat-card';

export const ProductsStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3 my-2">
      <ProductStatCard title="Total Productos" icon={<Package className="h-8 w-8" />}>
        <div>
          <p className="text-2xl font-bold">300</p>
        </div>
      </ProductStatCard>

      <ProductStatCard title="Valor Inventario" icon={<Package className="h-8 w-8" />}>
        <div>
          <p className="text-2xl font-bold">{formatCurrency(251020)}</p>
        </div>
      </ProductStatCard>

      <ProductStatCard title="Productos Activos" icon={<Package className="h-8 w-8" />}>
        <div>
          <p className="text-2xl font-bold">215</p>
        </div>
      </ProductStatCard>
    </div>
  );
};
