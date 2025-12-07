export const ALL_ORDER_STATUS = 'ALL';

export const ORDER_STATUS_OPTIONS = {
  PENDING: 'Pendiente',
  PAID: 'Pagada',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  [ALL_ORDER_STATUS]: 'Todas'
} as const;

export const ORDER_STATUS_OPTIONS_ARRAY = Object.entries(ORDER_STATUS_OPTIONS).map(([key, value]) => ({
  key,
  value
}));

export const ORDER_STATUS = Object.keys(ORDER_STATUS_OPTIONS);
export const INVOICE_TYPE = ['FACTURA', 'BOLETA', 'SIN COMPROBANTE'];

export const CLIENT_DOCUMENT_TYPE = [
  'SIN DOCUMENTO',
  'CARNE DE EXTRANJERIA',
  'PASAPORTE',
  'DNI',
  'RUC',
  'OTRO'
] as const;

export const ORDER_SORT_BY_OPTIONS = ['total_sale_asc', 'total_sale_desc', 'date_asc', 'date_desc'] as const;
