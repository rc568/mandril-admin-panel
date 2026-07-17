import { z } from '.';

export const optionalString = (schema: z.ZodType) =>
  z.preprocess((val) => (val === '' ? undefined : val), schema.optional());

export const baseStringSchema = z.string().trim().min(1);
