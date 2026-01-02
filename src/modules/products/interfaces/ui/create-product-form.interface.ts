import type { z } from '@/lib/zod';
import type { createProductSchema } from '../../validators/product.validators';

export type CreateProductForm = z.infer<typeof createProductSchema>;
