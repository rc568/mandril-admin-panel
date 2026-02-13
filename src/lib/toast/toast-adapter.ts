import { ValidationErrorList } from '@/components/common/validation-error-list';
import type { ValidationError } from '@/types/api/api-error';
import { createElement } from 'react';
import { toast } from 'sonner';

export const notifyToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  validationError: (errors: ValidationError[]) => toast.error(createElement(ValidationErrorList, { errors }))
};
