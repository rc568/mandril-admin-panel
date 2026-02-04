import type { z } from '@/lib/zod';
import type { editProductSchema } from '../../validators/product.validators';

export type ProductEditFormMapper = z.infer<typeof editProductSchema>;
