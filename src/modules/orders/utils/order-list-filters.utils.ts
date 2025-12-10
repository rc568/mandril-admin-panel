import { formatShortDate } from '@/lib/date-utils';
import type { SalesChannel } from '@/services/sales-channel/interfaces/sales-channel.interface';
import type { LocalOrderFilters } from '../components/order-list-filters';
import { INVOICE_TYPE, ORDER_STATUS_OPTIONS } from '../constants/order.constants';

const getChannelDisplayMap = (options: SalesChannel[] = []) => {
  if (!options) return {};
  return options.reduce(
    (acc, curr) => {
      acc[curr.id.toString()] = curr.channel;
      return acc;
    },
    {} as Record<string, string>
  );
};

export const getFilterDisplayValue = (
  key: keyof LocalOrderFilters,
  value: string | Date | undefined,
  salesChannel: SalesChannel[]
): string => {
  if (!value) return '';

  if (value instanceof Date) {
    return key === 'startDate' ? `Desde: ${formatShortDate(value)}` : `Hasta: ${formatShortDate(value)}`;
  }

  const stringValue = String(value);
  const channelMap = getChannelDisplayMap(salesChannel);

  switch (key) {
    case 'status':
      return ORDER_STATUS_OPTIONS[stringValue as keyof typeof ORDER_STATUS_OPTIONS] || stringValue;

    case 'channel':
      return channelMap[stringValue] || stringValue;

    case 'invoiceType':
      return INVOICE_TYPE[stringValue as keyof typeof INVOICE_TYPE] || stringValue;

    default:
      return stringValue;
  }
};
