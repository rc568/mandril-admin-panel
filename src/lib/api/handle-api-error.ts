import { commonMessages } from '@/constants/messages';
import type { ApiError, ValidationError } from '@/types/api/api-error';
import { isAxiosError } from 'axios';

export type HandledApiError = { type: 'validation'; errors: ValidationError[] } | { type: 'message'; message: string };

export const handleApiError = (error: unknown): HandledApiError => {
  if (isAxiosError<ApiError>(error)) {
    const apiError = error.response?.data;

    if (apiError?.validationErrors?.length) {
      return {
        type: 'validation',
        errors: apiError.validationErrors
      };
    }

    return {
      type: 'message',
      message: apiError?.message ?? commonMessages.UNEXPECTED_ERROR
    };
  }

  return {
    type: 'message',
    message: commonMessages.UNEXPECTED_ERROR
  };
};
