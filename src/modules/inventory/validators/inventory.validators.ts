import { z } from '@/lib/zod';
import { nonNegativeInt32, smallIntPositive } from '@/lib/zod/zod-helpers';

export const adjustInventorySchema = z.strictObject({
  productVariantId: smallIntPositive(),
  bucket: z.enum(['AVAILABLE', 'QUARANTINE', 'DEFECTIVE']),
  countedQuantity: nonNegativeInt32(),
  reason: z.string().trim().min(1).max(1000)
});
