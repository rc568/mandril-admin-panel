import { BILLING_STATUS, INVOICE_TYPE_KEYS } from '../constants/billing.constants';
import type { BillingStatus, InvoiceType } from '../interfaces/api';

export const isInvoiceType = (value: string): value is InvoiceType => {
  return (INVOICE_TYPE_KEYS as string[]).includes(value);
};

export const isBillingStatus = (value: string): value is BillingStatus => {
  return (BILLING_STATUS as string[]).includes(value);
};
