import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/date-utils';
import {
  CLIENT_DOCUMENT_TYPE_CONFIG,
  INVOICE_TYPE_CONFIG,
  NO_INFO,
  ORDER_STATUS_CONFIG
} from '../../constants/order.constants';
import type { OrderMapped } from '../../interfaces/ui';

interface Props {
  order: OrderMapped | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderDetailsSheet = ({ order, open, onOpenChange }: Props) => {
  if (!order) return;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>DETALLE DE ORDEN</SheetTitle>
          <SheetDescription asChild>
            <div className="text-right text-sm italic flex justify-between">
              <span className="text-muted-foreground italic">{formatDate(order.createdAt)}</span>
              <div className="text-muted-foreground">
                <span>Creado por: </span>
                <span className="truncate">{order.createdBy}</span>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-8 space-y-4">
          <div className="space-y-2">
            <div className="rounded-lg border bg-muted/30 p-4">
              <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Estado</dt>
                  <dd className="text-foreground">{ORDER_STATUS_CONFIG[order.status].label}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Canal de Venta</dt>
                  <dd className="text-foreground">{order.channel}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Datos de contacto</h2>
            <div className="rounded-lg border bg-muted/30 p-4">
              <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Nombre</dt>
                  <dd className="text-foreground">{order.client.contactName ?? NO_INFO}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd className="truncate text-foreground">{order.client.email ?? NO_INFO}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Teléfono</dt>
                  <dd className="text-foreground">{order.client.phoneNumber1 ?? NO_INFO}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Datos de facturación</h2>
            <div className="rounded-lg border bg-muted/30 p-4">
              <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Tipo de documento</dt>
                  <dd className="text-foreground">{CLIENT_DOCUMENT_TYPE_CONFIG[order.client.documentType].label}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Número de documento</dt>
                  <dd className="text-foreground">{order.client.documentNumber ?? NO_INFO}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-muted-foreground">Razón Social</dt>
                  <dd className="text-foreground">{order.client.bussinessName ?? NO_INFO}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Tipo de comprobante</dt>
                  <dd className="truncate text-foreground">{INVOICE_TYPE_CONFIG[order.invoiceType].label}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Comprobante</dt>
                  <dd className="truncate text-foreground">{order.invoiceCode ?? NO_INFO}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Productos ( {order.products.length} productos únicos • {order.numProducts} unidades en total )
            </h2>
            <div className="space-y-2 rounded-lg border bg-muted/30 px-4 divide-y">
              {order.products.map((product) => (
                <div key={product.code} className="flex justify-between items-center text-sm py-2">
                  <div>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">
                        {product.code} - {product.name}
                      </span>
                      <div className="font-medium flex flex-wrap gap-1">
                        {product.variantAttributes?.length > 0 &&
                          product.variantAttributes.map((va) => (
                            <Badge className="bg-amber-200 text-primary">
                              {va.attribute}: {va.value}
                            </Badge>
                          ))}
                      </div>
                      <span className="text-muted-foreground block">
                        {product.quantity} unidad(es) × {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>
                  <span className="font-medium">{formatCurrency(product.subTotal)}</span>
                </div>
              ))}
            </div>
            <div className="text-right px-4 pt-2">
              <span className="font-medium ">Total: {formatCurrency(order.totalSale)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Observaciones</h2>
            {order.observation ? (
              <div className="rounded-lg border bg-muted/30 p-4 text-sm">{order.observation}</div>
            ) : (
              <span className="text-sm italic text-muted-foreground">{NO_INFO}</span>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
