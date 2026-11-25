import type { IdentityDocumentType } from '@/constants/interfaces/document.interface';
import type { BillingStatus, InvoiceType } from '../interfaces/api';

export const IDENTITY_DOCUMENT_TYPE_KEYS: IdentityDocumentType[] = [
  'SIN DOCUMENTO',
  'CARNE DE EXTRANJERIA',
  'PASAPORTE',
  'DNI',
  'RUC',
  'OTRO'
];

export const RUC_REGEX = /^\d{11}$/;
export const INVOICE_CODE_BOLETA_REGEX = /^EB01-\d{4}$/;
export const INVOICE_CODE_FACTURA_REGEX = /^E001-\d{4}$/;

export const BILLING_VALIDATION_MESSAGES = {
  BILLING_NAME_REQUIRED: 'Ingrese la razón social o el nombre del cliente.',
  AMOUNT_MUST_BE_POSITIVE: 'El importe debe ser mayor que cero.',
  DOCUMENT_TYPE_INVALID_FOR_INVOICE: 'Las facturas requieren un documento RUC.',
  DOCUMENT_TYPE_INVALID_FOR_RECEIPT: 'Las boletas no admiten RUC.',
  DOCUMENT_NUMBER_REQUIRED: 'Ingrese el número del documento seleccionado.',
  DOCUMENT_NUMBER_NOT_ALLOWED: 'No ingrese un número si seleccionaste Sin documento.',
  RUC_INVALID: 'El RUC debe tener 11 dígitos.',
  BILLING_CODE_REQUIRED: 'Ingresa el código del comprobante emitido.',
  BILLING_CODE_INVALID: 'El código no tiene el formato esperado para este comprobante.',
  CODE_NOT_ALLOWED_ON_PENDING: 'Un comprobante pendiente no debe tener código.'
} as const;

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
