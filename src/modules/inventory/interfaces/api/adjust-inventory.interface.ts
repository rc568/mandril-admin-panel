import type { z } from '@/lib/zod';
import type { adjustInventorySchema } from '../../validators/inventory.validators';

export type AdjustInventoryPayload = z.infer<typeof adjustInventorySchema>;

export interface AdjustInventoryResponse {
  previousQuantity: number;
  quantity: number;
  movement: { id: string } | null;
}
