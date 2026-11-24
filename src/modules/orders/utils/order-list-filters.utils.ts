import { formatShortDate } from '@/lib/date-utils';
import type { SalesChannel } from '@/services/sales-channel/interfaces/sales-channel.interface';
import { BILLING_STATUS_CONFIG, INVOICE_TYPE_CONFIG } from '../billing/constants/billing.constants';
import { isBillingStatus, isInvoiceType } from '../billing/utils/type-guards.utils';
import type { LocalOrderFilters } from '../components/order-list-section/order-list-filters';
import { ORDER_STATUS_CONFIG } from '../constants/order.constants';
import { isOrderStatus } from './type-guards.utils';

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
      return isOrderStatus(value) ? `Orden ${ORDER_STATUS_CONFIG[value].label.toLowerCase()}` : value;

    case 'billingStatus':
      return isBillingStatus(value) ? `Comprobante ${BILLING_STATUS_CONFIG[value].label.toLowerCase()}` : value;

    case 'channel': {
      const channelName = salesChannel?.find((sc) => sc.id.toString() === value);
      return channelName?.channel ?? 'Canal de venta no válido.';
    }

    case 'receiptType':
      return isInvoiceType(value) ? INVOICE_TYPE_CONFIG[value].label : value;

    default:
      return value;
  }
};
