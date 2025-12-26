import type { z } from '@/lib/zod';
import type { productEditSchema } from '../../validators/product.validators';

export type ProductEditFormMapper = z.infer<typeof productEditSchema>;
