import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar, FileText, Package, SquareUser } from 'lucide-react';

import type { OrderMapped } from '../interfaces/get-orders-mapped.interface';
import type { OrderStatus } from '../interfaces/order.interface';

interface Props {
  order: OrderMapped;
}

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'COMPLETED':
      return <Badge className="bg-green-100 text-green-800">Completada</Badge>;
    case 'CANCELLED':
      return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
    case 'PAID':
      return <Badge className="bg-blue-100 text-blue-800">Pagado</Badge>;
    case 'PENDING':
      return <Badge className="bg-gray-100 text-gray-800">Pendiente</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>;
  }
};
const getSalesChannelBadge = (channel: string) => {
  switch (channel) {
    case 'WhatsApp':
      return <Badge className="bg-green-100 text-green-800">{channel}</Badge>;
    case 'Falabella.com':
      return <Badge className="bg-green-800 text-green-100">{channel}</Badge>;
    case 'Agora':
      return <Badge className="bg-blue-100 text-blue-800">{channel}</Badge>;
    case 'Mercado Libre':
      return <Badge className="bg-amber-100 text-amber-800">{channel}</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">{channel}</Badge>;
  }
};

export const OrderListItem = ({ order }: Props) => {
  return (
    <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Package className="w-10 h-10 text-primary bg-muted-foreground/50 rounded-lg p-2" />
          <div className="flex flex-col gap-1">
            <span className={cn(order.client.contactName ? '' : 'text-muted-foreground text-sm')}>
              <span className="text-muted-foreground text-sm">Cliente: </span>
              {order.client.contactName || 'Sin información'}
            </span>
            <span className={cn(order.client.bussinessName ? '' : 'text-muted-foreground text-sm')}>
              <span className="text-muted-foreground text-sm">Razón Social: </span>
              {order.client.bussinessName || 'Sin información'}
            </span>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="space-x-2">
            {getSalesChannelBadge(order.channel)}
            {getStatusBadge(order.status)}
          </div>
          <p className="text-lg font-bold">
            <span className="text-sm text-muted-foreground font-normal align-text-bottom pr-2">Total de Venta:</span>
            {order.totalSale}
          </p>
        </div>
      </div>

      <div className="my-4">
        <h4 className="font-medium text-lg mb-3">
          {order.products.length} productos únicos • Total: {order.numProducts} unidades
        </h4>
        <div className="space-y-2">
          {order.products.map((product) => (
            <div key={product.code} className="flex justify-between items-center text-sm">
              <div>
                <span className="font-medium">
                  {product.code} - {product.name}
                  {product.attribute && (
                    <Badge className="bg-amber-200 text-primary ml-2">
                      {product.attribute}: {product.attributeValue}
                    </Badge>
                  )}
                </span>
                <span className="text-muted-foreground ml-2">
                  - {product.quantity} unidad(es) × {product.price}
                </span>
              </div>
              <span className="font-medium">{product.subTotal}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{order.createdAt}</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span>
            Comprobante:
            <span className={cn('pl-1', order.invoiceCode ? '' : 'text-muted-foreground')}>
              {order.invoiceCode || 'Sin comprobante'}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SquareUser className="w-4 h-4 text-muted-foreground" />
          <span>Creado por: {order.createdBy}</span>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            Ver Detalles
          </Button>
        </div>
      </div>
    </div>
  );
};
