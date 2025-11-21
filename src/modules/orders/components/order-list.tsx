import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import type { OrderMapped } from '../interfaces/get-orders-mapped.interface';
import { OrderListItem } from './order-list-item';

interface Props extends PropsWithChildren {
  orders: OrderMapped[];
}

export const OrderList = ({ orders, children }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <Package className="w-5 h-5" />
            Ventas realizadas
          </div>
          {children}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderListItem order={order} key={order.id} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
