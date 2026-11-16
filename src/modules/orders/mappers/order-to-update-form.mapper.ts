import type { Order } from '../interfaces/api';
import type { UpdateOrderForm } from '../interfaces/ui/update-order-form.interface';

export const mapOrderToUpdateForm = (order: Order, salesChannelId: number): UpdateOrderForm => ({
  salesChannelId,
  status: order.status as UpdateOrderForm['status'],
  observation: order.observation ?? '',
  client: {
    contactName: order.client.contactName ?? '',
    email: order.client.email ?? '',
    phoneNumber1: order.client.phoneNumber1 ?? '',
    phoneNumber2: '',
    documentNumberType: order.client.documentNumberType ?? undefined,
    documentNumber: order.client.documentNumber ?? ''
  },
  products: order.products.map((product) => ({
    variantId: product.variantId,
    type: 'SALE',
    price: Number(product.price),
    quantity: product.quantity,
    name: product.name,
    code: product.code,
    purchasePrice: Number(product.purchasePrice),
    currentStock: 0,
    availabilityKnown: false,
    variantAttributes: product.variantAttributes
  }))
});
