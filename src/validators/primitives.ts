import { validationMessages } from '@/constants/validation-messages';
import { z } from '@/lib/zod';

export const optionalString = <T extends z.ZodType>(schema: T) =>
  z.preprocess((val) => (val === '' ? undefined : val), schema.optional());

export const integerId = z
  .int({ error: validationMessages.invalidSelection })
  .positive({ error: validationMessages.positiveNumber });

export const emailSchema = z.email({ error: validationMessages.invalidEmail });

// NUMBER
export const nonNegativeNumber = z
  .number({ error: validationMessages.invalidNumber })
  .min(0, { error: validationMessages.minNum(0) });

export const positiveNumber = nonNegativeNumber.positive({ error: validationMessages.positiveNumber });

const integerNumber = z.int({ error: validationMessages.integerNumber });

export const integerNonNegativeNumber = integerNumber.min(0, { error: validationMessages.minNum(0) });

export const integerPositiveNumber = integerNumber.min(1, { error: validationMessages.minNum(1) });

// STRING
export const baseTextSchema = (minimum: number, maximum?: number) => {
  const stringSchema = z
    .string({ error: validationMessages.invalidType })
    .trim()
    .min(minimum, { error: validationMessages.minLength(minimum) });

  if (maximum === undefined) return stringSchema;

  return stringSchema.max(maximum, { error: validationMessages.maxLength(maximum) });
};

export const regexSchema = (regex: RegExp, errorMessage: string = validationMessages.invalidRegex) => {
  return z.string().regex(regex, { error: errorMessage });
};
