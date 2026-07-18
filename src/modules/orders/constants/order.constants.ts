import type { DocumentType, InvoiceType, OrderStatus } from '../interfaces/api/order.interface';

export const NO_INFO = 'Sin información';
export const ALL_ORDER_STATUS = 'ALL';
export const DEFAULT_BADGE_CLASSNAME = 'bg-gray-100 text-gray-800';

export const ORDER_STATUS_CONFIG = {
  PENDING: { label: 'Pendiente', className: 'bg-gray-100 text-gray-800' },
  PAID: { label: 'Pagada', className: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: 'Completada', className: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelada', className: 'bg-red-100 text-red-800' }
} as const satisfies Record<OrderStatus, { label: string; className: string }>;

export const ORDER_STATUS = Object.keys(ORDER_STATUS_CONFIG) as OrderStatus[];

export const ORDER_STATUS_OPTIONS_ARRAY = Object.entries(ORDER_STATUS_CONFIG).map(([key, value]) => ({
  key,
  label: value.label
}));

export const ORDER_STATUS_OPTIONS_WITH_ALL = [{ key: ALL_ORDER_STATUS, label: 'Todas' }, ...ORDER_STATUS_OPTIONS_ARRAY];

export const SALES_CHANNEL_CONFIG: Record<string, { className: string }> = {
  WhatsApp: { className: 'bg-green-100 text-green-800' },
  'Falabella.com': { className: 'bg-green-800 text-green-100' },
  Agora: { className: 'bg-blue-100 text-blue-800' },
  'Mercado Libre': { className: 'bg-amber-100 text-amber-800' },
  Ripley: { className: 'bg-purple-100 text-purple-800' },
  Linio: { className: 'bg-orange-500 text-orange-100' }
};

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

export const CLIENT_DOCUMENT_TYPE_CONFIG: Record<DocumentType, { label: string }> = {
  'SIN DOCUMENTO': { label: 'Sin documento' },
  'CARNE DE EXTRANJERIA': { label: 'Carne de extranjería' },
  PASAPORTE: { label: 'Pasaporte' },
  DNI: { label: 'DNI' },
  RUC: { label: 'RUC' },
  OTRO: { label: 'Otro' }
};
export const CLIENT_DOCUMENT_TYPE_KEYS = Object.keys(CLIENT_DOCUMENT_TYPE_CONFIG) as DocumentType[];

export const ORDER_SORT_BY_OPTIONS = {
  total_sale_asc: 'Menor monto',
  total_sale_desc: 'Mayor monto',
  date_asc: 'Más antiguo',
  date_desc: 'Más reciente'
} as const;

export const ORDER_SORT_BY_ARRAY = Object.keys(ORDER_SORT_BY_OPTIONS);
export const ORDER_SORT_BY_ENTRIES = Object.entries(ORDER_SORT_BY_OPTIONS).map(([key, value]) => ({ key, value }));

export const RUC_REGEX = /^\d{11}$/;
export const INVOICE_CODE_BOLETA_REGEX = /^EB01-\d{4}$/;
export const INVOICE_CODE_FACTURA_REGEX = /^E001-\d{4}$/;
