import { z } from '.';

export const optionalString = (schema: z.ZodType) =>
  z.preprocess((val) => (val === '' ? undefined : val), schema.optional());

export const baseStringSchema = z.string().trim().min(1);

export const smallIntPositive = () => z.int().min(1).max(32767);
export const nonNegativeInt32 = () => z.int().min(0).max(2147483647);
