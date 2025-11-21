import { formatCurrency } from '@/lib/currency';
import { Package } from 'lucide-react';
import { OrderStatCard } from './order-stat-card';

export const OrdersStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3 my-2">
      <OrderStatCard title="Total Ventas" icon={<Package className="h-8 w-8" />}>
        <div>
          <p className="text-2xl font-bold">300</p>
        </div>
      </OrderStatCard>

      <OrderStatCard title="Ventas mensual y anual" icon={<Package className="h-8 w-8" />}>
        <div>
          <p className="text-2xl font-bold">{formatCurrency(251020)}</p>
        </div>
      </OrderStatCard>

      <OrderStatCard title="Comprobantes emitidos" icon={<Package className="h-8 w-8" />}>
        <div>
          <p className="text-2xl font-bold">215</p>
        </div>
      </OrderStatCard>
    </div>
  );
};
