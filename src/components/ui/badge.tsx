import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border font-semibold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow-[0_2px_10px_-2px_hsl(var(--primary)/0.6)]',
        secondary: 'border-foreground/10 bg-foreground/[0.05] text-secondary-foreground backdrop-blur-sm',
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow-[0_2px_10px_-2px_rgba(239,68,68,0.5)]',
        accent: 'border-transparent bg-accent text-accent-foreground shadow-[0_2px_10px_-2px_hsl(var(--accent)/0.6)]',
        warm: 'border-transparent bg-warm text-warm-foreground shadow-[0_2px_10px_-2px_hsl(var(--warm)/0.5)]',
        outline: 'text-foreground border-foreground/15 bg-foreground/[0.02]',
        success: 'border-transparent bg-emerald-500/15 text-emerald-400',
        warning: 'border-transparent bg-amber-500/15 text-amber-400',
        glass: 'border-foreground/10 bg-foreground/[0.08] text-foreground backdrop-blur-md',
      },
      size: {
        default: 'px-2.5 py-0.5 text-[11px]',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };