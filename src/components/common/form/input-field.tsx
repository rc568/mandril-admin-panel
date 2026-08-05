import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useId, type ComponentProps } from 'react';
import { FormErrorMessage } from '../form-error-message';

interface Props extends ComponentProps<'input'> {
  label: string;
  error?: string;
}

export const InputField = ({ label, error, id: customId, className, ...props }: Props) => {
  const generatedId = useId();
  const id = customId || generatedId;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <Input id={id} className={cn('bg-background text-sm', className)} {...props} />
      {error && <FormErrorMessage text={error} />}
    </div>
  );
};
