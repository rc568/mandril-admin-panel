import type { OrderMapped } from '../interfaces/api/get-orders-mapped.interface';
import type { Order } from '../interfaces/api/order.interface';

export const mapOrderToDisplay = (order: Order): OrderMapped => {
  const { products, ...rest } = order;

  const mapped: OrderMapped = {
    ...rest,
    products: products.map((product) => {
      return {
        ...product,
        subTotal: (parseFloat(product.price) * product.quantity).toString()
      };
    })
  };

  return mapped;
};
