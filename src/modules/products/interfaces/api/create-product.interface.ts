import type { z } from '@/lib/zod';
import type { createProductSchema } from '../../validators/product.validators';
import type { Product } from './product.interface';

export type CreateProductResponse = Product;
export type CreateProductPayload = z.infer<typeof createProductSchema>;
