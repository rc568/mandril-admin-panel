import { adjustInventory } from '../api/inventory.api';
import type { AdjustInventoryPayload } from '../interfaces/api';

export const adjustInventoryAction = (body: AdjustInventoryPayload) => adjustInventory(body);
