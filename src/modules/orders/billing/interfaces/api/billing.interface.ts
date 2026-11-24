export type InvoiceType = 'FACTURA' | 'BOLETA' | 'SIN COMPROBANTE';
export type BillingStatus = 'PENDING' | 'ISSUED' | 'VOIDED';
export type BillingReceiptType = Exclude<InvoiceType, 'SIN COMPROBANTE'>;
