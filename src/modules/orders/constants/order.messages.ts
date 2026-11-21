export const messages = {
  ORDER_CREATED: 'Orden creada exitosamente.',
  BILLING_CREATED: 'Comprobante registrado exitosamente.',
  ORDER_UPDATED: 'Orden actualizada exitosamente.',
  ORDER_NOT_MODIFIED: 'No se han realizado modificaciones en la orden.',
  ORDER_FIELDS_CANNOT_BE_CLEARED: 'El servicio no permite borrar información existente de una orden.',
  VALIDATION: {
    CLIENT_DATA_REQUIRED: 'Ingresa al menos un dato del cliente.',
    CLIENT_DOCUMENT_NUMBER_REQUIRED: 'Debe definirse el número de documento.',
    CLIENT_DOCUMENT_NUMBER_NOT_ALLOWED: 'No debe definirse un número de documento para esta opción.',
    CLIENT_DOCUMENT_TYPE_REQUIRED: 'Selecciona el tipo de documento.',
    DUPLICATE_PRODUCT: 'No agregues el mismo producto más de una vez.',
    NO_SALE_PRODUCTS_ON_EXCHANGE_ORDER: 'No hay productos de venta en la orden de cambio.',
    EXCHANGE_REQUIRES_BOTH_PRODUCT_TYPES:
      'Una orden de cambio debe incluir al menos un producto devuelto y uno entregado.',
    PHONE_NUMBER_INVALID: 'Ingresa el número con código de país, por ejemplo +51912345678.',
    BILLING_REQUIRES_BILLABLE_ORDER: 'Para registrar un comprobante, la orden debe estar pagada o completada.'
  }
} as const;
