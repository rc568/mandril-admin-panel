export const ALL_ORDER_STATUS = 'ALL';

export const ORDER_STATUS_OPTIONS = {
  PENDING: 'Pendiente',
  PAID: 'Pagada',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada'
} as const;

export const ORDER_STATUS_OPTIONS_ARRAY = Object.entries(ORDER_STATUS_OPTIONS).map(([key, value]) => ({
  key,
  value
}));

export const ORDER_STATUS_OPTIONS_WITH_ALL = [{ key: ALL_ORDER_STATUS, value: 'Todas' }, ...ORDER_STATUS_OPTIONS_ARRAY];

export const ORDER_STATUS = Object.keys(ORDER_STATUS_OPTIONS);

export const INVOICE_TYPE = {
  FACTURA: 'Factura',
  BOLETA: 'Boleta',
  'SIN COMPROBANTE': 'Sin Comprobante'
} as const;

export const INVOICE_TYPE_KEYS = Object.keys(INVOICE_TYPE);
export const INVOICE_TYPES_ARRAY = Object.entries(INVOICE_TYPE).map(([key, value]) => ({ key, value }));

export const CLIENT_DOCUMENT_TYPE = [
  'SIN DOCUMENTO',
  'CARNE DE EXTRANJERIA',
  'PASAPORTE',
  'DNI',
  'RUC',
  'OTRO'
] as const;

export const ORDER_SORT_BY_OPTIONS = {
  total_sale_asc: 'Menor monto',
  total_sale_desc: 'Mayor monto',
  date_asc: 'Más antiguo',
  date_desc: 'Más reciente'
} as const;

export const ORDER_SORT_BY_ARRAY = Object.keys(ORDER_SORT_BY_OPTIONS);
export const ORDER_SORT_BY_ENTRIES = Object.entries(ORDER_SORT_BY_OPTIONS).map(([key, value]) => ({ key, value }));
