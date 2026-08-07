import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { CheckboxProps } from '@radix-ui/react-checkbox';
import { useId, type RefAttributes } from 'react';
import { FormErrorMessage } from '../form-error-message';

type Base = CheckboxProps & RefAttributes<HTMLButtonElement>;

interface Props extends Base {
  label: string;
  error?: string;
}

export const CheckboxField = ({ label, error, id: customId, className, ...props }: Props) => {
  const generatedId = useId();
  const id = customId ?? generatedId;

  return (
    <div>
      <div className={cn('flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors', className)}>
        <Checkbox id={id} {...props} />
        <Label htmlFor={id} className="text-sm text-foreground cursor-pointer flex-1">
          {label}
        </Label>
      </div>
      <div className="ml-2">{error && <FormErrorMessage text={error} />}</div>
    </div>
  );
};
