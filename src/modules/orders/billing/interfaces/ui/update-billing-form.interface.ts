import type { z } from '@/lib/zod';
import type { updateBillingSchema } from '../../validators/billing.validators';

export type UpdateBillingForm = z.infer<typeof updateBillingSchema>;
