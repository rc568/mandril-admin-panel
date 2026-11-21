import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useOrderMutation } from '@/hooks/query/order';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/date-utils';
import { notifyToast } from '@/lib/toast/toast-adapter';
import { cn } from '@/lib/utils';
import { ArrowLeftRight, Edit, MoreHorizontal, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  BILLING_STATUS_CONFIG,
  CLIENT_DOCUMENT_TYPE_CONFIG,
  INVOICE_TYPE_CONFIG,
  NO_INFO,
  ORDER_PRODUCT_TYPE_CONFIG,
  ORDER_STATUS_CONFIG
} from '../../constants/order.constants';
import { messages } from '../../constants/order.messages';
import type { CompleteOrderItemInput, OrderType } from '../../interfaces/api';
import type { OrderMapped } from '../../interfaces/ui';
import { BaseBadge } from '../base-badge';
import { OrderRelatedCreateDialog } from '../order-related-create-dialog';

type RelatedOrderType = Extract<OrderType, 'EXCHANGE' | 'RETURN'>;

interface Props {
  order: OrderMapped | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderDetailsSheet = ({ order, open, onOpenChange }: Props) => {
  const navigate = useNavigate();
  const { updateOrder, cancelOrder, completeOrder: completeOrderMutation, softDeleteOrder } = useOrderMutation();
  const [relatedOrder, setRelatedOrder] = useState<{ id: string; type: RelatedOrderType } | null>(null);

  if (!order) return;

  const canUpdateStatus = order.type === 'SALE';
  const canManageOrder = order.status === 'PENDING' || order.status === 'PAID';
  const canUpdateOrder = canUpdateStatus && canManageOrder;
  const canCreateRelatedOrder = order.status === 'COMPLETED' && order.type !== 'RETURN';
  const relatedOrderType = relatedOrder?.id === order.id ? relatedOrder.type : null;
  const isMutationPending =
    updateOrder.isPending || cancelOrder.isPending || completeOrderMutation.isPending || softDeleteOrder.isPending;
  const deleteOrderHint =
    order.status === 'COMPLETED'
      ? 'Solo se pueden eliminar órdenes canceladas.'
      : 'Primero debes cancelar la orden para poder eliminarla.';

  const completeOrder = () => {
    if (order.type !== 'EXCHANGE') {
      completeOrderMutation.mutate({ id: order.id });
      return;
    }

    const returnItems: CompleteOrderItemInput[] = order.products
      .filter((op) => op.type === 'RETURN')
      .map((op) => ({
        orderProductId: op.id,
        quantity: op.quantity,
        condition: 'AVAILABLE'
      }));

    const [firstItem, ...remainingItems] = returnItems;

    if (!firstItem) {
      notifyToast.error(messages.VALIDATION.NO_SALE_PRODUCTS_ON_EXCHANGE_ORDER);
      return;
    }

    completeOrderMutation.mutate({ id: order.id, body: { items: [firstItem, ...remainingItems] } });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        {canCreateRelatedOrder && (
          <div className="absolute right-8 top-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Crear orden relacionada"
                  className="hover:bg-transparent"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => setRelatedOrder({ id: order.id, type: 'EXCHANGE' })}
                  className="cursor-pointer"
                >
                  <ArrowLeftRight className="size-4" />
                  Crear orden de cambio
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setRelatedOrder({ id: order.id, type: 'RETURN' })}
                  className="cursor-pointer"
                >
                  <RotateCcw className="size-4" />
                  Crear orden de devolución
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <SheetHeader className="border-b px-6">
          <SheetTitle>DETALLE DE ORDEN</SheetTitle>
          <SheetDescription asChild>
            <div>
              <div className="text-right text-sm italic flex justify-between">
                <span className="text-muted-foreground italic">{formatDate(order.createdAt)}</span>
                <div className="text-muted-foreground">
                  <span>Creado por: </span>
                  <span className="truncate">{order.createdBy}</span>
                </div>
              </div>
              <div className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={!canUpdateOrder || isMutationPending}
                  onClick={() => {
                    navigate(`/ventas/editar/${order.id}`);
                    onOpenChange(false);
                  }}
                >
                  <Edit />
                  Editar orden
                </Button>

                {!canUpdateOrder && (
                  <p className="pt-2 text-center text-xs text-muted-foreground">
                    Solo se pueden editar órdenes de venta pendientes o pagadas.
                  </p>
                )}
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
        <div className="px-6 pb-8 space-y-4">
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
              {order.products.map((orderProduct) => (
                <div key={orderProduct.id} className="flex justify-between items-center text-sm py-2">
                  <div>
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">
                          {orderProduct.code} - {orderProduct.name}
                        </span>
                        <BaseBadge
                          label={ORDER_PRODUCT_TYPE_CONFIG[orderProduct.type].label}
                          className={ORDER_PRODUCT_TYPE_CONFIG[orderProduct.type].className}
                        />
                      </div>
                      <div className="font-medium flex flex-wrap gap-1">
                        {orderProduct.variantAttributes?.length > 0 &&
                          orderProduct.variantAttributes.map((va) => (
                            <Badge
                              key={`${orderProduct.id}-${va.attributeId}-${va.valueId}`}
                              className="bg-amber-200 text-primary"
                            >
                              {va.attribute}: {va.value}
                            </Badge>
                          ))}
                      </div>
                      <span className="text-muted-foreground block">
                        {orderProduct.quantity} unidad(es) × {formatCurrency(orderProduct.price)}
                      </span>
                    </div>
                  </div>
                  <span className="font-medium">{formatCurrency(orderProduct.subTotal)}</span>
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

          <Separator />

          <div className="space-y-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Actualizar Estado</h2>
            {canManageOrder ? (
              <div className="grid grid-cols-2 gap-2">
                {canUpdateStatus && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-auto whitespace-normal wrap-break-word py-2 text-center sm:px-4"
                    disabled={isMutationPending}
                    onClick={() =>
                      updateOrder.mutate({
                        id: order.id,
                        body: { status: order.status === 'PENDING' ? 'PAID' : 'PENDING' }
                      })
                    }
                  >
                    {order.status === 'PENDING' ? 'Marcar como pagada' : 'Volver a pendiente'}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto w-full border-success/60 text-success/80 hover:text-success"
                  disabled={isMutationPending}
                  onClick={() => completeOrder()}
                >
                  Completar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto w-full border-destructive/60 text-destructive/80 hover:text-destructive"
                  disabled={isMutationPending}
                  onClick={() => cancelOrder.mutate(order.id)}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                {order.status === 'CANCELLED'
                  ? 'No es posible cambiar el estado de una orden cancelada.'
                  : 'No es posible cambiar el estado de una orden completada.'}
              </p>
            )}
          </div>

          <Separator />
          <div className="flex flex-col items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex" tabIndex={order.status === 'CANCELLED' ? undefined : 0}>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive/80 hover:text-destructive"
                    disabled={isMutationPending || order.status !== 'CANCELLED'}
                    onClick={() => softDeleteOrder.mutate(order.id, { onSuccess: () => onOpenChange(false) })}
                  >
                    <Trash2 className="size-4" />
                    Eliminar orden
                  </Button>
                </span>
              </TooltipTrigger>
              {order.status !== 'CANCELLED' && (
                <TooltipContent side="top" variant="outline" size="sm" className="hidden sm:block">
                  {deleteOrderHint}
                </TooltipContent>
              )}
            </Tooltip>
            {order.status !== 'CANCELLED' && (
              <p className="px-4 text-center text-xs text-muted-foreground sm:hidden">{deleteOrderHint}</p>
            )}
          </div>
        </div>
      </SheetContent>
      {relatedOrderType && (
        <OrderRelatedCreateDialog
          open={Boolean(relatedOrderType)}
          order={order}
          type={relatedOrderType}
          onOpenChange={(dialogOpen) => {
            if (!dialogOpen) setRelatedOrder(null);
          }}
          onCreated={() => {
            setRelatedOrder(null);
            onOpenChange(false);
          }}
        />
      )}
    </Sheet>
  );
};
