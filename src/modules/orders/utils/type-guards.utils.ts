import { BILLING_STATUS, INVOICE_TYPE_KEYS, ORDER_STATUS } from '../constants/order.constants';
import type { BillingStatus, InvoiceType, OrderStatus } from '../interfaces/api';

export const isOrderStatus = (value: string): value is OrderStatus => {
  return (ORDER_STATUS as string[]).includes(value);
};

export const isInvoiceType = (value: string): value is InvoiceType => {
  return (INVOICE_TYPE_KEYS as string[]).includes(value);
};

export const isBillingStatus = (value: string): value is BillingStatus => {
  return (BILLING_STATUS as string[]).includes(value);
};
