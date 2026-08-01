import { TableCell, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/date-utils';
import { DEFAULT_BADGE_CLASSNAME, ORDER_STATUS_CONFIG, SALES_CHANNEL_CONFIG } from '../../constants/order.constants';
import type { OrderMapped } from '../../interfaces/ui';
import { BaseBadge } from '../base-badge';

interface Props {
  order: OrderMapped;
  onRowClick: (order: OrderMapped) => void;
}

export const OrderTableRow = ({ order, onRowClick }: Props) => {
  return (
    <TableRow key={order.id} onClick={() => onRowClick(order)} className="cursor-pointer">
      <TableCell>
        {order.invoiceType === 'SIN COMPROBANTE' ? (
          <div className="text-xs text-muted-foreground">SIN COMPROBANTE</div>
        ) : (
          <>
            <div className="font-medium text-foreground">{order.invoiceCode}</div>
            <div className="text-xs text-muted-foreground">
              {order.client.documentType} {order.client.documentNumber}
            </div>
          </>
        )}
      </TableCell>
      <TableCell>
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-sm text-foreground block">
            {order.client.bussinessName || 'Sin razón social'}
          </span>
          <span>Contacto: {order.client.contactName || 'Sin información'}</span>
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
