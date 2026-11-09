import type { z } from '@/lib/zod';
import type { updateOrderSchema } from '../../validators/order.validators';
import type { OrderProductResponse } from '../api';

type UpdateOrderSchema = z.infer<typeof updateOrderSchema>;
type UpdateOrderProductSchema = NonNullable<UpdateOrderSchema['products']>[number];

export type UpdateOrderProductForm = UpdateOrderProductSchema & {
  name: string;
  code: string;
  purchasePrice: number;
  currentStock: number;
  availabilityKnown: boolean;
  variantAttributes: OrderProductResponse['variantAttributes'];
};

export type UpdateOrderForm = Omit<UpdateOrderSchema, 'products'> & {
  products: UpdateOrderProductForm[];
};
