import type { z } from '@/lib/zod';
import type { getIssueBillingSchema } from '../../validators/billing.validators';

export type IssueBillingForm = z.infer<ReturnType<typeof getIssueBillingSchema>>;
