import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

type TooltipVariants = VariantProps<typeof tooltipVariants>;

const tooltipVariants = cva(
  'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md text-balance',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background ring ring-foreground',
        success: 'bg-success text-white ring ring-success',
        error: 'bg-destructive text-white ring ring-destructive',
        warning: 'bg-warning text-black ring ring-warning',
        outline: 'bg-background text-foreground ring ring-border'
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

const arrowVariants: Record<'polyline' | 'polygon', Record<NonNullable<TooltipVariants['variant']>, string>> = {
  polygon: {
    default: 'fill-foreground',
    success: 'fill-success',
    error: 'fill-destructive',
    warning: 'fill-warning',
    outline: 'fill-background'
  },
  polyline: {
    default: 'stroke-foreground',
    success: 'stroke-success',
    error: 'stroke-destructive',
    warning: 'stroke-warning',
    outline: 'stroke-border'
  }
};

function TooltipProvider({ delayDuration = 0, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />;
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 2,
  children,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & TooltipVariants) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(tooltipVariants({ variant, size }), className, '-translate-y-0.5')}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow asChild>
          <svg viewBox="0 0 10 5" className="translate-y-[calc(-50%+2.5px)] w-2.5 h-[5px]">
            <polygon points="0,0 10,0 5,5" className={arrowVariants.polygon[variant ?? 'default']} />
            <polyline
              points="0,0 5,5 10,0"
              className={arrowVariants.polyline[variant ?? 'default']}
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </TooltipPrimitive.Arrow>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
