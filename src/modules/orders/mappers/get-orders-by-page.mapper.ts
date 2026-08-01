import type { Order } from '../interfaces/api';
import type { OrderMapped } from '../interfaces/ui';

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
