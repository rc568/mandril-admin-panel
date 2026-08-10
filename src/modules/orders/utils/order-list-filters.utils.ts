import { formatShortDate } from '@/lib/date-utils';
import type { SalesChannel } from '@/services/sales-channel/interfaces/sales-channel.interface';
import type { LocalOrderFilters } from '../components/order-list-section/order-list-filters';
import { INVOICE_TYPE_CONFIG, ORDER_STATUS_CONFIG } from '../constants/order.constants';

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
      return ORDER_STATUS_CONFIG[value as keyof typeof ORDER_STATUS_CONFIG].label || value;

    case 'channel': {
      const channelName = salesChannel?.find((sc) => sc.id.toString() === value);
      return channelName?.channel ?? 'Canal de venta no válido.';
    }

    case 'invoiceType':
      return INVOICE_TYPE_CONFIG[value as keyof typeof INVOICE_TYPE_CONFIG].label || value;

    default:
      return value;
  }
};
