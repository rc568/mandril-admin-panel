import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useId, type ComponentProps } from 'react';
import { FormErrorMessage } from '../form-error-message';

interface Props extends ComponentProps<typeof Textarea> {
  label: string;
  error?: string;
}

export const TextareaField = ({ label, error, id: customId, className, ...props }: Props) => {
  const generatedId = useId();
  const id = customId || generatedId;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <Textarea id={id} className={cn('bg-background text-sm', className)} {...props} />
      {error && <FormErrorMessage text={error} />}
    </div>
  );
};
