import { validationMessages } from '@/constants/validation-messages';
import type { z } from 'zod';

export const customErrorMap: z.core.$ZodErrorMap = (iss) => {
  if (iss.code === 'invalid_type') {
    if (iss.input === undefined) return validationMessages.invalidSelection;
    return validationMessages.invalidType;
  }

  if (iss.code === 'invalid_value') {
    return validationMessages.invalidSelection;
  }

  if (iss.code === 'too_small') {
    if (iss.origin === 'array') return validationMessages.minElementsArray(iss.minimum);
    if (iss.origin === 'number') return validationMessages.minNum(iss.minimum);
    if (iss.origin === 'string') return validationMessages.minLength(iss.minimum);
  }

  if (iss.code === 'too_big') {
    if (iss.origin === 'array') return validationMessages.maxElementsArray(iss.maximum);
    if (iss.origin === 'number') return validationMessages.maxNum(iss.maximum);
    if (iss.origin === 'string') return validationMessages.maxLength(iss.maximum);
  }

  return undefined;
};
