import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import type { OrderMapped } from '../../interfaces/api/get-orders-mapped.interface';
import { OrderTableRow } from './order-table-row';

interface Props extends PropsWithChildren {
  orders: OrderMapped[];
  onRowClick: (order: OrderMapped | null) => void;
}

export const OrderTable = ({ orders, onRowClick, children }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <Package className="w-5 h-5" />
            Ventas realizadas
          </div>
        </CardTitle>
        {children}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comprobante</TableHead>
              <TableHead>Razón Social / Contacto</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Venta Total</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Creador por</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <OrderTableRow order={order} onRowClick={onRowClick} key={order.id} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
