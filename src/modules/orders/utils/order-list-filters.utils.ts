import { formatShortDate } from '@/lib/date-utils';
import type { SalesChannel } from '@/services/sales-channel/interfaces/sales-channel.interface';
import type { LocalOrderFilters } from '../components/order-list-section/order-list-filters';
import { INVOICE_TYPE_CONFIG, ORDER_STATUS_CONFIG } from '../constants/order.constants';
import { isInvoiceType, isOrderStatus } from './type-guards.utils';

export const getFilterDisplayValue = (
  key: keyof LocalOrderFilters,
  value: string | Date,
  salesChannel?: SalesChannel[]
): string => {
  if (value instanceof Date) {
    if (key === 'startDate') return `Desde: ${formatShortDate(value)}`;
    return `Hasta: ${formatShortDate(value)}`;
  }

  if (key === 'channel' && !salesChannel) return 'Canal de venta no válido.';

  switch (key) {
    case 'status':
      return isOrderStatus(value) ? ORDER_STATUS_CONFIG[value].label : value;

    case 'channel': {
      const channelName = salesChannel?.find((sc) => sc.id.toString() === value);
      return channelName?.channel ?? 'Canal de venta no válido.';
    }

    case 'invoiceType':
      return isInvoiceType(value) ? INVOICE_TYPE_CONFIG[value].label : value;

    default:
      return value;
  }
};
