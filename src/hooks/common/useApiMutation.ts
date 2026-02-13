import { handleApiError } from '@/lib/api/handle-api-error';
import { notifyToast } from '@/lib/toast/toast-adapter';
import type { ApiError } from '@/types/api/api-error';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

interface Props<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage?: string;
  onSuccess?: (data: TData) => void;
  onError?: (error: AxiosError<ApiError>) => void;
}

export const useApiMutation = <TData, TVariables>({
  mutationFn,
  successMessage,
  onSuccess,
  onError
}: Props<TData, TVariables>) => {
  return useMutation<TData, AxiosError<ApiError>, TVariables>({
    mutationFn: mutationFn,
    onSuccess: (data) => {
      if (successMessage) notifyToast.success(successMessage);
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) {
        onError(error);
        return;
      }

      const result = handleApiError(error);
      if (result.type === 'validation') {
        notifyToast.validationError(result.errors);
        return;
      }
      notifyToast.error(result.message);
    }
  });
};
