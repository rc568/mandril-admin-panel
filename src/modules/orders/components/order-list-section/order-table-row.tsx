import { TableCell, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/date-utils';
import { MoreHorizontal } from 'lucide-react';
import { BILLING_STATUS_CONFIG } from '../../billing/constants/billing.constants';
import {
  DEFAULT_BADGE_CLASSNAME,
  NO_INFO,
  ORDER_STATUS_CONFIG,
  ORDER_TYPE_CONFIG,
  SALES_CHANNEL_CONFIG
} from '../../constants/order.constants';
import type { OrderMapped } from '../../interfaces/ui';
import { BaseBadge } from '../base-badge';

interface Props {
  order: OrderMapped;
  onRowClick: (order: OrderMapped) => void;
}

export const OrderTableRow = ({ order, onRowClick }: Props) => {
  const { billing, client } = order;
  const sortBilling = billing.sort((a, b) => new Date(a.createdAt).getSeconds() - new Date(b.createdAt).getSeconds());

  return (
    <TableRow key={order.id} onClick={() => onRowClick(order)} className="cursor-pointer group">
      <TableCell className="text-xs">{formatDate(order.createdAt)}</TableCell>
      <TableCell>
        <div className="text-foreground text-xs">
          {order.client.contactName ? (
            <span className="block text-foreground">{client.contactName}</span>
          ) : (
            <span className="block italic text-muted-foreground">Nombre: {NO_INFO}</span>
          )}
          {order.client.phoneNumber1 ? (
            <span className="block text-foreground">{client.phoneNumber1}</span>
          ) : (
            <span className="block italic text-muted-foreground">Celular: {NO_INFO}</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        {billing.length > 0 ? (
          <div className="text-xs text-muted-foreground space-y-0.5">
            <span className="font-medium text-foreground block">{sortBilling[0].billingName}</span>
            <span className="block">
              {sortBilling[0].billingDocumentNumberType} {sortBilling[0].billingDocumentNumber}
            </span>
            <div className="flex gap-1 items-center">
              <span>{sortBilling[0].code} · </span>
              <span>{BILLING_STATUS_CONFIG[sortBilling[0].status].label}</span>
              {billing.length > 1 && (
                <BaseBadge
                  label={`+${billing.length - 1}`}
                  className="px-1.5 border border-success text-success bg-transparent font-normal"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="italic text-xs text-muted-foreground">Sin facturación</div>
        )}
      </TableCell>
      <TableCell className="font-medium text-xs">
        <span className={ORDER_TYPE_CONFIG[order.type].className}>{ORDER_TYPE_CONFIG[order.type].label}</span>
      </TableCell>
      <TableCell>
        <BaseBadge
          label={order.channel}
          className={SALES_CHANNEL_CONFIG[order.channel]?.className ?? DEFAULT_BADGE_CLASSNAME}
        />
      </TableCell>
      <TableCell>
        <BaseBadge {...ORDER_STATUS_CONFIG[order.status]} />
      </TableCell>
      <TableCell className="font-medium">{order.numProducts}</TableCell>
      <TableCell className="font-medium">{formatCurrency(order.totalSale)}</TableCell>
      <TableCell>
        <MoreHorizontal size={32} className="group-hover:bg-muted transition-colors p-2 rounded-4xl" />
      </TableCell>
    </TableRow>
  );
};
