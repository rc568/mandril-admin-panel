import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/date-utils';
import type { OrderMapped } from '../interfaces/api/get-orders-mapped.interface';
import type { Order } from '../interfaces/api/order.interface';

export const mapOrderToDisplay = (order: Order): OrderMapped => {
  const { products, ...rest } = order;

  const mapped: OrderMapped = {
    ...rest,
    totalSale: formatCurrency(parseFloat(rest.totalSale)),
    createdAt: formatDate(rest.createdAt),
    products: products.map((product) => {
      return {
        ...product,
        price: formatCurrency(parseFloat(product.price)),
        subTotal: formatCurrency(parseFloat(product.price) * product.quantity)
      };
    })
  };

  return mapped;
};
