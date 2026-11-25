import type { z } from '@/lib/zod';
import type { createBillingSchema } from '../../validators/billing.validators';

export type CreateBillingForm = z.infer<typeof createBillingSchema>;
