import { INVOICE_TYPE_KEYS, ORDER_STATUS } from '../constants/order.constants';
import type { InvoiceType, OrderStatus } from '../interfaces/api';

export const isOrderStatus = (value: string): value is OrderStatus => {
  return (ORDER_STATUS as string[]).includes(value);
};

export const isInvoiceType = (value: string): value is InvoiceType => {
  return (INVOICE_TYPE_KEYS as string[]).includes(value);
};
