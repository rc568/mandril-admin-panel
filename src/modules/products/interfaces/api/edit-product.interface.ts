import type { z } from '@/lib/zod';
import type { editProductSchema } from '../../validators/product.validators';
import type { Product } from './product.interface';

export type EditProductResponse = Product;
export type EditProductPayload = z.infer<typeof editProductSchema>;
