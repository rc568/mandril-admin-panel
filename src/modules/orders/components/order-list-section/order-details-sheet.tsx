import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import {
  BILLING_STATUS_CONFIG,
  CLIENT_DOCUMENT_TYPE_CONFIG,
  INVOICE_TYPE_CONFIG,
  NO_INFO,
  ORDER_STATUS_CONFIG
} from '../../constants/order.constants';
import type { OrderMapped } from '../../interfaces/ui';
import { BaseBadge } from '../base-badge';

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
                  {order.client.contactName ? (
                    <dd className="text-foreground">{order.client.contactName}</dd>
                  ) : (
                    <dd className="italic text-muted-foreground">{NO_INFO}</dd>
                  )}
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Celular</dt>
                  {order.client.phoneNumber1 ? (
                    <dd className="text-foreground">{order.client.phoneNumber1}</dd>
                  ) : (
                    <dd className="italic text-muted-foreground">{NO_INFO}</dd>
                  )}
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Tipo de documento</dt>
                  {order.client.documentNumberType ? (
                    <dd className="text-foreground">{order.client.documentNumberType}</dd>
                  ) : (
                    <dd className="italic text-muted-foreground">{NO_INFO}</dd>
                  )}
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Número de documento</dt>
                  {order.client.documentNumber ? (
                    <dd className="text-foreground">{order.client.documentNumber}</dd>
                  ) : (
                    <dd className="italic text-muted-foreground">{NO_INFO}</dd>
                  )}
                </div>
              </dl>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Comprobantes</h2>
            <div className="space-y-4">
              {order.billing.length > 0 ? (
                order.billing.map((billing) => (
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
                    <div className="text-sm font-medium uppercase">
                      <div>
                        <span className="pr-2">{INVOICE_TYPE_CONFIG[billing.billingReceiptType].label}</span>
                        <BaseBadge
                          label={BILLING_STATUS_CONFIG[billing.status].label}
                          className={cn(BILLING_STATUS_CONFIG[billing.status].className, 'bg-transparent normal-case')}
                        />
                      </div>
                      <div>
                        <span className="font-normal italic text-muted-foreground">{billing.code ?? NO_INFO}</span>
                      </div>
                    </div>
                    <Separator className="h-12" />
                    <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                      <div className="col-span-3">
                        <dt className="text-xs text-muted-foreground">Razón Social</dt>
                        <dd className="text-foreground">{billing.billingName ?? NO_INFO}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Tipo de documento</dt>
                        <dd className="text-foreground">
                          {CLIENT_DOCUMENT_TYPE_CONFIG[billing.billingDocumentNumberType].label}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Número de documento</dt>
                        <dd className="text-foreground">{billing.billingDocumentNumber ?? NO_INFO}</dd>
                      </div>
                    </dl>
                    <Separator className="h-12" />
                    <div className="text-xs text-muted-foreground flex justify-between italic">
                      <span>{formatDate(billing.createdAt)}</span>
                      <span>Creado por {billing.createdBy}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed bg-muted/30 p-4">
                  <span className="text-sm italic text-muted-foreground">Sin comprobantes emitidos</span>
                </div>
              )}
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
