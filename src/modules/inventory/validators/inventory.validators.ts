import { z } from '@/lib/zod';

export const adjustInventorySchema = z.strictObject({
  productVariantId: z.int().min(1).max(32767),
  bucket: z.enum(['AVAILABLE', 'QUARANTINE', 'DEFECTIVE']),
  countedQuantity: z.int().min(0).max(2147483647),
  reason: z.string().trim().min(1).max(1000)
});
