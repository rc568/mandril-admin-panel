import type { z } from '@/lib/zod';
import type { updateRelatedOrderSchema } from '../../validators/order.validators';

export type UpdateRelatedOrderForm = z.infer<typeof updateRelatedOrderSchema>;
