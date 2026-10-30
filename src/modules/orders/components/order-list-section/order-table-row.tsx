import { TableCell, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/date-utils';
import {
  DEFAULT_BADGE_CLASSNAME,
  NO_INFO,
  ORDER_STATUS_CONFIG,
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

  return (
    <TableRow key={order.id} onClick={() => onRowClick(order)} className="cursor-pointer">
      <TableCell>
        {billing.length > 1 ? (
          <div className="text-xs">Existe más de una factura</div>
        ) : billing.length === 1 ? (
          <>
            <div className="font-medium text-foreground">{billing[0].code}</div>
            <div className="text-xs text-muted-foreground">
              {billing[0].billingDocumentNumberType} {billing[0].billingDocumentNumber}
            </div>
          </>
        ) : (
          <div className="text-xs text-muted-foreground">Sin facturación</div>
        )}
      </TableCell>
      <TableCell>
        <div className="text-xs text-muted-foreground">
          <span className="block">Contacto: {client.contactName || NO_INFO}</span>
          <span className="block">Celular: {client.phoneNumber1 || NO_INFO}</span>
        </div>
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
      <TableCell>{order.numProducts}</TableCell>
      <TableCell>{formatCurrency(order.totalSale)}</TableCell>
      <TableCell>{formatDate(order.createdAt)}</TableCell>
      <TableCell>{order.createdBy}</TableCell>
    </TableRow>
  );
};
