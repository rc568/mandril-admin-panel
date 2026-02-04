import type { z } from '@/lib/zod';
import type { baseProductSchema, createProductSchema } from '../../validators/product.validators';

export type CreateProductForm = z.infer<typeof createProductSchema>;
export type BaseProductFields = z.infer<typeof baseProductSchema>;
