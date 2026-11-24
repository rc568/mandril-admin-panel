import type { BillingStatus, InvoiceType } from '../interfaces/api';

export const BILLING_STATUS_CONFIG = {
  PENDING: { label: 'Pendiente', className: 'border-yellow-800 text-yellow-800' },
  ISSUED: { label: 'Emitido', className: 'border-green-800 text-green-800' },
  VOIDED: { label: 'Anulado', className: 'border-red-800 text-red-800' }
} as const satisfies Record<BillingStatus, { label: string; className: string }>;
export const BILLING_STATUS = Object.keys(BILLING_STATUS_CONFIG) as BillingStatus[];

export const INVOICE_TYPE_CONFIG: Record<InvoiceType, { label: string }> = {
  FACTURA: { label: 'Factura' },
  BOLETA: { label: 'Boleta' },
  'SIN COMPROBANTE': { label: 'Sin Comprobante' }
} as const;

export const INVOICE_TYPE_KEYS = Object.keys(INVOICE_TYPE_CONFIG) as InvoiceType[];
export const INVOICE_TYPES_ARRAY = Object.entries(INVOICE_TYPE_CONFIG).map(([key, value]) => ({
  key,
  label: value.label
}));
