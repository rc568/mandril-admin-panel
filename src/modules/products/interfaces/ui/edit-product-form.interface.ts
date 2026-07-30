import type { z } from '@/lib/zod';
import type { editProductSchema } from '../../validators/product.validators';

export type EditProductForm = z.infer<typeof editProductSchema>;
