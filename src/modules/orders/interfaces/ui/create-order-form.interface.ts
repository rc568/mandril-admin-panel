import type { z } from '@/lib/zod';
import type { ProductVariant } from '@/modules/products/interfaces/api/product.interface';
import type { createOrderSchema, orderProductSchema } from '../../validators/order.validators';

// Add types for UI / TS ONLY
export type OrderProductForm = z.infer<typeof orderProductSchema> & {
  name: string;
  code: string;
  purchasePrice: number;
  currentStock: number;
  variantAttributes: Pick<ProductVariant, 'variantAttributes'>['variantAttributes'];
};

export type CreateOrderForm = Omit<z.infer<typeof createOrderSchema>, 'invoiceCode' | 'products'> & {
  invoiceCode?: string;
  client: {
    documentNumber?: string;
    bussinessName?: string;
  };
  products: OrderProductForm[];
};

export type CreateOrderPayload = z.infer<typeof createOrderSchema>;
